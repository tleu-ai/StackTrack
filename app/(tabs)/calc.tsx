// Calc — the Calc tab.
// Two tools: a peptide reconstitution calculator (vial + BAC water -> draw
// volume / syringe units) and a half-life decay table. Pure math, no store
// writes. React Native port of the prototype's Calculator screen.

import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet } from "react-native";
import { Search } from "lucide-react-native";
import { colors, fonts, cardStyle } from "../../theme/colors";
import { COMPOUNDS } from "../../data/compounds";

// Parse a half-life string ("4.5 days", "12-15 hrs", "~4 hrs", "30 min") to days.
// For ranges, use the midpoint. Returns null if unparseable.
function halfLifeToDays(str) {
  if (!str) return null;
  const lower = str.toLowerCase();
  const nums = (lower.match(/[\d.]+/g) || []).map(Number).filter((n) => !isNaN(n));
  if (nums.length === 0) return null;
  const value = nums.length >= 2 ? (nums[0] + nums[1]) / 2 : nums[0];
  if (lower.includes("day")) return value;
  if (lower.includes("hr") || lower.includes("hour")) return value / 24;
  if (lower.includes("min")) return value / (24 * 60);
  return value; // assume days if no unit
}

const VIAL_UNITS = ["mg", "mcg", "IU"];
const TARGET_UNITS = ["mcg", "mg", "IU"];
const SYRINGES = ["100", "50", "30"];

export default function Calc() {
  const [mode, setMode] = useState("recon"); // "recon" | "halflife"

  // ── Reconstitution state ──
  const [vialAmt, setVialAmt] = useState("");
  const [vialUnit, setVialUnit] = useState("mg");
  const [bacMl, setBacMl] = useState("");
  const [targetDose, setTargetDose] = useState("");
  const [targetUnit, setTargetUnit] = useState("mcg");
  const [syringe, setSyringe] = useState("100");

  const recon = useMemo(() => {
    const vialMcg = vialUnit === "mg" ? parseFloat(vialAmt) * 1000 : parseFloat(vialAmt);
    const bac = parseFloat(bacMl);
    const target = targetUnit === "mg" ? parseFloat(targetDose) * 1000 : parseFloat(targetDose);
    const units = parseInt(syringe, 10);

    const concPerMl = !isNaN(vialMcg) && !isNaN(bac) && bac > 0 ? vialMcg / bac : null;
    const drawMl = concPerMl && target ? target / concPerMl : null;
    const drawUnits = drawMl != null ? drawMl * units : null;
    const dosesPerVial = !isNaN(vialMcg) && target ? vialMcg / target : null;

    return { concPerMl, drawMl, drawUnits, dosesPerVial };
  }, [vialAmt, vialUnit, bacMl, targetDose, targetUnit, syringe]);

  // ── Half-life state ──
  const [hlSearch, setHlSearch] = useState("");
  const [hlCompound, setHlCompound] = useState(null);
  const [hlDose, setHlDose] = useState("");
  const [hlUnit, setHlUnit] = useState("mg");

  const hlResults = useMemo(() => {
    if (!hlSearch.trim()) return [];
    const q = hlSearch.toLowerCase();
    return COMPOUNDS.filter((c) => c.name.toLowerCase().includes(q) && halfLifeToDays(c.halfLife) != null).slice(0, 8);
  }, [hlSearch]);

  const decayRows = useMemo(() => {
    const days = hlCompound ? halfLifeToDays(hlCompound.halfLife) : null;
    const dose = parseFloat(hlDose);
    if (!days || isNaN(dose)) return [];
    return Array.from({ length: 8 }, (_, i) => ({
      days: (i * days).toFixed(1),
      remaining: (dose * Math.pow(0.5, i)).toFixed(3),
      pct: 100 * Math.pow(0.5, i),
    }));
  }, [hlCompound, hlDose]);

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      {/* Mode switch */}
      <View style={s.switcher}>
        {[
          { id: "recon", label: "Reconstitution" },
          { id: "halflife", label: "Half-Life" },
        ].map((m) => (
          <Pressable key={m.id} onPress={() => setMode(m.id)} style={[s.switchBtn, mode === m.id && s.switchBtnActive]}>
            <Text style={[s.switchText, mode === m.id && s.switchTextActive]}>{m.label}</Text>
          </Pressable>
        ))}
      </View>

      {mode === "recon" ? (
        <>
          {/* Vial details */}
          <View style={[cardStyle, s.cardWrap]}>
            <View style={s.cardHeader}>
              <Text style={s.cardTitle}>Vial Details</Text>
              <Text style={s.cardSub}>Enter what's printed on your vial</Text>
            </View>
            <View style={{ padding: 16, gap: 14 }}>
              <View style={{ gap: 6 }}>
                <Text style={s.label}>Vial Amount</Text>
                <View style={s.row}>
                  <TextInput value={vialAmt} onChangeText={setVialAmt} placeholder="e.g. 5"
                    placeholderTextColor={colors.textFaint} keyboardType="numeric" style={[s.input, { flex: 1 }]} />
                  <View style={s.miniGroup}>
                    {VIAL_UNITS.map((u) => (
                      <Pressable key={u} onPress={() => setVialUnit(u)} style={[s.miniChip, vialUnit === u && s.miniChipActive]}>
                        <Text style={[s.miniChipText, vialUnit === u && s.miniChipTextActive]}>{u}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>
              <View style={{ gap: 6 }}>
                <Text style={s.label}>Bacteriostatic Water to Add (ml)</Text>
                <TextInput value={bacMl} onChangeText={setBacMl} placeholder="e.g. 2"
                  placeholderTextColor={colors.textFaint} keyboardType="numeric" style={s.input} />
              </View>
              {recon.concPerMl != null && (
                <View style={s.resultBox}>
                  <Text style={s.resultBoxLabel}>Concentration after mixing</Text>
                  <Text style={s.resultBoxValue}>{recon.concPerMl.toFixed(2)} mcg/ml</Text>
                  <Text style={s.resultBoxSub}>{(recon.concPerMl / 1000).toFixed(4)} mg/ml</Text>
                </View>
              )}
            </View>
          </View>

          {/* Dose calculator */}
          <View style={[cardStyle, s.cardWrap]}>
            <View style={s.cardHeader}>
              <Text style={s.cardTitle}>Dose Calculator</Text>
              <Text style={s.cardSub}>How much to draw per injection</Text>
            </View>
            <View style={{ padding: 16, gap: 14 }}>
              <View style={{ gap: 6 }}>
                <Text style={s.label}>Target Dose</Text>
                <View style={s.row}>
                  <TextInput value={targetDose} onChangeText={setTargetDose} placeholder="e.g. 250"
                    placeholderTextColor={colors.textFaint} keyboardType="numeric" style={[s.input, { flex: 1 }]} />
                  <View style={s.miniGroup}>
                    {TARGET_UNITS.map((u) => (
                      <Pressable key={u} onPress={() => setTargetUnit(u)} style={[s.miniChip, targetUnit === u && s.miniChipActive]}>
                        <Text style={[s.miniChipText, targetUnit === u && s.miniChipTextActive]}>{u}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>
              <View style={{ gap: 6 }}>
                <Text style={s.label}>Syringe Size</Text>
                <View style={s.syringeRow}>
                  {SYRINGES.map((sz) => (
                    <Pressable key={sz} onPress={() => setSyringe(sz)} style={[s.syringeChip, syringe === sz && s.syringeChipActive]}>
                      <Text style={[s.syringeText, syringe === sz && s.syringeTextActive]}>{sz}u</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {recon.drawMl != null && recon.drawUnits != null ? (
                <View style={{ gap: 8 }}>
                  <View style={s.resultGrid}>
                    <View style={s.resultCard}>
                      <Text style={s.resultCardLabel}>Draw Volume</Text>
                      <Text style={s.resultCardValue}>{recon.drawMl.toFixed(3)}</Text>
                      <Text style={s.resultCardUnit}>ml</Text>
                    </View>
                    <View style={s.resultCard}>
                      <Text style={s.resultCardLabel}>Syringe Units</Text>
                      <Text style={s.resultCardValue}>{recon.drawUnits.toFixed(1)}</Text>
                      <Text style={s.resultCardUnit}>units ({syringe}u)</Text>
                    </View>
                  </View>
                  {recon.dosesPerVial != null && (
                    <View style={s.dosesRow}>
                      <Text style={s.dosesLabel}>Doses per vial</Text>
                      <Text style={s.dosesValue}>{recon.dosesPerVial.toFixed(1)} doses</Text>
                    </View>
                  )}
                </View>
              ) : (
                <Text style={s.hint}>Fill in vial details and target dose to calculate</Text>
              )}

              <Text style={s.warn}>⚠️ Always verify before injecting. For research purposes only.</Text>
            </View>
          </View>
        </>
      ) : (
        // ── Half-life ──
        <View style={[cardStyle, s.cardWrap]}>
          <View style={s.cardHeader}>
            <Text style={s.cardTitle}>Half-Life Decay</Text>
            <Text style={s.cardSub}>See how a compound clears your system</Text>
          </View>
          <View style={{ padding: 16, gap: 14 }}>
            <View style={{ gap: 6 }}>
              <Text style={s.label}>Compound</Text>
              {hlCompound ? (
                <Pressable onPress={() => { setHlCompound(null); setHlSearch(""); }} style={s.selectedPill}>
                  <Text style={s.selectedPillText}>{hlCompound.name}</Text>
                  <Text style={s.selectedPillMeta}>t½ {hlCompound.halfLife} · tap to change</Text>
                </Pressable>
              ) : (
                <>
                  <View style={s.searchRow}>
                    <Search size={16} color={colors.textFaint} />
                    <TextInput value={hlSearch} onChangeText={setHlSearch} placeholder="Search compound..."
                      placeholderTextColor={colors.textFaint} style={s.searchInput} autoCorrect={false} />
                  </View>
                  {hlSearch.trim() !== "" && (
                    <View style={s.results}>
                      {hlResults.length === 0 ? (
                        <Text style={s.noResults}>No matches</Text>
                      ) : (
                        hlResults.map((c, i) => (
                          <Pressable key={c.name} onPress={() => { setHlCompound(c); setHlUnit(c.unit || "mg"); setHlSearch(""); }}
                            style={[s.resultRow, i < hlResults.length - 1 && s.rowBorder]}>
                            <Text style={s.resultName}>{c.name}</Text>
                            <Text style={s.resultMeta}>t½ {c.halfLife}</Text>
                          </Pressable>
                        ))
                      )}
                    </View>
                  )}
                </>
              )}
            </View>

            <View style={{ gap: 6 }}>
              <Text style={s.label}>Dose Administered</Text>
              <View style={s.row}>
                <TextInput value={hlDose} onChangeText={setHlDose} placeholder="e.g. 250"
                  placeholderTextColor={colors.textFaint} keyboardType="numeric" style={[s.input, { flex: 1 }]} />
                <View style={s.miniGroup}>
                  {["mg", "mcg", "IU"].map((u) => (
                    <Pressable key={u} onPress={() => setHlUnit(u)} style={[s.miniChip, hlUnit === u && s.miniChipActive]}>
                      <Text style={[s.miniChipText, hlUnit === u && s.miniChipTextActive]}>{u}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>

            {decayRows.length > 0 ? (
              <View style={{ marginTop: 4 }}>
                <View style={s.decayHead}>
                  <Text style={[s.decayHeadText, { flex: 1 }]}>Days</Text>
                  <Text style={[s.decayHeadText, { flex: 1.2 }]}>Remaining</Text>
                  <Text style={[s.decayHeadText, { flex: 1.5, textAlign: "right" }]}>% Active</Text>
                </View>
                {decayRows.map((r, i) => (
                  <View key={i} style={[s.decayRow, i < decayRows.length - 1 && s.rowBorder]}>
                    <Text style={[s.decayCell, { flex: 1 }, i === 0 && s.decayCellBold]}>{r.days}d</Text>
                    <Text style={[s.decayCell, { flex: 1.2 }, i === 0 && s.decayCellBold]}>{r.remaining} {hlUnit}</Text>
                    <View style={{ flex: 1.5, flexDirection: "row", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
                      <View style={s.barTrack}>
                        <View style={[s.barFill, { width: `${r.pct}%` }]} />
                      </View>
                      <Text style={s.decayPct}>{r.pct.toFixed(1)}%</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={s.hint}>Select a compound and enter a dose to see the decay curve</Text>
            )}
          </View>
        </View>
      )}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 16, paddingTop: 12, gap: 14 },

  switcher: { flexDirection: "row", gap: 6, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 5 },
  switchBtn: { flex: 1, paddingVertical: 9, borderRadius: 8, alignItems: "center" },
  switchBtnActive: { backgroundColor: colors.accent },
  switchText: { color: colors.textMute, fontSize: 12.5, fontFamily: fonts.bodySemi },
  switchTextActive: { color: colors.accentText },

  cardWrap: { overflow: "hidden" },
  cardHeader: { paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.border },
  cardTitle: { fontSize: 13, color: colors.text, fontFamily: fonts.bodySemi },
  cardSub: { fontSize: 11.5, color: colors.textMute, marginTop: 2, fontFamily: fonts.body },

  label: { color: colors.textMute, fontSize: 11.5, fontFamily: fonts.bodyMed },
  input: {
    backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
    color: colors.text, fontFamily: fonts.body, fontSize: 14,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },

  miniGroup: { flexDirection: "row", gap: 4 },
  miniChip: { paddingHorizontal: 9, paddingVertical: 9, borderRadius: 8, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border },
  miniChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  miniChipText: { color: colors.textMute, fontSize: 11, fontFamily: fonts.bodyMed },
  miniChipTextActive: { color: colors.accentText },

  resultBox: { backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accentSoftAlt, borderRadius: 10, padding: 12 },
  resultBoxLabel: { color: colors.accentDim, fontSize: 11.5, fontFamily: fonts.bodyMed },
  resultBoxValue: { color: colors.accent, fontSize: 18, fontFamily: fonts.mono, marginTop: 2 },
  resultBoxSub: { color: colors.accentDim, fontSize: 11.5, fontFamily: fonts.body },

  syringeRow: { flexDirection: "row", gap: 6 },
  syringeChip: { flex: 1, paddingVertical: 9, borderRadius: 8, alignItems: "center", backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border },
  syringeChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  syringeText: { color: colors.textMute, fontSize: 12, fontFamily: fonts.bodySemi },
  syringeTextActive: { color: colors.accentText },

  resultGrid: { flexDirection: "row", gap: 8 },
  resultCard: { flex: 1, backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accentSoftAlt, borderRadius: 10, padding: 12, alignItems: "center" },
  resultCardLabel: { color: colors.accentDim, fontSize: 11, fontFamily: fonts.bodyMed },
  resultCardValue: { color: colors.accent, fontSize: 24, fontFamily: fonts.mono, marginTop: 2 },
  resultCardUnit: { color: colors.accentDim, fontSize: 10.5, fontFamily: fonts.body },

  dosesRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  dosesLabel: { color: colors.textMute, fontSize: 11.5, fontFamily: fonts.body },
  dosesValue: { color: colors.text, fontSize: 13, fontFamily: fonts.bodySemi },

  hint: { color: colors.textFaint, fontSize: 12, fontFamily: fonts.body, textAlign: "center", paddingVertical: 6 },
  warn: { color: colors.textFaint, fontSize: 11, fontFamily: fonts.body, textAlign: "center" },

  // Search (half-life)
  searchRow: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12 },
  searchInput: { flex: 1, color: colors.text, fontFamily: fonts.body, fontSize: 14, paddingVertical: 10 },
  results: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, overflow: "hidden" },
  noResults: { color: colors.textFaint, fontSize: 13, padding: 12, fontFamily: fonts.body },
  resultRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  resultName: { color: colors.text, fontSize: 13, fontFamily: fonts.bodyMed },
  resultMeta: { color: colors.textMute, fontSize: 11, fontFamily: fonts.body },

  selectedPill: { backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accentSoftAlt, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  selectedPillText: { color: colors.accent, fontSize: 13.5, fontFamily: fonts.bodySemi },
  selectedPillMeta: { color: colors.textMute, fontSize: 11, marginTop: 2, fontFamily: fonts.body },

  // Decay table
  decayHead: { flexDirection: "row", paddingHorizontal: 4, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: colors.border },
  decayHeadText: { color: colors.textFaint, fontSize: 11, fontFamily: fonts.bodySemi },
  decayRow: { flexDirection: "row", alignItems: "center", paddingVertical: 9, paddingHorizontal: 4 },
  decayCell: { color: colors.textMid, fontSize: 12, fontFamily: fonts.body },
  decayCellBold: { color: colors.text, fontFamily: fonts.bodySemi },
  decayPct: { color: colors.textMute, fontSize: 11, width: 42, textAlign: "right", fontFamily: fonts.mono },
  barTrack: { flex: 1, height: 6, backgroundColor: colors.surfaceAlt, borderRadius: 999, overflow: "hidden" },
  barFill: { height: "100%", backgroundColor: colors.accentDim, borderRadius: 999 },
});
