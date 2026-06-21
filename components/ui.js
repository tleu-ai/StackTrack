// Shared UI primitives used across screens.
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fonts, cardStyle } from "../theme/colors";

export function Badge({ category }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{category}</Text>
    </View>
  );
}

export function Card({ children, style }) {
  return <View style={[cardStyle, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.accentSoft,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: colors.accent,
    fontSize: 10.5,
    fontFamily: fonts.bodyMed,
  },
});
