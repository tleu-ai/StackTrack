// Root layout. Wraps the whole app in the data store, loads custom fonts, and
// sets the dark theme. Expo Router renders this around every route.

import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Archivo_600SemiBold, Archivo_700Bold } from "@expo-google-fonts/archivo";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { JetBrainsMono_500Medium } from "@expo-google-fonts/jetbrains-mono";
import { StoreProvider } from "../data/store";
import { colors } from "../theme/colors";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Archivo_600SemiBold,
    Archivo_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    JetBrainsMono_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;

  return (
    <StoreProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </StoreProvider>
  );
}
