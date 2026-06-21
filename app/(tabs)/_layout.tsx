// Bottom tab navigator. Each <Tabs.Screen> maps to a file in this folder:
//   index.tsx        → Home
//   log.tsx          → Log
//   protocols.tsx    → Protocols
//   calc.tsx         → Calc
//   more.tsx         → More (a nested stack for PCT / Bloodwork / Site Map / Library)
//
// Only index.tsx (the dashboard) is built so far. Create the others as you port
// each screen — the tab bar will light them up automatically.

import { Tabs } from "expo-router";
import { LayoutGrid, Syringe, FolderOpen, Calculator, Settings } from "lucide-react-native";
import { colors, fonts } from "../../theme/colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.text, fontFamily: fonts.display, fontSize: 18 },
        headerTitle: "StackTrack",
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarLabelStyle: { fontSize: 10, fontFamily: fonts.bodyMed },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarIcon: ({ color }) => <LayoutGrid size={20} color={color} /> }}
      />
      <Tabs.Screen
        name="log"
        options={{ title: "Log", tabBarIcon: ({ color }) => <Syringe size={20} color={color} /> }}
      />
      <Tabs.Screen
        name="protocols"
        options={{ title: "Protocols", tabBarIcon: ({ color }) => <FolderOpen size={20} color={color} /> }}
      />
      <Tabs.Screen
        name="calc"
        options={{ title: "Calc", tabBarIcon: ({ color }) => <Calculator size={20} color={color} /> }}
      />
      <Tabs.Screen
        name="more"
        options={{ title: "More", tabBarIcon: ({ color }) => <Settings size={20} color={color} /> }}
      />
    </Tabs>
  );
}
