// PCT Planner. Add compounds + last pin dates, compute clearance wait
// (~5 half-lives), and lay out a PCT protocol schedule.

import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet } from "react-native";
import { Plus } from "lucide-react-native";
import { colors, fonts, cardStyle } from "../../theme/colors";

// Ester half-lives in days — clearance timing only matters for injectables.
const PCT_HALF_LIVES = {
  "Testosterone Enanthate": 4.5,
  "Testosterone Cypionate": 5,
  "Testosterone Propionate": 2,
  "Testosterone Undecanoate": 21,
  "Nandrolone Decanoate": 6,
  "Nandrolone Phenylpropionate": 2.5,
  "Trenbolone Acetate": 1,
  "Trenbolone Enanthate": 5,
  "Boldenone Undecylenate": 14,
  "Masteron Propionate": 2.5,
  "Masteron Enanthate": 5,
  "Primobolan Enanthate": 5,
};

const PROTOCOLS = {
  Nolvadex: ["Week 1-2: 40mg/day", "Week 3-4: 20mg/day"],
  Clomid: ["Week 1-2: 50mg/day", "Week 3-4: 25mg/day"],
  "Nolva + Clomid": ["Week 1-2: Nolva 40mg + Clomid 50mg/day", "Week 3-4: Nolva 20mg + Clomid 25mg/day"],
  Enclomiphene: ["Week 1-4: 12.5-25mg/day"],
};

const COMPOUND_NAMES = Object.keys(PCT_HALF_LIVES);

export default function PCTPlanner() {
  const [rows, setRows] = useState([{ name: "", lastPin: "" }]);
  const [protocol, setProtocol] = useState("Nolvadex");
  const [result, setResult] = useState(null);

  const update = (i, field, val) => setRows((r) => r.map((x, j) => (j === i ? { ...x, [field]: val } : x)));
  const addRow = () => setRows((r) => [...r, { name: "", lastPin: "" }]);
  const removeRow = (i) => setRows((r) => r.filter((_, j) => j !== i));

  const calculate = () => {
    const valid = rows.filter((r) => r.name && r.lastPin && PCT_HALF_LIVES[r.name]);
    if (valid.length === 0) { setResult(null); return; }

    let maxWait = 0, limiting = null, latestPin = new Date(0);
    valid.forEach((r) => {
      const wait = Math.round(PCT_HALF_LIVES[r.name] * 5); // ~97% cleared
      if (wait > maxWait) { maxWait = wait; limiting = r.name; }
      const d = new Date(r.lastPin);
      if (!isNaN(d) && d > latestPin) latestPin = d;
    });

    const start = new Date(latestPin); start.setDate(start.getDate() + maxWait);
    const end = new Date(start); end.setDate(end.getDate() + 28);
    setResult({ maxWait, limiting, start, end });
  };

  const fmt = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <View style={[cardStyle, s.cardWrap]}>
        <View style={s.cardHeader}>
          <Text style={s.cardTitle}>PCT Planner</Text>
          <Text style={s.cardSub}>Calculate when to start post-cycle therapy</Text>
        </View>
        <View style={{ padding: 16, gap: 16 }}>
          {rows.map((r, i) => (
            <View key={i} style={{ gap: 8 }}>
              <View style={s.rowHead}>
                <Text style={s.label}>Compound {i + 1}</Text>
                {rows.length > 1 && (
                  <Pressable onPress={() => removeRow(i)} hitSlop={8}>
                    <Text style={s.removeText}>Remove</Text>
                  </Pressable>
                )}
              </View>
              <View style={s.chipWrap}>
                {COMPOUND_NAMES.map((n) => (
                  <Pressable key={n} onPress={() => update(i, "name", n)} style={[s.chip, r.name === n && s.chipActive]}>
                    <Text style={[s.chipText, r.name === n && s.chipTextActive]}>{n}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={s.label}>Last Pin Date</Text>
              <TextInput value={r.lastPin} onChangeText={(v) => update(i, "lastPin", v)} placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textFaint} autoCapitalize="none" style={s.input} />
            </View>
          ))}

          <Pressable onPress={addRow} style={s.addRow}>
            <Plus size={14} color={colors.textMute} strokeWidth={2.2} />
            <Text style={s.addRowText}>Add another compound</Text>
          </Pressable>

          <View style={{ gap: 6 }}>
            <Text style={s.label}>PCT Protocol</Text>
            <View style={s.protoGrid}>
              {Object.keys(PROTOCOLS).map((p) => (
                <Pressable key={p} onPress={() => setProtocol(p)} style={[s.protoChip, protocol === p && s.chipActive]}>
                  <Text style={[s.chipText, protocol === p && s.chipTextActive]}>{p}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable onPress={calculate} style={s.calcBtn}>
            <Text style={s.calcBtnText}>Calculate PCT Start</Text>
          </Pressable>
        </View>
      </View>

      {result && (
        <View style={[cardStyle, s.cardWrap]}>
          <View style={s.cardHeader}>
            <Text style={s.cardTitle}>Your PCT Schedule</Text>
          </View>
          <View style={{ padding: 16, gap: 12 }}>
            <View style={s.warnBox}>
              <Text style={s.warnLabel}>Wait Period</Text>
              <Text style={s.warnValue}>{result.maxWait} days after last pin</Text>
              <Text style={s.warnSub}>Limiting compound: {result.limiting}</Text>
            </View>
            <View style={s.dateGrid}>
              <View style={[s.dateCard, { backgroundColor: colors.accentSoft, borderColor: colors.accentSoftAlt }]}>
                <Text style={[s.dateLabel, { color: colors.accentDim }]}>Start PCT</Text>
                <Text style={[s.dateValue, { color: colors.accent }]}>{fmt(result.start)}</Text>
              </View>
              <View style={[s.dateCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
                <Text style={[s.dateLabel, { color: colors.info }]}>End (~4wk)</Text>
                <Text style={[s.dateValue, { color: colors.info }]}>{fmt(result.end)}</Text>
              </View>
            </View>
            <View style={s.protoBox}>
              <Text style={s.protoBoxTitle}>{protocol} Protocol</Text>
              {PROTOCOLS[protocol].map((step, i) => (
                <View key={i} style={s.stepRow}>
                  <View style={s.stepNum}><Text style={s.stepNumText}>{i + 1}</Text></View>
                  <Text style={s.stepText}>{step}</Text>
                </View>
              ))}
            </View>
            <Text style={s.disclaimer}>⚠️ Get bloodwork before and after PCT. Consult a healthcare provider.</Text>
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
  cardWrap: { overflow: "hidden" },
  cardHeader: { paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.border },
  cardTitle: { fontSize: 13, color: colors.text, fontFamily: fonts.bodySemi },
  cardSub: { fontSize: 11.5, color: colors.textMute, marginTop: 2, fontFamily: fonts.body },

  rowHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  label: { color: colors.textMute, fontSize: 11.5, fontFamily: fonts.bodyMed },
  removeText: { color: colors.bad, fontSize: 11.5, fontFamily: fonts.bodyMed },
  input: { backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: colors.text, fontFamily: fonts.body, fontSize: 14 },

  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.textMute, fontSize: 11.5, fontFamily: fonts.bodyMed },
  chipTextActive: { color: colors.accentText },

  addRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderWidth: 1, borderStyle: "dashed", borderColor: colors.border, borderRadius: 10, paddingVertical: 10 },
  addRowText: { color: colors.textMute, fontSize: 12, fontFamily: fonts.bodyMed },

  protoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  protoChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border },

  calcBtn: { backgroundColor: colors.accent, borderRadius: 10, paddingVertical: 12, alignItems: "center", marginTop: 2 },
  calcBtnText: { color: colors.accentText, fontSize: 14, fontFamily: fonts.bodySemi },

  warnBox: { backgroundColor: "#2A2008", borderWidth: 1, borderColor: "#42330F", borderRadius: 10, padding: 12 },
  warnLabel: { color: colors.warn, fontSize: 11.5, fontFamily: fonts.bodyMed },
  warnValue: { color: colors.warn, fontSize: 17, fontFamily: fonts.bodySemi, marginTop: 2 },
  warnSub: { color: colors.warn, fontSize: 11.5, marginTop: 2, fontFamily: fonts.body, opacity: 0.85 },

  dateGrid: { flexDirection: "row", gap: 8 },
  dateCard: { flex: 1, borderWidth: 1, borderRadius: 10, padding: 12 },
  dateLabel: { fontSize: 11, fontFamily: fonts.bodyMed },
  dateValue: { fontSize: 13.5, fontFamily: fonts.bodySemi, marginTop: 2 },

  protoBox: { backgroundColor: colors.surfaceAlt, borderRadius: 10, padding: 12, gap: 8 },
  protoBoxTitle: { color: colors.textMid, fontSize: 12, fontFamily: fonts.bodySemi },
  stepRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  stepNum: { width: 18, height: 18, borderRadius: 999, backgroundColor: colors.accentSoft, alignItems: "center", justifyContent: "center" },
  stepNumText: { color: colors.accent, fontSize: 10, fontFamily: fonts.bodyBold },
  stepText: { color: colors.textMid, fontSize: 12, fontFamily: fonts.body, flex: 1 },
  disclaimer: { color: colors.textFaint, fontSize: 11, fontFamily: fonts.body },
});
