// Bloodwork tracker. Log a panel of biomarkers, auto-flag low/normal/high vs
// reference ranges, save to the store, and review past panels.

import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet } from "react-native";
import { useStore } from "../../data/store";
import { colors, fonts, cardStyle } from "../../theme/colors";

// high: 999 means "no upper bound" (higher is fine)
const BIOMARKERS = [
  { name: "Total Testosterone", unit: "ng/dL", low: 300, high: 1000, cat: "Hormones" },
  { name: "Free Testosterone", unit: "pg/mL", low: 9, high: 30, cat: "Hormones" },
  { name: "Estradiol (E2)", unit: "pg/mL", low: 10, high: 40, cat: "Hormones" },
  { name: "LH", unit: "mIU/mL", low: 1.7, high: 8.6, cat: "Hormones" },
  { name: "FSH", unit: "mIU/mL", low: 1.5, high: 12.4, cat: "Hormones" },
  { name: "SHBG", unit: "nmol/L", low: 10, high: 57, cat: "Hormones" },
  { name: "IGF-1", unit: "ng/mL", low: 115, high: 355, cat: "Hormones" },
  { name: "Prolactin", unit: "ng/mL", low: 2, high: 18, cat: "Hormones" },
  { name: "Hematocrit", unit: "%", low: 38.3, high: 48.6, cat: "CBC" },
  { name: "Hemoglobin", unit: "g/dL", low: 13.5, high: 17.5, cat: "CBC" },
  { name: "RBC", unit: "M/uL", low: 4.5, high: 5.9, cat: "CBC" },
  { name: "Platelets", unit: "K/uL", low: 150, high: 400, cat: "CBC" },
  { name: "ALT", unit: "U/L", low: 7, high: 56, cat: "Liver" },
  { name: "AST", unit: "U/L", low: 10, high: 40, cat: "Liver" },
  { name: "ALP", unit: "U/L", low: 44, high: 147, cat: "Liver" },
  { name: "Total Bilirubin", unit: "mg/dL", low: 0.1, high: 1.2, cat: "Liver" },
  { name: "Total Cholesterol", unit: "mg/dL", low: 125, high: 200, cat: "Lipids" },
  { name: "LDL", unit: "mg/dL", low: 0, high: 100, cat: "Lipids" },
  { name: "HDL", unit: "mg/dL", low: 40, high: 999, cat: "Lipids" },
  { name: "Triglycerides", unit: "mg/dL", low: 0, high: 150, cat: "Lipids" },
  { name: "Creatinine", unit: "mg/dL", low: 0.7, high: 1.3, cat: "Kidney" },
  { name: "eGFR", unit: "mL/min", low: 60, high: 999, cat: "Kidney" },
  { name: "BUN", unit: "mg/dL", low: 7, high: 20, cat: "Kidney" },
  { name: "PSA", unit: "ng/mL", low: 0, high: 4, cat: "Other" },
  { name: "HbA1c", unit: "%", low: 0, high: 5.7, cat: "Other" },
  { name: "BP Systolic", unit: "mmHg", low: 90, high: 120, cat: "Other" },
  { name: "BP Diastolic", unit: "mmHg", low: 60, high: 80, cat: "Other" },
];

const CATEGORIES = ["All", "Hormones", "CBC", "Liver", "Lipids", "Kidney", "Other"];

function statusOf(marker, val) {
  const v = parseFloat(val);
  if (isNaN(v)) return null;
  if (v < marker.low) return "low";
  if (v > marker.high) return "high";
  return "normal";
}

const STATUS_STYLE = {
  normal: { color: colors.good, bg: "#0F2417", border: "#1E3D29", label: "Normal" },
  low: { color: colors.warn, bg: "#2A2008", border: "#42330F", label: "Low" },
  high: { color: colors.bad, bg: "#2A1010", border: "#421A1A", label: "High" },
};

export default function Bloodwork() {
  const { bloodwork, addBloodwork } = useStore();
  const [mode, setMode] = useState("list"); // "list" | "form" | "view"
  const [viewPanel, setViewPanel] = useState(null);

  // form state
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [values, setValues] = useState({});
  const [catFilter, setCatFilter] = useState("All");

  const shownMarkers = useMemo(
    () => (catFilter === "All" ? BIOMARKERS : BIOMARKERS.filter((b) => b.cat === catFilter)),
    [catFilter]
  );

  const save = () => {
    const entries = Object.entries(values)
      .filter(([, v]) => v !== "" && v != null)
      .map(([name, value]) => {
        const m = BIOMARKERS.find((b) => b.name === name);
        return { name, value, unit: m.unit, status: statusOf(m, value) };
      });
    if (entries.length === 0) return;
    addBloodwork({ date, entries });
    setValues({});
    setMode("list");
  };

  // ── FORM ──
  if (mode === "form") {
    return (
      <ScrollView style={s.screen} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <View style={[cardStyle, s.cardWrap]}>
          <View style={s.cardHeaderRow}>
            <Text style={s.cardTitle}>Log Lab Results</Text>
            <Pressable onPress={() => setMode("list")} hitSlop={10}><Text style={s.cancelText}>Cancel</Text></Pressable>
          </View>
          <View style={{ padding: 16, gap: 14 }}>
            <View style={{ gap: 6 }}>
              <Text style={s.label}>Test Date</Text>
              <TextInput value={date} onChangeText={setDate} placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textFaint} autoCapitalize="none" style={s.input} />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterRow}>
              {CATEGORIES.map((c) => (
                <Pressable key={c} onPress={() => setCatFilter(c)} style={[s.filterChip, catFilter === c && s.filterChipActive]}>
                  <Text style={[s.filterChipText, catFilter === c && s.filterChipTextActive]}>{c}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <View style={{ gap: 8 }}>
              {shownMarkers.map((m) => {
                const val = values[m.name] || "";
                const st = val ? statusOf(m, val) : null;
                return (
                  <View key={m.name} style={s.markerRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.markerName}>{m.name}</Text>
                      <Text style={s.markerRef}>{m.unit} · ref {m.low}–{m.high === 999 ? `${m.low}+` : m.high}</Text>
                    </View>
                    <TextInput
                      value={val}
                      onChangeText={(v) => setValues((prev) => ({ ...prev, [m.name]: v }))}
                      placeholder="—" placeholderTextColor={colors.textFaint}
                      keyboardType="numeric"
                      style={[s.markerInput, st && { borderColor: STATUS_STYLE[st].border }]}
                    />
                    {st && (
                      <View style={[s.statusTag, { backgroundColor: STATUS_STYLE[st].bg, borderColor: STATUS_STYLE[st].border }]}>
                        <Text style={[s.statusTagText, { color: STATUS_STYLE[st].color }]}>{STATUS_STYLE[st].label}</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            <Pressable onPress={save} style={s.saveBtn}>
              <Text style={s.saveBtnText}>Save Lab Results</Text>
            </Pressable>
          </View>
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    );
  }

  // ── VIEW PANEL ──
  if (mode === "view" && viewPanel) {
    return (
      <ScrollView style={s.screen} contentContainerStyle={s.content}>
        <View style={[cardStyle, s.cardWrap]}>
          <View style={s.cardHeaderRow}>
            <Text style={s.cardTitle}>{new Date(viewPanel.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</Text>
            <Pressable onPress={() => { setMode("list"); setViewPanel(null); }} hitSlop={10}><Text style={s.cancelText}>Back</Text></Pressable>
          </View>
          {viewPanel.entries.map((e, i) => (
            <View key={i} style={[s.viewRow, i < viewPanel.entries.length - 1 && s.rowBorder]}>
              <View>
                <Text style={s.viewName}>{e.name}</Text>
                <Text style={s.viewUnit}>{e.unit}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={s.viewVal}>{e.value}</Text>
                {e.status && (
                  <View style={[s.statusTag, { backgroundColor: STATUS_STYLE[e.status].bg, borderColor: STATUS_STYLE[e.status].border }]}>
                    <Text style={[s.statusTagText, { color: STATUS_STYLE[e.status].color }]}>{STATUS_STYLE[e.status].label}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    );
  }

  // ── LIST ──
  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <Pressable onPress={() => setMode("form")} style={s.newBtn}>
        <Text style={s.newBtnText}>+ Log Bloodwork</Text>
      </Pressable>

      {bloodwork.length === 0 ? (
        <View style={[cardStyle, s.emptyCard]}>
          <Text style={s.emptyText}>No lab results yet</Text>
          <Text style={s.emptySub}>Log your first bloodwork panel</Text>
        </View>
      ) : (
        [...bloodwork].reverse().map((panel) => {
          const flags = panel.entries.filter((e) => e.status !== "normal").length;
          return (
            <Pressable key={panel.id} onPress={() => { setViewPanel(panel); setMode("view"); }} style={[cardStyle, s.panelRow]}>
              <View>
                <Text style={s.panelDate}>{new Date(panel.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</Text>
                <Text style={s.panelMeta}>{panel.entries.length} markers logged</Text>
              </View>
              {flags > 0 ? (
                <View style={[s.statusTag, { backgroundColor: STATUS_STYLE.high.bg, borderColor: STATUS_STYLE.high.border }]}>
                  <Text style={[s.statusTagText, { color: colors.bad }]}>{flags} flag{flags > 1 ? "s" : ""}</Text>
                </View>
              ) : (
                <View style={[s.statusTag, { backgroundColor: STATUS_STYLE.normal.bg, borderColor: STATUS_STYLE.normal.border }]}>
                  <Text style={[s.statusTagText, { color: colors.good }]}>All normal</Text>
                </View>
              )}
            </Pressable>
          );
        })
      )}
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 16, paddingTop: 12, gap: 12 },
  cardWrap: { overflow: "hidden" },
  cardHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.border },
  cardTitle: { fontSize: 13, color: colors.text, fontFamily: fonts.bodySemi },
  cancelText: { color: colors.textFaint, fontSize: 12, fontFamily: fonts.bodyMed },

  newBtn: { borderWidth: 2, borderStyle: "dashed", borderColor: colors.accentSoftAlt, borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  newBtnText: { color: colors.accent, fontSize: 14, fontFamily: fonts.bodySemi },

  emptyCard: { paddingVertical: 40, alignItems: "center", gap: 4 },
  emptyText: { color: colors.text, fontSize: 15, fontFamily: fonts.bodySemi },
  emptySub: { color: colors.textFaint, fontSize: 13, fontFamily: fonts.body },

  label: { color: colors.textMute, fontSize: 11.5, fontFamily: fonts.bodyMed },
  input: { backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: colors.text, fontFamily: fonts.body, fontSize: 14 },

  filterRow: { gap: 6, paddingVertical: 2 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: colors.surfaceAlt },
  filterChipActive: { backgroundColor: colors.accent },
  filterChipText: { color: colors.textMute, fontSize: 12, fontFamily: fonts.bodyMed },
  filterChipTextActive: { color: colors.accentText },

  markerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  markerName: { color: colors.textMid, fontSize: 12.5, fontFamily: fonts.bodyMed },
  markerRef: { color: colors.textFaint, fontSize: 10.5, marginTop: 1, fontFamily: fonts.body },
  markerInput: { width: 76, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 7, color: colors.text, fontFamily: fonts.mono, fontSize: 13, textAlign: "right" },
  statusTag: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 999, borderWidth: 1, minWidth: 52, alignItems: "center" },
  statusTagText: { fontSize: 10, fontFamily: fonts.bodyMed },

  saveBtn: { backgroundColor: colors.accent, borderRadius: 10, paddingVertical: 12, alignItems: "center", marginTop: 2 },
  saveBtnText: { color: colors.accentText, fontSize: 14, fontFamily: fonts.bodySemi },

  viewRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  viewName: { color: colors.text, fontSize: 13.5, fontFamily: fonts.bodyMed },
  viewUnit: { color: colors.textFaint, fontSize: 11, marginTop: 1, fontFamily: fonts.body },
  viewVal: { color: colors.text, fontSize: 14, fontFamily: fonts.mono },

  panelRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16 },
  panelDate: { color: colors.text, fontSize: 14, fontFamily: fonts.bodySemi },
  panelMeta: { color: colors.textMute, fontSize: 11.5, marginTop: 2, fontFamily: fonts.body },
});
