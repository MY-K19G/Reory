# Reory

A flashcard and vocabulary learning app built with **Next.js** and **Spring Boot**, using **SM-2 spaced repetition** and **Gemini AI** to help you learn and retain words faster.

> **Note:** This project is experimental and currently in active development. Some features and APIs may change.

---

## Features

- **3D Flashcards**: Flip cards with keyboard shortcuts (<kbd>Space</kbd> to flip, <kbd>1</kbd>–<kbd>4</kbd> to rate), audio pronunciation, and example sentences.
- **AI Word Generation**: Enter any word to get definitions, example sentences, phonetics, hints, and quizzes via Google Gemini.
- **Spaced Repetition (SM-2)**: Smart review scheduling based on your recall rating (Again, Hard, Good, Easy).
- **Deck Management**: Create custom decks with language flags, icons, tags, and CEFR levels. Fork, clone, or import/export decks (JSON, CSV, Anki TSV).
- **Progress Tracking**: Daily streak heatmap, study history, review stats, and quick quiz drills.
- **Multilingual UI**: Localized in 17+ languages with customizable light/dark themes and accent colors.

---

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend**: Java 17, Spring Boot 3.2, Spring Data JPA, Hibernate, PostgreSQL
- **AI & Media**: Google Gemini API (BYOK), Pexels API (card illustrations), Web Speech API

---

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Java JDK 17+
- Apache Maven 3.8+
- PostgreSQL running locally or in the cloud

---

### 1. Start the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Set your PostgreSQL database connection:
   ```powershell
   # PowerShell
   $env:SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/reory_db"
   $env:SPRING_DATASOURCE_USERNAME="postgres"
   $env:SPRING_DATASOURCE_PASSWORD="yourpassword"
   ```
   *(Or configure these in a `backend/.env` file or Command Prompt `set KEY=value`).*

3. Run the Spring Boot server:
   ```bash
   mvn spring-boot:run
   ```
   Backend runs at **`http://localhost:8080`**. Tables are auto-created by Hibernate on startup.

---

### 2. Start the Frontend

1. In a new terminal, navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   Open **`http://localhost:3000`** in your browser.

---

## Required API Keys

You must add your API keys in the app before using it, otherwise AI features and card images will not work:

1. **Google Gemini API Key (Required)**: Needed for AI card definitions, example sentences, phonetics, hints, and quizzes. Get a free key at [Google AI Studio](https://aistudio.google.com/app/apikey).
2. **Pexels API Key (Required)**: Needed to search and attach images to flashcards. Get a free key at [Pexels API](https://www.pexels.com/api/).

### How to Add Them
1. Open the app at `http://localhost:3000`.
2. Click **Settings** in the sidebar.
3. Add your **Gemini AI** and **Pexels API** keys and save.
*(Keys are stored securely in your browser's local storage and are never saved on the server).*

---

## Project Structure

```text
Reory/
├── backend/               # Spring Boot REST API
│   ├── src/main/java/     # Controllers, Models, Repositories, Services
│   └── pom.xml
├── frontend/              # Next.js web application
│   ├── src/app/           # App Router pages and layouts
│   ├── src/components/    # UI components (flashcard player, modals, sidebar)
│   ├── src/lib/           # API clients, auth, theme, i18n
│   ├── src/locales/       # Translation files (17+ languages)
│   └── package.json
└── README.md
```

For more frontend-specific details, see [**`frontend/README.md`**](frontend/README.md).

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register user |
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/auth/preferences` | Update profile and settings |
| `GET` | `/api/decks` | List all decks |
| `POST` | `/api/decks` | Create deck |
| `GET` | `/api/decks/{id}` | Get deck details |
| `PUT` | `/api/decks/{id}` | Update deck |
| `DELETE` | `/api/decks/{id}` | Delete deck |
| `POST` | `/api/decks/{id}/fork` | Fork deck |
| `POST` | `/api/decks/{id}/clone` | Clone deck |
| `GET` | `/api/decks/{id}/study` | Get cards due for SM-2 review |
| `POST` | `/api/decks/{id}/cards` | Add card to deck |
| `PUT` | `/api/cards/{id}` | Update card |
| `DELETE` | `/api/cards/{id}` | Delete card |
| `POST` | `/api/cards/{id}/review` | Submit card review rating (1 to 4) |
| `POST` | `/api/decks/{id}/quiz` | Record quiz result |
| `POST` | `/api/ai/generate-card` | Generate card content with Gemini |
| `GET` | `/api/stats` | Get overall study stats |

---

## How Spaced Repetition Works

Reory uses the **SuperMemo SM-2** algorithm to schedule card reviews:
- **Rating 1 (Again)**: Resets interval to 1 day.
- **Rating 2 (Hard)**: Sets interval to 3 days.
- **Rating 3 (Good)**: Sets interval to 6 days.
- **Rating 4 (Easy)**: Sets interval to 14+ days.

Each review dynamically updates the card's **Easiness Factor (EF)**. Cards with an interval over 21 days are marked **Mastered**.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
