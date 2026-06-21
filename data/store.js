// Global app state with on-device persistence.
//
// This replaces the useState-in-one-component approach from the web prototype.
// In a multi-screen Expo Router app, each tab is a separate file, so shared
// data (logs, protocols, bloodwork) lives here in a context provider and is
// saved to AsyncStorage so it survives app restarts.
//
// Later, when you add accounts, you swap the AsyncStorage calls for Supabase
// reads/writes — the rest of the app keeps calling the same hooks.

import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StoreContext = createContext(null);

const KEYS = {
  logs: "stacktrack:logs",
  protocols: "stacktrack:protocols",
  bloodwork: "stacktrack:bloodwork",
  sites: "stacktrack:sites",
};

export function StoreProvider({ children }) {
  const [logs, setLogs] = useState([]);
  const [protocols, setProtocols] = useState([]);
  const [bloodwork, setBloodwork] = useState([]);
  const [sites, setSites] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted data on first mount
  useEffect(() => {
    (async () => {
      try {
        const [l, p, b, s] = await Promise.all([
          AsyncStorage.getItem(KEYS.logs),
          AsyncStorage.getItem(KEYS.protocols),
          AsyncStorage.getItem(KEYS.bloodwork),
          AsyncStorage.getItem(KEYS.sites),
        ]);
        if (l) setLogs(JSON.parse(l));
        if (p) setProtocols(JSON.parse(p));
        if (b) setBloodwork(JSON.parse(b));
        if (s) setSites(JSON.parse(s));
      } catch (e) {
        console.warn("Failed to load saved data", e);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  // Persist whenever a slice changes (after initial hydration)
  useEffect(() => { if (hydrated) AsyncStorage.setItem(KEYS.logs, JSON.stringify(logs)); }, [logs, hydrated]);
  useEffect(() => { if (hydrated) AsyncStorage.setItem(KEYS.protocols, JSON.stringify(protocols)); }, [protocols, hydrated]);
  useEffect(() => { if (hydrated) AsyncStorage.setItem(KEYS.bloodwork, JSON.stringify(bloodwork)); }, [bloodwork, hydrated]);
  useEffect(() => { if (hydrated) AsyncStorage.setItem(KEYS.sites, JSON.stringify(sites)); }, [sites, hydrated]);

  // Convenience actions
  const addLog = (log) => setLogs((prev) => [...prev, { ...log, id: Date.now(), timestamp: new Date().toISOString() }]);
  const addProtocol = (proto) => setProtocols((prev) => [...prev, { ...proto, id: Date.now(), createdAt: new Date().toISOString() }]);
  const toggleProtocol = (id) => setProtocols((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  const deleteProtocol = (id) => setProtocols((prev) => prev.filter((p) => p.id !== id));
  const addBloodwork = (panel) => setBloodwork((prev) => [...prev, { ...panel, id: Date.now() }]);
  const addSite = (entry) => setSites((prev) => [...prev, { ...entry, date: new Date().toISOString() }]);

  const value = {
    hydrated,
    logs, setLogs, addLog,
    protocols, setProtocols, addProtocol, toggleProtocol, deleteProtocol,
    bloodwork, setBloodwork, addBloodwork,
    sites, setSites, addSite,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
