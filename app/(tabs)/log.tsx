// Log — the Log tab.
// Search a compound, fill in dose/unit/site/notes, save to the store, and see
// recent history. React Native port of the prototype's DoseLog screen.

import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet } from "react-native";
import { Search, X, Check } from "lucide-react-native";
import { colors, fonts, cardStyle } from "../../theme/colors";
import { Badge } from "../../components/ui";
import { useStore } from "../../data/store";
import { COMPOUNDS, INJECTION_SITES } from "../../data/compounds";

const UNITS = ["mg", "mcg", "IU", "ml"];
const CATEGORIES = ["All", "AAS", "Peptide", "GLP-1", "PCT", "AI", "SARM", "Nootropic", "Blend"];

export default function Log() {
  const { logs, addLog } = useStore();

  // Compound selection / search
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null); // a compound object

  // Form fields
  const [dose, setDose] = useState("");
  const [unit, setUnit] = useState("mg");
  const [site, setSite] = useState("");
  const [notes, setNotes] = useState("");

  // History filter
  const [filter, setFilter] = useState("All");

  const results = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return COMPOUNDS.filter(
      (c) => c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [search]);

  const pickCompound = (c) => {
    setSelected(c);
    setUnit(c.unit || "mg");
    setSearch("");
  };

  const reset = () => {
    setSelected(null);
    setDose("");
    setUnit("mg");
    setSite("");
    setNotes("");
  };

  const canSave = selected && dose.trim() && site;

  const save = () => {
    if (!canSave) return;
    addLog({
      compound: selected.name,
      category: selected.category,
      dose: dose.trim(),
      unit,
      site,
      notes: notes.trim(),
      halfLife: selected.halfLife,
    });
    reset();
  };

  const history = useMemo(() => {
    const sorted = [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return filter === "All" ? sorted : sorted.filter((l) => l.category === filter);
  }, [logs, filter]);

  const fmt = (ts) =>
    `${new Date(ts).toLocaleDateString()} ${new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      {/* ── Log a Dose ───────────────────────────────────────────── */}
      <View style={[cardStyle, s.cardWrap]}>
        <View style={s.cardHeader}>
          <Text style={s.cardTitle}>Log a Dose</Text>
        </View>

        {!selected ? (
          <View style={{ padding: 16, gap: 8 }}>
            <View style={s.searchRow}>
              <Search size={16} color={colors.textFaint} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search compound..."
                placeholderTextColor={colors.textFaint}
                style={s.searchInput}
                autoCorrect={false}
              />
            </View>

            {search.trim() !== "" && (
              <View style={s.results}>
                {results.length === 0 ? (
                  <Text style={s.noResults}>No compounds found</Text>
                ) : (
                  results.map((c, i) => (
                    <Pressable
                      key={c.name}
                      onPress={() => pickCompound(c)}
                      style={[s.resultRow, i < results.length - 1 && s.rowBorder]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={s.resultName}>{c.name}</Text>
                        <Text style={s.resultMeta}>t½ {c.halfLife} · {c.commonDose}</Text>
                      </View>
                      <Badge category={c.category} />
                    </Pressable>
                  ))
                )}
              </View>
            )}
          </View>
        ) : (
          <View style={{ padding: 16, gap: 14 }}>
            {/* Selected compound header */}
            <View style={s.selectedRow}>
              <View>
                <Text style={s.selectedName}>{selected.name}</Text>
                <View style={{ marginTop: 4 }}>
                  <Badge category={selected.category} />
                </View>
              </View>
              <Pressable onPress={reset} hitSlop={10}>
                <Text style={s.changeText}>Change</Text>
              </Pressable>
            </View>

            {/* Dose + unit */}
            <View style={{ gap: 6 }}>
              <Text style={s.label}>Dose</Text>
              <View style={s.doseRow}>
                <TextInput
                  value={dose}
                  onChangeText={setDose}
                  placeholder="0"
                  placeholderTextColor={colors.textFaint}
                  keyboardType="numeric"
                  style={[s.input, { flex: 1 }]}
                />
                <View style={s.unitGroup}>
                  {UNITS.map((u) => (
                    <Pressable
                      key={u}
                      onPress={() => setUnit(u)}
                      style={[s.unitChip, unit === u && s.unitChipActive]}
                    >
                      <Text style={[s.unitChipText, unit === u && s.unitChipTextActive]}>{u}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>

            {/* Injection site */}
            <View style={{ gap: 6 }}>
              <Text style={s.label}>Injection Site</Text>
              <View style={s.siteWrap}>
                {INJECTION_SITES.map((sName) => (
                  <Pressable
                    key={sName}
                    onPress={() => setSite(sName)}
                    style={[s.siteChip, site === sName && s.siteChipActive]}
                  >
                    <Text style={[s.siteChipText, site === sName && s.siteChipTextActive]}>{sName}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Notes */}
            <View style={{ gap: 6 }}>
              <Text style={s.label}>Notes (optional)</Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="How you're feeling, pip, etc."
                placeholderTextColor={colors.textFaint}
                style={[s.input, { minHeight: 44 }]}
                multiline
              />
            </View>

            {/* Save */}
            <Pressable onPress={save} disabled={!canSave} style={[s.saveBtn, !canSave && s.saveBtnDisabled]}>
              <Check size={16} color={colors.accentText} strokeWidth={2.6} />
              <Text style={s.saveBtnText}>Log Dose</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* ── History ──────────────────────────────────────────────── */}
      <View style={[cardStyle, s.cardWrap]}>
        <View style={[s.cardHeader, { borderBottomWidth: 0, paddingBottom: 0 }]}>
          <Text style={s.cardTitle}>History</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.filterRow}
        >
          {CATEGORIES.map((c) => (
            <Pressable
              key={c}
              onPress={() => setFilter(c)}
              style={[s.filterChip, filter === c && s.filterChipActive]}
            >
              <Text style={[s.filterChipText, filter === c && s.filterChipTextActive]}>{c}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {history.length === 0 ? (
          <View style={s.emptyWrap}>
            <Text style={s.emptyText}>No doses logged yet</Text>
            <Text style={s.emptySub}>Search a compound above to get started</Text>
          </View>
        ) : (
          <View>
            {history.map((l, i) => (
              <View key={l.id} style={[s.histRow, i < history.length - 1 && s.rowBorder]}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <View style={s.histTitleRow}>
                    <Text style={s.histName}>{l.compound}</Text>
                    <Badge category={l.category} />
                  </View>
                  <Text style={s.histMeta}>{l.site} · {fmt(l.timestamp)}</Text>
                  {l.notes ? <Text style={s.histNotes}>"{l.notes}"</Text> : null}
                </View>
                <Text style={s.histDose}>{l.dose} {l.unit}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 16, paddingTop: 12, gap: 16 },

  cardWrap: { overflow: "hidden" },
  cardHeader: {
    paddingHorizontal: 16, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  cardTitle: { fontSize: 13, color: colors.text, fontFamily: fonts.bodySemi },

  // Search
  searchRow: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border,
    borderRadius: 10, paddingHorizontal: 12,
  },
  searchInput: { flex: 1, color: colors.text, fontFamily: fonts.body, fontSize: 14, paddingVertical: 10 },
  results: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, overflow: "hidden" },
  noResults: { color: colors.textFaint, fontSize: 13, padding: 12, fontFamily: fonts.body },
  resultRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  resultName: { color: colors.text, fontSize: 13.5, fontFamily: fonts.bodyMed },
  resultMeta: { color: colors.textMute, fontSize: 11.5, marginTop: 2, fontFamily: fonts.body },

  // Selected
  selectedRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  selectedName: { color: colors.text, fontSize: 15, fontFamily: fonts.bodySemi },
  changeText: { color: colors.textFaint, fontSize: 12, fontFamily: fonts.bodyMed },

  label: { color: colors.textMute, fontSize: 11.5, fontFamily: fonts.bodyMed },
  input: {
    backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
    color: colors.text, fontFamily: fonts.body, fontSize: 14,
  },

  doseRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  unitGroup: { flexDirection: "row", gap: 4 },
  unitChip: {
    paddingHorizontal: 10, paddingVertical: 9, borderRadius: 8,
    backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border,
  },
  unitChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  unitChipText: { color: colors.textMute, fontSize: 12, fontFamily: fonts.bodyMed },
  unitChipTextActive: { color: colors.accentText },

  siteWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  siteChip: {
    paddingHorizontal: 11, paddingVertical: 7, borderRadius: 999,
    backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border,
  },
  siteChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  siteChipText: { color: colors.textMid, fontSize: 12, fontFamily: fonts.bodyMed },
  siteChipTextActive: { color: colors.accentText },

  saveBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: colors.accent, borderRadius: 10, paddingVertical: 12, marginTop: 2,
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { color: colors.accentText, fontSize: 14, fontFamily: fonts.bodySemi },

  // Filter
  filterRow: { gap: 6, paddingHorizontal: 16, paddingVertical: 12 },
  filterChip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: colors.surfaceAlt,
  },
  filterChipActive: { backgroundColor: colors.accent },
  filterChipText: { color: colors.textMute, fontSize: 12, fontFamily: fonts.bodyMed },
  filterChipTextActive: { color: colors.accentText },

  // History
  emptyWrap: { paddingVertical: 40, alignItems: "center", gap: 4 },
  emptyText: { color: colors.text, fontSize: 15, fontFamily: fonts.bodySemi },
  emptySub: { color: colors.textFaint, fontSize: 13, fontFamily: fonts.body },
  histRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12 },
  histTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  histName: { color: colors.text, fontSize: 13.5, fontFamily: fonts.bodyMed },
  histMeta: { color: colors.textMute, fontSize: 11.5, marginTop: 3, fontFamily: fonts.body },
  histNotes: { color: colors.textMute, fontSize: 11.5, marginTop: 4, fontStyle: "italic", fontFamily: fonts.body },
  histDose: { color: colors.text, fontSize: 14, fontFamily: fonts.mono },
});
