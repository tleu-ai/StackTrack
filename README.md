# StackTrack — Expo Setup

This folder contains the React Native (Expo) port of StackTrack. The dashboard
(Home tab) is fully converted; the other tabs are stubbed in the navigator and
ready for you to port next.

## 1. Create the Expo project

From the folder where you keep projects:

```bash
npx create-expo-app@latest StackTrack
cd StackTrack
```

Choose the **default** template (Expo Router + TypeScript + a tab layout).

> Note: as of mid-2026 there's an SDK transition. The default template gives you
> SDK 54, which is what you want for testing on a physical phone with **Expo Go**.

## 2. Reset the boilerplate

The template ships with demo screens. Clear them:

```bash
npm run reset-project   # if the script exists; otherwise just delete app/(tabs)/* contents
```

## 3. Install the libraries this code uses

```bash
npx expo install @react-native-async-storage/async-storage
npx expo install lucide-react-native react-native-svg
npx expo install expo-font expo-splash-screen expo-status-bar
npx expo install @expo-google-fonts/archivo @expo-google-fonts/inter @expo-google-fonts/jetbrains-mono
```

(Always use `npx expo install`, not `npm install` — it picks SDK-compatible versions.)

## 4. Drop in these files

Copy the contents of this folder into your project root, matching the structure:

```
StackTrack/
  app/
    _layout.tsx            ← root layout (fonts, store, dark theme)
    (tabs)/
      _layout.tsx          ← the 5-tab bottom nav
      index.tsx            ← Home / dashboard  ✅ done
      log.tsx              ← (port next)
      protocols.tsx        ← (port next)
      calc.tsx             ← (port next)
      more.tsx             ← (port next)
  components/
    ui.js                  ← Badge, Card
  data/
    compounds.js           ← the 100-compound database
    store.js               ← shared state + AsyncStorage persistence
  theme/
    colors.js              ← all colors + fonts in one place
```

## 5. Run it

```bash
npx expo start
```

Scan the QR code with your iPhone camera → opens in Expo Go. Edits hot-reload
instantly.

## What changed from the web prototype

- `<div>` → `<View>`, text → `<Text>`, `<input>` → `<TextInput>`
- `className` / Tailwind → `StyleSheet` objects, all colors from `theme/colors.js`
- `onClick` → `onPress`, `lucide-react` → `lucide-react-native`
- All **logic** (stats, compound data, calculations) is unchanged
- Data now **persists** on the device via AsyncStorage and is shared across tabs
  through the `useStore()` hook — no more losing everything on refresh

## Porting the remaining tabs

Each remaining screen follows the same pattern as `index.tsx`:
1. Read/write data with `const { logs, addLog } = useStore();`
2. Lay out with `<View>` / `<Text>` / `<ScrollView>`
3. Style from `colors` and `fonts`

Tackle them in this order: **log** (simplest, proves out the data flow) →
**protocols** → **calc** → **more**. Ping me for each and I'll convert it.
