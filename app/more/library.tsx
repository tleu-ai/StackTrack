// Compound Library. Browse/search/filter all compounds; tap one for details.
import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet } from "react-native";
import { Search, ChevronRight } from "lucide-react-native";
import { colors, fonts, cardStyle } from "../../theme/colors";
import { Badge } from "../../components/ui";
import { COMPOUNDS } from "../../data/compounds";

const CATEGORIES = ["All", "AAS", "Peptide", "GLP-1", "PCT", "AI", "SARM", "Nootropic", "Blend"];

// Optional richer notes for select compounds (extend freely).
const DETAILS = {
  "Klow (BPC-157 / TB-500 / GHK-Cu / KPV)": {
    notes: "Quad-peptide blend: BPC-157 (gut & tendon repair), TB-500 (systemic healing), GHK-Cu (tissue remodeling), KPV (anti-inflammatory). All-in-one recovery protocol, SubQ preferred.",
    storage: "Refrigerate after reconstitution — use within 30 days",
    pct: "Not required",
  },
  "Testosterone Enanthate": {
    notes: "Long-ester testosterone, the backbone of most cycles. Inject twice weekly for stable levels. Aromatizes — monitor estrogen.",
    storage: "Room temp, away from light",
    pct: "Required — wait ~2 weeks after last pin",
  },
  "BPC-157": {
    notes: "Body protection compound. Strong healing peptide for tendons, ligaments, and gut. SubQ or IM near the target area.",
    storage: "Refrigerate after reconstitution",
    pct: "Not required",
  },
  Semaglutide: {
    notes: "GLP-1 receptor agonist for weight management. Weekly injection; titrate up slowly to limit GI side effects.",
    storage: "Refrigerate — stable ~4 weeks at room temp",
    pct: "Not required",
  },
};

export default function Library() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    return COMPOUNDS.filter(
      (c) => (filter === "All" || c.category === filter) && (!q || c.name.toLowerCase().includes(q))
    );
  }, [search, filter]);

  // ── DETAIL ──
  if (selected) {
    const d = DETAILS[selected.name];
    const meta = [
      { label: "Half-Life", value: selected.halfLife },
      { label: "Common Unit", value: selected.unit },
      { label: "Typical Dose", value: selected.commonDose },
      { label: "Category", value: selected.category },
    ];
    return (
      <ScrollView style={s.screen} contentContainerStyle={s.content}>
        <View style={[cardStyle, s.cardWrap]}>
          <View style={s.cardHeaderRow}>
            <Text style={s.cardTitle}>{selected.name}</Text>
            <Pressable onPress={() => setSelected(null)} hitSlop={10}><Text style={s.backText}>Back</Text></Pressable>
          </View>
          <View style={{ padding: 16, gap: 14 }}>
            <Badge category={selected.category} />
            <View style={s.metaGrid}>
              {meta.map((m) => (
                <View key={m.label} style={s.metaCell}>
                  <Text style={s.metaLabel}>{m.label}</Text>
                  <Text style={s.metaValue}>{m.value}</Text>
                </View>
              ))}
            </View>
            {d && (
              <>
                <View style={{ gap: 6 }}>
                  <Text style={s.sectionLabel}>NOTES</Text>
                  <Text style={s.notesText}>{d.notes}</Text>
                </View>
                <View style={[s.infoBox, { backgroundColor: "#2A2008", borderColor: "#42330F" }]}>
                  <Text style={[s.infoTitle, { color: colors.warn }]}>Storage</Text>
                  <Text style={[s.infoText, { color: colors.warn }]}>{d.storage}</Text>
                </View>
                <View style={[s.infoBox, { backgroundColor: "#0F1E26", borderColor: "#1A3340" }]}>
                  <Text style={[s.infoTitle, { color: colors.info }]}>PCT</Text>
                  <Text style={[s.infoText, { color: colors.info }]}>{d.pct}</Text>
                </View>
              </>
            )}
            <Text style={s.disclaimer}>⚠️ For research and informational purposes only. Consult a qualified healthcare provider before use.</Text>
          </View>
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    );
  }

  // ── LIST ──
  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <View style={s.searchRow}>
        <Search size={16} color={colors.textFaint} />
        <TextInput value={search} onChangeText={setSearch} placeholder="Search compounds..."
          placeholderTextColor={colors.textFaint} style={s.searchInput} autoCorrect={false} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterRow}>
        {CATEGORIES.map((c) => (
          <Pressable key={c} onPress={() => setFilter(c)} style={[s.filterChip, filter === c && s.filterChipActive]}>
            <Text style={[s.filterChipText, filter === c && s.filterChipTextActive]}>{c}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={[cardStyle, s.cardWrap]}>
        <View style={s.cardHeader}><Text style={s.countText}>{list.length} compounds</Text></View>
        {list.map((c, i) => (
          <Pressable key={c.name} onPress={() => setSelected(c)} style={[s.row, i < list.length - 1 && s.rowBorder]}>
            <View style={{ flex: 1 }}>
              <Text style={s.name}>{c.name}</Text>
              <Text style={s.meta}>t½ {c.halfLife} · {c.commonDose}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Badge category={c.category} />
              <ChevronRight size={16} color={colors.textFaint} />
            </View>
          </Pressable>
        ))}
      </View>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 16, paddingTop: 12, gap: 12 },
  cardWrap: { overflow: "hidden" },
  cardHeader: { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  cardHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.border },
  cardTitle: { fontSize: 14, color: colors.text, fontFamily: fonts.bodySemi, flex: 1, marginRight: 8 },
  backText: { color: colors.accent, fontSize: 13, fontFamily: fonts.bodyMed },
  countText: { color: colors.textFaint, fontSize: 11.5, fontFamily: fonts.body },

  searchRow: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14 },
  searchInput: { flex: 1, color: colors.text, fontFamily: fonts.body, fontSize: 14, paddingVertical: 11 },

  filterRow: { gap: 6, paddingVertical: 2 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  filterChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  filterChipText: { color: colors.textMute, fontSize: 12, fontFamily: fonts.bodyMed },
  filterChipTextActive: { color: colors.accentText },

  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  name: { color: colors.text, fontSize: 13.5, fontFamily: fonts.bodyMed },
  meta: { color: colors.textMute, fontSize: 11.5, marginTop: 2, fontFamily: fonts.body },

  metaGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  metaCell: { width: "47%", backgroundColor: colors.surfaceAlt, borderRadius: 10, padding: 11 },
  metaLabel: { color: colors.textFaint, fontSize: 10.5, fontFamily: fonts.body },
  metaValue: { color: colors.text, fontSize: 13, fontFamily: fonts.bodySemi, marginTop: 2 },

  sectionLabel: { color: colors.textFaint, fontSize: 10.5, fontFamily: fonts.bodySemi, letterSpacing: 0.5 },
  notesText: { color: colors.textMid, fontSize: 13, lineHeight: 19, fontFamily: fonts.body },
  infoBox: { borderWidth: 1, borderRadius: 10, padding: 11 },
  infoTitle: { fontSize: 11, fontFamily: fonts.bodySemi },
  infoText: { fontSize: 11.5, marginTop: 2, fontFamily: fonts.body },
  disclaimer: { color: colors.textFaint, fontSize: 11, fontFamily: fonts.body, backgroundColor: colors.surfaceAlt, borderRadius: 10, padding: 10, lineHeight: 16 },
});
