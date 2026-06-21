// Protocols — the Protocols tab.
// Build a cycle (name, goal, start date, duration, multiple compounds with
// dose/unit/frequency), then view/pause/resume/delete saved protocols.
// React Native port of the prototype's Protocols screen.

import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet, Platform } from "react-native";
import { Plus, X, Search, Check } from "lucide-react-native";
import { colors, fonts, cardStyle } from "../../theme/colors";
import { Badge } from "../../components/ui";
import { useStore } from "../../data/store";
import { COMPOUNDS, FREQUENCIES } from "../../data/compounds";

const UNITS = ["mg", "mcg", "IU", "ml"];
const GOALS = ["Bulk", "Cut", "Recomp", "TRT", "Recovery", "GLP-1 / Weight Loss", "Anti-Aging", "PCT"];

export default function Protocols() {
  const { protocols, addProtocol, toggleProtocol, deleteProtocol } = useStore();
  const [building, setBuilding] = useState(false);

  // Builder state
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [startDate, setStartDate] = useState(""); // free text YYYY-MM-DD (no native picker dependency)
  const [duration, setDuration] = useState("");
  const [compounds, setCompounds] = useState([]); // [{name,category,halfLife,dose,unit,frequency}]

  // Compound-adding sub-state
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(null); // a compound being configured
  const [addDose, setAddDose] = useState("");
  const [addUnit, setAddUnit] = useState("mg");
  const [addFreq, setAddFreq] = useState("Twice/week");

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return COMPOUNDS.filter(
      (c) => c.name.toLowerCase().includes(q) && !compounds.find((pc) => pc.name === c.name)
    ).slice(0, 6);
  }, [search, compounds]);

  const beginAdd = (c) => {
    setAdding(c);
    setAddUnit(c.unit || "mg");
    setAddFreq(c.frequency || "Twice/week");
    setAddDose("");
  };

  const confirmAdd = () => {
    if (!adding || !addDose.trim()) return;
    setCompounds((prev) => [
      ...prev,
      {
        name: adding.name,
        category: adding.category,
        halfLife: adding.halfLife,
        dose: addDose.trim(),
        unit: addUnit,
        frequency: addFreq,
      },
    ]);
    setAdding(null);
    setAddDose("");
    setSearch("");
  };

  const removeCompound = (idx) => setCompounds((prev) => prev.filter((_, i) => i !== idx));

  const resetBuilder = () => {
    setName(""); setGoal(""); setStartDate(""); setDuration("");
    setCompounds([]); setSearch(""); setAdding(null); setAddDose("");
    setBuilding(false);
  };

  const canSave = name.trim() && compounds.length > 0;

  const save = () => {
    if (!canSave) return;
    addProtocol({
      name: name.trim(),
      goal,
      startDate: startDate.trim(),
      duration: duration.trim(),
      compounds,
      active: true,
    });
    resetBuilder();
  };

  // ── BUILDER VIEW ───────────────────────────────────────────────
  if (building) {
    return (
      <ScrollView style={s.screen} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <View style={[cardStyle, s.cardWrap]}>
          <View style={s.cardHeaderRow}>
            <Text style={s.cardTitle}>Protocol Builder</Text>
            <Pressable onPress={resetBuilder} hitSlop={10}>
              <Text style={s.cancelText}>Cancel</Text>
            </Pressable>
          </View>

          <View style={{ padding: 16, gap: 16 }}>
            {/* Name + duration */}
            <View style={s.twoCol}>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={s.label}>Protocol Name</Text>
                <TextInput value={name} onChangeText={setName} placeholder="e.g. Lean Bulk #1"
                  placeholderTextColor={colors.textFaint} style={s.input} />
              </View>
              <View style={{ width: 110, gap: 6 }}>
                <Text style={s.label}>Weeks</Text>
                <TextInput value={duration} onChangeText={setDuration} placeholder="12"
                  placeholderTextColor={colors.textFaint} keyboardType="numeric" style={s.input} />
              </View>
            </View>

            {/* Start date */}
            <View style={{ gap: 6 }}>
              <Text style={s.label}>Start Date</Text>
              <TextInput value={startDate} onChangeText={setStartDate} placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textFaint} style={s.input} autoCapitalize="none" />
            </View>

            {/* Goal */}
            <View style={{ gap: 6 }}>
              <Text style={s.label}>Goal</Text>
              <View style={s.chipWrap}>
                {GOALS.map((g) => (
                  <Pressable key={g} onPress={() => setGoal(g)} style={[s.chip, goal === g && s.chipActive]}>
                    <Text style={[s.chipText, goal === g && s.chipTextActive]}>{g}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Compounds */}
            <View style={{ gap: 8 }}>
              <Text style={s.label}>Compounds</Text>

              {compounds.map((c, i) => (
                <View key={i} style={s.compoundChipRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.compoundName}>{c.name}</Text>
                    <Text style={s.compoundMeta}>{c.dose}{c.unit} · {c.frequency}</Text>
                  </View>
                  <Pressable onPress={() => removeCompound(i)} hitSlop={8}>
                    <X size={15} color={colors.bad} />
                  </Pressable>
                </View>
              ))}

              {adding ? (
                <View style={s.addBox}>
                  <Text style={s.addingName}>{adding.name}</Text>
                  <View style={s.addRow}>
                    <TextInput value={addDose} onChangeText={setAddDose} placeholder="Dose"
                      placeholderTextColor={colors.textFaint} keyboardType="numeric"
                      style={[s.input, { flex: 1 }]} />
                    <View style={s.miniGroup}>
                      {UNITS.map((u) => (
                        <Pressable key={u} onPress={() => setAddUnit(u)} style={[s.miniChip, addUnit === u && s.miniChipActive]}>
                          <Text style={[s.miniChipText, addUnit === u && s.miniChipTextActive]}>{u}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                  <View style={s.freqWrap}>
                    {FREQUENCIES.map((fq) => (
                      <Pressable key={fq} onPress={() => setAddFreq(fq)} style={[s.chip, addFreq === fq && s.chipActive]}>
                        <Text style={[s.chipText, addFreq === fq && s.chipTextActive]}>{fq}</Text>
                      </Pressable>
                    ))}
                  </View>
                  <View style={s.addActions}>
                    <Pressable onPress={confirmAdd} disabled={!addDose.trim()} style={[s.addConfirm, !addDose.trim() && { opacity: 0.4 }]}>
                      <Text style={s.addConfirmText}>Add</Text>
                    </Pressable>
                    <Pressable onPress={() => { setAdding(null); setSearch(""); }} style={s.addCancel}>
                      <Text style={s.addCancelText}>Cancel</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <View style={{ gap: 6 }}>
                  <View style={s.searchRow}>
                    <Search size={16} color={colors.textFaint} />
                    <TextInput value={search} onChangeText={setSearch} placeholder="Search to add compound..."
                      placeholderTextColor={colors.textFaint} style={s.searchInput} autoCorrect={false} />
                  </View>
                  {search.trim() !== "" && (
                    <View style={s.results}>
                      {searchResults.length === 0 ? (
                        <Text style={s.noResults}>No compounds found</Text>
                      ) : (
                        searchResults.map((c, i) => (
                          <Pressable key={c.name} onPress={() => beginAdd(c)}
                            style={[s.resultRow, i < searchResults.length - 1 && s.rowBorder]}>
                            <View style={{ flex: 1 }}>
                              <Text style={s.resultName}>{c.name}</Text>
                              <Text style={s.resultMeta}>t½ {c.halfLife}</Text>
                            </View>
                            <Badge category={c.category} />
                          </Pressable>
                        ))
                      )}
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Save */}
            <Pressable onPress={save} disabled={!canSave} style={[s.saveBtn, !canSave && { opacity: 0.4 }]}>
              <Check size={16} color={colors.accentText} strokeWidth={2.6} />
              <Text style={s.saveBtnText}>Save Protocol</Text>
            </Pressable>
          </View>
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    );
  }

  // ── LIST VIEW ──────────────────────────────────────────────────
  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <Pressable onPress={() => setBuilding(true)} style={s.newBtn}>
        <Plus size={16} color={colors.accent} strokeWidth={2.4} />
        <Text style={s.newBtnText}>Build New Protocol</Text>
      </Pressable>

      {protocols.length === 0 ? (
        <View style={[cardStyle, s.emptyCard]}>
          <Text style={s.emptyText}>No protocols yet</Text>
          <Text style={s.emptySub}>Build your first cycle or protocol stack</Text>
        </View>
      ) : (
        protocols.map((p) => (
          <View key={p.id} style={[cardStyle, s.cardWrap]}>
            <View style={s.protoHeader}>
              <View style={{ flex: 1 }}>
                <View style={s.protoTitleRow}>
                  <Text style={s.protoName}>{p.name}</Text>
                  <View style={[s.statusPill, p.active ? s.statusActive : s.statusInactive]}>
                    <Text style={[s.statusText, { color: p.active ? colors.accentText : colors.textMute }]}>
                      {p.active ? "Active" : "Paused"}
                    </Text>
                  </View>
                </View>
                <Text style={s.protoMeta}>
                  {[p.goal, p.duration ? `${p.duration} weeks` : null, p.startDate || null]
                    .filter(Boolean).join(" · ")}
                </Text>
              </View>
            </View>

            <View style={{ paddingHorizontal: 16, paddingBottom: 12, gap: 8 }}>
              {(p.compounds || []).map((c, i) => (
                <View key={i} style={s.compoundRow}>
                  <View style={{ flex: 1 }}>
                    <View style={s.compoundTitleRow}>
                      <Text style={s.compoundRowName}>{c.name}</Text>
                      <Badge category={c.category} />
                    </View>
                    <Text style={s.compoundRowMeta}>{c.frequency} · t½ {c.halfLife}</Text>
                  </View>
                  <Text style={s.compoundDose}>{c.dose}{c.unit}</Text>
                </View>
              ))}
            </View>

            <View style={s.protoActions}>
              <Pressable onPress={() => toggleProtocol(p.id)} style={s.actionBtn}>
                <Text style={s.actionText}>{p.active ? "Pause" : "Resume"}</Text>
              </Pressable>
              <Pressable onPress={() => deleteProtocol(p.id)} style={s.actionBtn}>
                <Text style={[s.actionText, { color: colors.bad }]}>Delete</Text>
              </Pressable>
            </View>
          </View>
        ))
      )}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 16, paddingTop: 12, gap: 14 },

  cardWrap: { overflow: "hidden" },
  cardHeaderRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  cardTitle: { fontSize: 13, color: colors.text, fontFamily: fonts.bodySemi },
  cancelText: { color: colors.textFaint, fontSize: 12, fontFamily: fonts.bodyMed },

  // New protocol button (dashed)
  newBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    borderWidth: 2, borderColor: colors.accentSoftAlt, borderStyle: "dashed",
    borderRadius: 14, paddingVertical: 14,
  },
  newBtnText: { color: colors.accent, fontSize: 14, fontFamily: fonts.bodySemi },

  // Empty
  emptyCard: { paddingVertical: 40, alignItems: "center", gap: 4 },
  emptyText: { color: colors.text, fontSize: 15, fontFamily: fonts.bodySemi },
  emptySub: { color: colors.textFaint, fontSize: 13, fontFamily: fonts.body },

  // Inputs
  label: { color: colors.textMute, fontSize: 11.5, fontFamily: fonts.bodyMed },
  input: {
    backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
    color: colors.text, fontFamily: fonts.body, fontSize: 14,
  },
  twoCol: { flexDirection: "row", gap: 12 },

  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: {
    paddingHorizontal: 11, paddingVertical: 6, borderRadius: 999,
    backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.textMute, fontSize: 12, fontFamily: fonts.bodyMed },
  chipTextActive: { color: colors.accentText },

  // Added compound chips
  compoundChipRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accentSoftAlt,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9,
  },
  compoundName: { color: colors.accent, fontSize: 12.5, fontFamily: fonts.bodySemi },
  compoundMeta: { color: colors.textMute, fontSize: 11, marginTop: 2, fontFamily: fonts.body },

  // Add box
  addBox: {
    borderWidth: 1, borderColor: colors.accentSoftAlt, backgroundColor: colors.accentSoft,
    borderRadius: 10, padding: 12, gap: 10,
  },
  addingName: { color: colors.accent, fontSize: 12.5, fontFamily: fonts.bodySemi },
  addRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  miniGroup: { flexDirection: "row", gap: 4 },
  miniChip: {
    paddingHorizontal: 8, paddingVertical: 8, borderRadius: 8,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  miniChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  miniChipText: { color: colors.textMute, fontSize: 11, fontFamily: fonts.bodyMed },
  miniChipTextActive: { color: colors.accentText },
  freqWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  addActions: { flexDirection: "row", gap: 8 },
  addConfirm: { flex: 1, backgroundColor: colors.accent, borderRadius: 8, paddingVertical: 9, alignItems: "center" },
  addConfirmText: { color: colors.accentText, fontSize: 12.5, fontFamily: fonts.bodySemi },
  addCancel: { paddingHorizontal: 14, justifyContent: "center", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 8 },
  addCancelText: { color: colors.textMute, fontSize: 12.5, fontFamily: fonts.bodyMed },

  // Search
  searchRow: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border,
    borderRadius: 10, paddingHorizontal: 12,
  },
  searchInput: { flex: 1, color: colors.text, fontFamily: fonts.body, fontSize: 14, paddingVertical: 10 },
  results: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, overflow: "hidden" },
  noResults: { color: colors.textFaint, fontSize: 13, padding: 12, fontFamily: fonts.body },
  resultRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  resultName: { color: colors.text, fontSize: 13, fontFamily: fonts.bodyMed },
  resultMeta: { color: colors.textMute, fontSize: 11, marginTop: 2, fontFamily: fonts.body },

  // Save
  saveBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: colors.accent, borderRadius: 10, paddingVertical: 12, marginTop: 2,
  },
  saveBtnText: { color: colors.accentText, fontSize: 14, fontFamily: fonts.bodySemi },

  // Protocol cards
  protoHeader: { flexDirection: "row", paddingHorizontal: 16, paddingTop: 13, paddingBottom: 4 },
  protoTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  protoName: { color: colors.text, fontSize: 14, fontFamily: fonts.bodySemi },
  statusPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  statusActive: { backgroundColor: colors.accent },
  statusInactive: { backgroundColor: colors.surfaceAlt },
  statusText: { fontSize: 10.5, fontFamily: fonts.bodyMed },
  protoMeta: { color: colors.textMute, fontSize: 11.5, marginTop: 3, fontFamily: fonts.body },

  compoundRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accentSoftAlt,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9,
  },
  compoundTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  compoundRowName: { color: colors.accent, fontSize: 12.5, fontFamily: fonts.bodySemi },
  compoundRowMeta: { color: colors.textMute, fontSize: 11, marginTop: 2, fontFamily: fonts.body },
  compoundDose: { color: colors.accent, fontSize: 13, fontFamily: fonts.mono },

  protoActions: {
    flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  actionBtn: { paddingVertical: 4, paddingHorizontal: 4 },
  actionText: { color: colors.accent, fontSize: 12.5, fontFamily: fonts.bodyMed },
});
