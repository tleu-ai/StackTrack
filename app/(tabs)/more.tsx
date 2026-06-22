import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Droplets, MapPin, BookOpen, ClipboardList } from "lucide-react-native";
import { colors, fonts, cardStyle } from "../../theme/colors";

const items = [
  { title: "PCT Planner", route: "/more/pct", icon: ClipboardList },
  { title: "Injection Sites", route: "/more/sites", icon: MapPin },
  { title: "Compound Library", route: "/more/library", icon: BookOpen },
  { title: "Bloodwork", route: "/more/bloodwork", icon: Droplets },
];

export default function More() {
  return (
    <View style={s.screen}>
      <Text style={s.title}>More</Text>

      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Pressable key={item.title} style={[cardStyle, s.row]} onPress={() => router.push(item.route)}>
            <View style={s.left}>
              <Icon size={22} color={colors.accent} />
              <Text style={s.label}>{item.title}</Text>
            </View>
            <Text style={s.chevron}>›</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: 16, gap: 12 },
  title: { color: colors.text, fontFamily: fonts.display, fontSize: 28, marginBottom: 8 },
  row: { padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  left: { flexDirection: "row", alignItems: "center", gap: 12 },
  label: { color: colors.text, fontFamily: fonts.bodySemi, fontSize: 16 },
  chevron: { color: colors.textFaint, fontSize: 28 },
});
