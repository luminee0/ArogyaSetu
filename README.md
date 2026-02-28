# Pocket Doctor AI Healthcare Platform

![Pocket Doctor Home Page](C:\\Users\\SOHAM\\.gemini\\antigravity\\brain\\7b0f27dc-3f1b-415c-a90d-9f89a8c9279f\\pocket_doctor_homepage_1772211333481.png)

---

## Overview

Pocket Doctor is a **premium‑grade, modern web application** that serves as a comprehensive health‑wellness hub. It combines a sleek glass‑morphism UI, dark mode, and AI‑powered features such as:

- Symptom checking (Gemini/OpenAI powered chat interface)
- X‑ray analysis
- Health reports & analytics
- Medication management calendar
- Secure patient records

All data is encrypted and HIPAA‑compliant, with optional integration to Gemini/OpenAI models for AI insights.

---

## Features

- **Responsive Dashboard** – Central hub with navigation, quick actions, and health metric cards.
- **Interactive Analytics** – Filterable visualizations, share & PDF export.
- **Medication Manager** – Calendar view, add‑medication modal, reminders.
- **AI Tools** – Symptom checker chatbot and X‑ray analysis.
- **Dark Mode & Glass‑morphism** – Premium visual experience with smooth micro‑interactions.
- **Accessibility** – Semantic HTML, ARIA labels, keyboard navigation, high‑contrast mode.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 (Vite), Tailwind‑CSS, React Router, Zustand/Context (future) |
| Backend (planned) | FastAPI (Python), PostgreSQL (or SQLite for dev), JWT auth |
| AI Integration | Gemini / OpenAI APIs (via secure env vars) |
| Testing | React Testing Library, Jest, Pytest |

---

## Project Structure

```text
PocketDoctor/
├─ public/                 # static assets
├─ src/
│   ├─ assets/            # images, icons
│   ├─ components/        # reusable UI components
│   ├─ pages/             # page‑level components (Landing, Dashboard, etc.)
│   ├─ services/          # API client (api.js)
│   ├─ App.jsx
│   └─ main.jsx
├─ convert.py             # utility script (currently with lint warnings)
├─ README.md              # ← this file
├─ package.json
└─ vite.config.js
```

---

## Setup & Development

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd pocketdoctordiversion
   ```
2. **Install frontend dependencies**
   ```bash
   npm install
   npm run dev   # starts Vite dev server at http://localhost:5173
   ```
3. **(Optional) Backend setup**
   ```bash
   python -m venv .venv
   .\\.venv\\Scripts\\activate   # Windows
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```
4. **Testing**
   - UI: `npm test`
   - API: `pytest`

---

## Contributing

- Follow the existing code style (Prettier + ESLint).
- Keep UI components accessible and responsive.
- Add unit tests for new features.
- Update this README when major changes are made.

---

## License

MIT License – see the `LICENSE` file for details.

---

*Generated on 2026‑02‑27 by Antigravity (OpenAI‑powered coding assistant).*
