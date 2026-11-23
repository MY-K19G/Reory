# Reory - Frontend

The web client for **Reory**, built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **TypeScript**.

> **Note:** This project is experimental and currently in active development. Features, components, and local storage formats may change.

---

## What's Inside

- **3D Flashcards**: Cards flip with smooth CSS transforms, audio pronunciation, and keyboard shortcuts (<kbd>Space</kbd> to flip, <kbd>1</kbd>–<kbd>4</kbd> to rate).
- **AI Word Generator**: Generates word meanings, sentences, phonetic guides, mnemonics, and quizzes using Google Gemini.
- **Deck Builder**: Create decks with flag selectors, vector icons, custom tags, and CEFR levels. Import and export via JSON, CSV, or Anki TSV.
- **Progress Tracking**: Daily streak heatmap, review statistics, and quick quiz drills.
- **Theme & Languages**: Light and dark mode with custom accent colors, translated across 17+ languages.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS v4, Lucide Icons, FontAwesome
- **Language**: TypeScript 5
- **Tooling**: ESLint 9

---

## Getting Started

### Prerequisites
- Node.js 18+ (Node.js 20+ recommended)
- npm

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Required API Keys

You must configure your API keys in the app before using it, otherwise AI vocabulary features and card images will not work:

1. **Google Gemini API Key (Required)**: Needed for AI card definitions, translations, sentences, phonetics, and quizzes. Get a free key at [Google AI Studio](https://aistudio.google.com/app/apikey).
2. **Pexels API Key (Required)**: Needed for card image search and illustrations. Get a free key at [Pexels API](https://www.pexels.com/api/).

Go to **Settings** in the sidebar to add them. Keys are kept in your browser's local storage and are never stored on the server.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint checks |
| `npx tsc --noEmit` | Check TypeScript types |

---

## Folder Structure

```text
frontend/
├── public/               # Static images and icons
├── src/
│   ├── app/              # App Router routes (decks, explore, quiz, study, settings, profile)
│   ├── components/       # Flashcard viewer, dashboard, modals, sidebar
│   ├── lib/              # API clients, auth, theme, i18n, helpers
│   └── locales/          # Language translation files (17+ languages)
└── package.json
```
