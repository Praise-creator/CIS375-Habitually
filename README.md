# CIS375-Habitually

## Habitually (Expo + React Native)

Habitually is a **demo/prototype** mobile habit tracker built for a class project. It supports local accounts, habit creation, daily completion tracking, a calendar view, and basic settings—all **offline** with local device storage.

## Requirements

Install these before running:

* **Node.js (LTS)** + **npm** (comes with Node)
* **Expo tooling** (use via `npx`)
* One way to run the app:

  * **Expo Go** app on your phone (iOS/Android), or
  * **iOS Simulator** (macOS + Xcode), or
  * **Android Emulator** (Android Studio)

## Setup & Run

1. **Clone the repo**

```bash
git clone <YOUR_REPO_URL>
cd <YOUR_REPO_FOLDER>
```

2. **Install dependencies**

```bash
npm install
```

3. **Start Expo**

```bash
npx expo start
```

4. **Run the app**

* **Phone (Expo Go):** scan the QR code in the terminal/browser
* **iOS Simulator:** press **i** in the Expo terminal
* **Android Emulator:** press **a** in the Expo terminal

## If you get missing package errors

Install Expo-compatible dependencies:

```bash
npx expo install @react-native-async-storage/async-storage expo-file-system expo-sharing expo-document-picker
```

## Helpful commands

Clear cache:

```bash
npx expo start -c
```

---
