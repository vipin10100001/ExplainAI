# ExplainAI 🧠

Upload anything. Understand everything.

ExplainAI takes complex text — legal documents, medical reports, research papers, government notices — and explains it in simple terms using Google's Gemini AI.

## Features

- 📄 **Legal** — Contracts, rental agreements, court notices
- 🏥 **Medical** — Blood reports, prescriptions, lab reports
- 📚 **Research** — Academic papers, articles, thesis
- 🏛 **Government** — Circulars, policies, notifications
- ✨ Simplified explanations powered by Gemini AI
- 📋 Copy or download explanations as a text file
- 🎨 Clean, modern glassmorphism UI

## Tech Stack

- **Frontend:** HTML, CSS, vanilla JavaScript
- **Markdown rendering:** [marked.js](https://github.com/markedjs/marked)
- **Backend:** Vercel Serverless Functions (Node.js)
- **AI:** Google Gemini API

## Project Structure

```
explainai/
├── index.html          # Main page
├── styles.css          # Styling
├── script.js           # Frontend logic (calls /api/explain)
├── package.json
└── api/
    └── explain.js       # Serverless function — calls Gemini API securely
```

## How It Works

The frontend never talks to Gemini directly. Instead, it sends the pasted text to a Vercel serverless function (`/api/explain`), which securely calls the Gemini API using a server-side API key. This keeps the API key hidden from the browser at all times.

```
Browser  →  /api/explain (Vercel Function)  →  Gemini API
```

## Setup & Deployment

### 1. Clone the repository

```bash
git clone https://github.com/your-username/explainai.git
cd explainai
```

### 2. Get a Gemini API key

Generate one at [Google AI Studio](https://aistudio.google.com/apikey).

### 3. Deploy to Vercel

1. Push this repo to GitHub (if not already done)
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository
3. Under **Environment Variables**, add:

   | Key              | Value                  |
   |------------------|------------------------|
   | `GEMINI_API_KEY` | your Gemini API key    |

4. Click **Deploy**

### 4. Local development (optional)

Create a `.env` file in the project root (already gitignored):

```
GEMINI_API_KEY=your_key_here
```

Run locally using the Vercel CLI:

```bash
npm install -g vercel
vercel dev
```

## Environment Variables

| Variable         | Description                          |
|-------------------|--------------------------------------|
| `GEMINI_API_KEY`  | Your Google Gemini API key (server-side only, never exposed to the browser) |

## Notes

- Model used: `gemini-2.5-flash` (configurable in `api/explain.js`)
- If you see a "high demand" error, it's a temporary issue on Google's end — retry after a few minutes.
- Never commit your `.env` file or hardcode API keys in frontend code.

## License

MIT — feel free to use and modify.

---

Made with ❤️ using Gemini AI
