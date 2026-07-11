# ExplainAI 🧠

Upload anything. Understand everything.

ExplainAI takes complex documents — legal papers, medical reports, research papers, government notices — and explains them in simple terms using Google's Gemini AI.

## Features

- 📁 **Upload files** — drag & drop or click to upload `.txt` and `.pdf` files
- 📋 **Paste text** — or just paste text directly, no file needed
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
- **PDF text extraction:** [pdf.js](https://mozilla.github.io/pdf.js/) (client-side, via CDN)
- **Backend:** Vercel Serverless Functions (Node.js)
- **AI:** Google Gemini API

## Project Structure

```
explainai/
├── index.html          # Main page (paste box + file upload zone)
├── styles.css          # Styling
├── script.js           # Frontend logic — file reading, PDF extraction, calls /api/explain
├── package.json
└── api/
    └── explain.js       # Serverless function — calls Gemini API securely
```

## How It Works

1. The user either uploads a `.txt`/`.pdf` file or pastes text directly.
2. For `.txt` files, the browser reads the content directly.
3. For `.pdf` files, `pdf.js` extracts the text from each page — entirely in the browser, no file is uploaded to any server.
4. The extracted/pasted text is sent to `/api/explain`, a Vercel serverless function.
5. The serverless function calls the Gemini API using a server-side API key and returns the explanation.

```
Browser (file/text) → /api/explain (Vercel Function) → Gemini API → Explanation
```

The Gemini API key never reaches the browser — it lives only in Vercel's environment variables and is used exclusively inside the serverless function.

## Supported File Types

| Type | Support |
|------|---------|
| `.txt` | ✅ Full support |
| `.pdf` (text-based) | ✅ Full support (text extracted via pdf.js) |
| `.pdf` (scanned/image-only) | ⚠️ Not supported yet — no readable text to extract (would need OCR) |
| `.docx`, images, etc. | 🚧 Not supported yet |

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
- Uploading a file and typing in the textarea are mutually exclusive — whichever you interact with last takes priority.
- Never commit your `.env` file or hardcode API keys in frontend code.

## Roadmap

- [ ] OCR support for scanned/image-based PDFs
- [ ] `.docx` file support
- [ ] Direct image upload (e.g. photographed documents) using Gemini's vision capabilities

## License

MIT — feel free to use and modify.

---

Made with ❤️ using Gemini AI