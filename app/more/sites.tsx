// Site Map. Tap injection sites on a body silhouette to log them; a heatmap
// shows overuse and the app suggests the next site (least used / longest rested).
// Also pulls injection sites from your dose logs automatically.

import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet } from "react-native";
import Svg, { Ellipse, Rect, Circle, G, Text as SvgText } from "react-native-svg";
import { useStore } from "../../data/store";
import { colors, fonts, cardStyle } from "../../theme/colors";

const SITES = [
  { id: "L_DELT", label: "L. Delt", x: 18, y: 22 },
  { id: "R_DELT", label: "R. Delt", x: 82, y: 22 },
  { id: "L_PECT", label: "L. Pec", x: 32, y: 30 },
  { id: "R_PECT", label: "R. Pec", x: 68, y: 30 },
  { id: "L_LAT", label: "L. Lat", x: 22, y: 42 },
  { id: "R_LAT", label: "R. Lat", x: 78, y: 42 },
  { id: "NAVEL_L", label: "Abd L", x: 38, y: 48 },
  { id: "NAVEL_R", label: "Abd R", x: 62, y: 48 },
  { id: "L_GLUTE", label: "L. Glute", x: 25, y: 55 },
  { id: "R_GLUTE", label: "R. Glute", x: 75, y: 55 },
  { id: "L_QUAD", label: "L. Quad", x: 30, y: 65 },
  { id: "R_QUAD", label: "R. Quad", x: 70, y: 65 },
  { id: "L_CALF", label: "L. Calf", x: 33, y: 82 },
  { id: "R_CALF", label: "R. Calf", x: 67, y: 82 },
];

// Match a free-text site string from a dose log to a body-map site id.
function matchSiteId(siteName) {
  if (!siteName) return null;
  const n = siteName.toLowerCase();
  const found = SITES.find((sv) => {
    const parts = sv.label.toLowerCase().replace(".", "").split(" ");
    return parts.every((p) => n.includes(p));
  });
  return found ? found.id : null;
}

export default function SiteMap() {
  const { logs, sites, addSite } = useStore();
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");

  // Combine manual site logs with sites inferred from dose logs
  const history = useMemo(() => {
    const fromLogs = logs
      .filter((l) => l.site)
      .map((l) => ({ siteId: matchSiteId(l.site), siteName: l.site, compound: l.compound, date: l.timestamp }))
      .filter((x) => x.siteId);
    return [...sites, ...fromLogs];
  }, [logs, sites]);

  const countFor = (id) => history.filter((h) => h.siteId === id).length;
  const lastUsed = (id) => {
    const entries = history.filter((h) => h.siteId === id).sort((a, b) => new Date(b.date) - new Date(a.date));
    return entries[0]?.date;
  };
  const daysSince = (date) => (date ? Math.floor((Date.now() - new Date(date)) / 86400000) : null);

  const maxCount = Math.max(1, ...SITES.map((sv) => countFor(sv.id)));

  const heatColor = (count) => {
    if (count === 0) return "#23262E";
    const intensity = count / maxCount;
    if (intensity < 0.33) return "#5A6E36";
    if (intensity < 0.66) return colors.accentDim;
    return colors.accent;
  };

  // Suggest next: highest (days since - count*2)
  const suggested = useMemo(() => {
    let best = null, bestScore = -Infinity;
    SITES.forEach((sv) => {
      const d = daysSince(lastUsed(sv.id)) ?? 999;
      const score = d - countFor(sv.id) * 2;
      if (score > bestScore) { bestScore = score; best = sv; }
    });
    return best;
  }, [history]);

  const logHere = () => {
    if (!selected) return;
    const sv = SITES.find((x) => x.id === selected);
    addSite({ siteId: selected, siteName: sv.label, compound: "Manual entry", note: note.trim() });
    setNote("");
    setSelected(null);
  };

  const recent = useMemo(
    () => [...history].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10),
    [history]
  );

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      {/* Suggested */}
      {suggested && (
        <View style={s.suggestBox}>
          <View>
            <Text style={s.suggestLabel}>Suggested Next Site</Text>
            <Text style={s.suggestName}>{suggested.label}</Text>
            <Text style={s.suggestSub}>
              {countFor(suggested.id) === 0 ? "Never used" : `Last used ${daysSince(lastUsed(suggested.id))}d ago`}
            </Text>
          </View>
          <Pressable onPress={() => setSelected(suggested.id)} style={s.suggestBtn}>
            <Text style={s.suggestBtnText}>Use This</Text>
          </Pressable>
        </View>
      )}

      {/* Body map */}
      <View style={[cardStyle, s.cardWrap]}>
        <View style={s.cardHeaderRow}>
          <Text style={s.cardTitle}>Injection Site Map</Text>
          <View style={s.legend}>
            <View style={[s.legendDot, { backgroundColor: "#23262E" }]} /><Text style={s.legendText}>Low</Text>
            <View style={[s.legendDot, { backgroundColor: colors.accent, marginLeft: 6 }]} /><Text style={s.legendText}>High</Text>
          </View>
        </View>

        <View style={{ alignItems: "center", paddingVertical: 12 }}>
          <Svg width={280} height={280} viewBox="0 0 100 100">
            {/* silhouette */}
            <Ellipse cx={50} cy={12} rx={8} ry={9} fill={colors.surfaceAlt} stroke={colors.border} strokeWidth={0.5} />
            <Rect x={34} y={20} width={32} height={28} rx={4} fill={colors.surfaceAlt} stroke={colors.border} strokeWidth={0.5} />
            <Rect x={20} y={21} width={14} height={22} rx={4} fill={colors.surfaceAlt} stroke={colors.border} strokeWidth={0.5} />
            <Rect x={66} y={21} width={14} height={22} rx={4} fill={colors.surfaceAlt} stroke={colors.border} strokeWidth={0.5} />
            <Rect x={34} y={47} width={14} height={30} rx={3} fill={colors.surfaceAlt} stroke={colors.border} strokeWidth={0.5} />
            <Rect x={52} y={47} width={14} height={30} rx={3} fill={colors.surfaceAlt} stroke={colors.border} strokeWidth={0.5} />
            <Rect x={34} y={76} width={14} height={15} rx={3} fill={colors.surfaceAlt} stroke={colors.border} strokeWidth={0.5} />
            <Rect x={52} y={76} width={14} height={15} rx={3} fill={colors.surfaceAlt} stroke={colors.border} strokeWidth={0.5} />

            {SITES.map((sv) => {
              const count = countFor(sv.id);
              const isSel = selected === sv.id;
              return (
                <G key={sv.id} onPress={() => setSelected(isSel ? null : sv.id)}>
                  <Circle cx={sv.x} cy={sv.y} r={4.5} fill={isSel ? colors.warn : heatColor(count)} stroke={isSel ? "#FBBF24" : colors.bg} strokeWidth={0.8} />
                  {count > 0 && <SvgText x={sv.x} y={sv.y + 1.2} fontSize={3} fill={colors.bg} fontWeight="bold" textAnchor="middle">{count}</SvgText>}
                </G>
              );
            })}
          </Svg>
        </View>

        {selected && (
          <View style={s.detailBox}>
            <View style={s.detailHead}>
              <View>
                <Text style={s.detailName}>{SITES.find((x) => x.id === selected)?.label}</Text>
                <Text style={s.detailMeta}>
                  Used {countFor(selected)}x{lastUsed(selected) ? ` · last ${daysSince(lastUsed(selected))}d ago` : " · never"}
                </Text>
              </View>
              <Pressable onPress={() => setSelected(null)} hitSlop={8}><Text style={s.detailClose}>✕</Text></Pressable>
            </View>
            <TextInput value={note} onChangeText={setNote} placeholder="Note (optional)"
              placeholderTextColor={colors.textFaint} style={s.input} />
            <Pressable onPress={logHere} style={s.logBtn}>
              <Text style={s.logBtnText}>Log Injection Here</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Recent */}
      <View style={[cardStyle, s.cardWrap]}>
        <View style={s.cardHeader}><Text style={s.cardTitle}>Recent Injections</Text></View>
        {recent.length === 0 ? (
          <View style={s.emptyWrap}>
            <Text style={s.emptyText}>No injection history</Text>
            <Text style={s.emptySub}>Tap a site on the map to log it</Text>
          </View>
        ) : (
          recent.map((h, i) => (
            <View key={i} style={[s.recentRow, i < recent.length - 1 && s.rowBorder]}>
              <View>
                <Text style={s.recentName}>{h.siteName}</Text>
                <Text style={s.recentMeta}>{h.compound} · {new Date(h.date).toLocaleDateString()}</Text>
              </View>
              <Text style={s.recentAgo}>{daysSince(h.date)}d ago</Text>
            </View>
          ))
        )}
      </View>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 16, paddingTop: 12, gap: 14 },
  cardWrap: { overflow: "hidden" },
  cardHeader: { paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.border },
  cardHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.border },
  cardTitle: { fontSize: 13, color: colors.text, fontFamily: fonts.bodySemi },

  suggestBox: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accentSoftAlt, borderRadius: 14, padding: 16 },
  suggestLabel: { color: colors.accentDim, fontSize: 11.5, fontFamily: fonts.bodyMed },
  suggestName: { color: colors.accent, fontSize: 17, fontFamily: fonts.bodySemi, marginTop: 1 },
  suggestSub: { color: colors.textMute, fontSize: 11.5, marginTop: 1, fontFamily: fonts.body },
  suggestBtn: { backgroundColor: colors.accent, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  suggestBtnText: { color: colors.accentText, fontSize: 12.5, fontFamily: fonts.bodySemi },

  legend: { flexDirection: "row", alignItems: "center" },
  legendDot: { width: 12, height: 12, borderRadius: 3, marginRight: 4 },
  legendText: { color: colors.textFaint, fontSize: 11, fontFamily: fonts.body },

  detailBox: { borderTopWidth: 1, borderTopColor: colors.border, padding: 16, gap: 10 },
  detailHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  detailName: { color: colors.text, fontSize: 14, fontFamily: fonts.bodySemi },
  detailMeta: { color: colors.textMute, fontSize: 11.5, marginTop: 1, fontFamily: fonts.body },
  detailClose: { color: colors.textFaint, fontSize: 14 },
  input: { backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: colors.text, fontFamily: fonts.body, fontSize: 14 },
  logBtn: { backgroundColor: colors.accent, borderRadius: 10, paddingVertical: 11, alignItems: "center" },
  logBtnText: { color: colors.accentText, fontSize: 14, fontFamily: fonts.bodySemi },

  emptyWrap: { paddingVertical: 32, alignItems: "center", gap: 4 },
  emptyText: { color: colors.text, fontSize: 15, fontFamily: fonts.bodySemi },
  emptySub: { color: colors.textFaint, fontSize: 13, fontFamily: fonts.body },
  recentRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  recentName: { color: colors.text, fontSize: 13.5, fontFamily: fonts.bodyMed },
  recentMeta: { color: colors.textMute, fontSize: 11.5, marginTop: 1, fontFamily: fonts.body },
  recentAgo: { color: colors.textFaint, fontSize: 11.5, fontFamily: fonts.body },
});
