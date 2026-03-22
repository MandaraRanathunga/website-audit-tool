# Website Audit Tool

A full-stack application that scrapes factual metrics from a given URL and utilizes AI to generate actionable SEO, messaging, and UX insights.

## Features

- **Metric Scraping:** Extracts word count, headings (H1, H2, H3), CTAs, internal/external links, and image alt text data directly from the DOM.
- **AI Insights:** Uses Anthropic's Claude API to analyze the extracted metrics and provide prioritized recommendations.
- **Audit Logs:** Saves prompt logs (system/user prompts and raw outputs) locally in JSON format for debugging and transparency.

## Prerequisites

- Node.js (v18 or higher recommended)
- An [Anthropic API Key](https://console.anthropic.com/)

## Installation & Setup

### 1. Environment Variables
Create a `.env` file in your root (or server) directory based on the `.env.example` file:

```bash
cp .env.example .env
```
Open the `.env` file and insert your actual `ANTHROPIC_API_KEY`.

### 2. Server Setup (Backend)
Navigate to the server directory and install the required packages.

```bash
cd server
npm install express dotenv

# You will likely also need the following depending on your scraper.js and aiAnalysis.js implementation:
npm install @anthropic-ai/sdk cheerio axios 
```

### 3. Client Setup (Frontend)
Navigate to the client directory and install dependencies. Assuming this was scaffolded with Vite:

```bash
cd ../client
npm install
```

## Running the Project

You will need two terminal windows to run the frontend and backend simultaneously.

**Terminal 1: Start the Backend Server**
```bash
cd server
npm start # or node index.js / node server.js depending on your entry point
```

**Terminal 2: Start the Frontend Client**
```bash
cd client
npm run dev
```

Once both are running, open your browser to the local address provided by Vite (usually `http://localhost:5173`) to view and interact with the application.