// Dashboard — the Home tab.
// Expo Router maps app/(tabs)/index.tsx to the first tab automatically.
// This is the React Native port of the prototype dashboard.

import React from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Syringe, Activity, TrendingUp, Droplet, ChevronRight } from "lucide-react-native";
import { colors, fonts, cardStyle } from "../../theme/colors";
import { Badge } from "../../components/ui";
import { useStore } from "../../data/store";

export default function Dashboard() {
  const router = useRouter();
  const { logs, protocols } = useStore();

  const todayStr = new Date().toDateString();
  const todayLogs = logs.filter((l) => new Date(l.timestamp).toDateString() === todayStr);

  const totalDoses = logs.length;
  const activeProtocols = protocols.filter((p) => p.active).length;
  const thisWeek = logs.filter((l) => {
    const diff = (Date.now() - new Date(l.timestamp)) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length;
  const adherence = totalDoses > 0 ? Math.min(100, Math.round((thisWeek / Math.max(thisWeek, 7)) * 100)) : 0;

  const recentLogs = [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);

  const stats = [
    { label: "Total Doses", value: String(totalDoses), Icon: Syringe },
    { label: "Active Protocols", value: String(activeProtocols), Icon: Activity },
    { label: "Adherence", value: totalDoses > 0 ? `${adherence}%` : "—", Icon: TrendingUp },
  ];

  const greeting = activeProtocols > 0 || todayLogs.length > 0 ? "On protocol." : "Ready to track.";

  const fmtTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const fmtDate = (ts) => new Date(ts).toLocaleDateString();

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      {/* Hero */}
      <View style={{ marginTop: 4, marginBottom: 4 }}>
        <Text style={s.dateLine}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </Text>
        <Text style={s.hero}>{greeting}</Text>
      </View>

      {/* Stats */}
      <View style={s.statRow}>
        {stats.map(({ label, value, Icon }) => (
          <View key={label} style={[cardStyle, s.statCard]}>
            <Icon size={16} color={colors.accent} strokeWidth={2.2} style={{ marginBottom: 10 }} />
            <Text style={s.statValue}>{value}</Text>
            <Text style={s.statLabel}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Today's Doses */}
      <View style={[cardStyle, s.cardWrap]}>
        <View style={s.cardHeader}>
          <Text style={s.cardTitle}>Today's Doses</Text>
          <Text style={s.cardMeta}>{todayLogs.length} logged</Text>
        </View>
        {todayLogs.length === 0 ? (
          <View style={s.emptyInline}>
            <Text style={s.emptyText}>No doses logged today</Text>
            <Pressable onPress={() => router.push("/log")}>
              <Text style={s.linkText}>Log a dose →</Text>
            </Pressable>
          </View>
        ) : (
          todayLogs.map((l, i) => (
            <View key={l.id} style={[s.row, i < todayLogs.length - 1 && s.rowBorder]}>
              <View style={s.rowLeft}>
                <View style={s.dot} />
                <View>
                  <Text style={s.rowTitle}>{l.compound}</Text>
                  <Text style={s.rowSub}>{l.site} · {fmtTime(l.timestamp)}</Text>
                </View>
              </View>
              <Text style={s.rowValue}>{l.dose}{l.unit}</Text>
            </View>
          ))
        )}
      </View>

      {/* Active Protocols */}
      <View style={[cardStyle, s.cardWrap]}>
        <View style={s.cardHeader}>
          <Text style={s.cardTitle}>Active Protocols</Text>
          <Pressable onPress={() => router.push("/protocols")}>
            <ChevronRight size={15} color={colors.textFaint} />
          </Pressable>
        </View>
        {activeProtocols === 0 ? (
          <View style={s.emptyInline}>
            <Text style={s.emptyText}>No active protocols</Text>
            <Pressable onPress={() => router.push("/protocols")}>
              <Text style={s.linkText}>Build a protocol →</Text>
            </Pressable>
          </View>
        ) : (
          protocols.filter((p) => p.active).map((p, i, arr) => (
            <View key={p.id} style={[s.row, i < arr.length - 1 && s.rowBorder]}>
              <View style={{ flex: 1 }}>
                <Text style={s.rowTitle}>{p.name}</Text>
                <View style={s.pillRow}>
                  {(p.compounds || []).slice(0, 3).map((c, j) => <Badge key={j} category={c.category} />)}
                  {p.goal ? <Text style={s.rowSub}>{p.goal}</Text> : null}
                </View>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={s.rowValue}>{p.duration ? `· / ${p.duration}` : "ongoing"}</Text>
                <Text style={s.weekLabel}>week</Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Recent Activity */}
      {recentLogs.length > 0 && (
        <View style={[cardStyle, s.cardWrap]}>
          <View style={s.cardHeader}>
            <Text style={s.cardTitle}>Recent Activity</Text>
          </View>
          {recentLogs.map((l, i) => (
            <View key={l.id} style={[s.row, i < recentLogs.length - 1 && s.rowBorder]}>
              <View style={[s.dot, { backgroundColor: colors.accentDim }]} />
              <View style={{ flex: 1 }}>
                <Text style={s.rowTitle}>
                  {l.compound} <Text style={s.rowSub}>— {l.dose}{l.unit}</Text>
                </Text>
                <Text style={s.rowSub}>{l.site} · {fmtDate(l.timestamp)}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Bloodwork reminder (signature element) */}
      <Pressable onPress={() => router.push("/more/bloodwork")} style={[cardStyle, s.bloodCard]}>
        <View style={s.bloodLeft}>
          <View style={s.bloodBadge}>
            <Droplet size={18} color={colors.accentText} strokeWidth={2.2} />
          </View>
          <View>
            <Text style={s.rowSub}>Next bloodwork due</Text>
            <Text style={s.bloodDate}>
              Jul 8 <Text style={s.bloodDateSub}>· in 17 days</Text>
            </Text>
          </View>
        </View>
        <ChevronRight size={18} color={colors.textFaint} />
      </Pressable>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 16, paddingTop: 8, gap: 16 },

  dateLine: { fontSize: 13, color: colors.textMute, fontFamily: fonts.body, letterSpacing: 0.2 },
  hero: { fontSize: 28, color: colors.text, fontFamily: fonts.display, marginTop: 2, letterSpacing: -0.5 },

  statRow: { flexDirection: "row", gap: 10 },
  statCard: { flex: 1, padding: 14 },
  statValue: { fontSize: 22, color: colors.text, fontFamily: fonts.mono },
  statLabel: { fontSize: 11, color: colors.textMute, marginTop: 6, fontFamily: fonts.body },

  cardWrap: { overflow: "hidden" },
  cardHeader: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  cardTitle: { fontSize: 13, color: colors.text, fontFamily: fonts.bodySemi },
  cardMeta: { fontSize: 11, color: colors.textFaint, fontFamily: fonts.mono },

  emptyInline: { paddingHorizontal: 16, paddingVertical: 24, alignItems: "center", gap: 6 },
  emptyText: { fontSize: 14, color: colors.textFaint, fontFamily: fonts.body },
  linkText: { fontSize: 14, color: colors.accent, fontFamily: fonts.bodyMed },

  row: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 12,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 11 },
  dot: { width: 7, height: 7, borderRadius: 999, backgroundColor: colors.accent },
  rowTitle: { fontSize: 13.5, color: colors.text, fontFamily: fonts.bodyMed },
  rowSub: { fontSize: 11.5, color: colors.textMute, marginTop: 1, fontFamily: fonts.body },
  rowValue: { fontSize: 14, color: colors.text, fontFamily: fonts.mono },
  weekLabel: { fontSize: 10.5, color: colors.textFaint, marginTop: 1, fontFamily: fonts.body },
  pillRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6, flexWrap: "wrap" },

  bloodCard: { padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  bloodLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  bloodBadge: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  bloodDate: { fontSize: 17, color: colors.text, fontFamily: fonts.display, marginTop: 2 },
  bloodDateSub: { fontSize: 12, color: colors.textMute, fontFamily: fonts.body },
});
