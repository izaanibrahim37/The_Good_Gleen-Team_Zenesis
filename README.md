# The Good Gleen - Team Zenesis

A web application for connecting **Farmers**, **Retailers**, and **NGOs** with an intelligent matching system and a secure authentication flow.

---

## Folder Structure

```
/The Good Gleen - Team Zenesis
├── Frontend
│   ├── .bolt/
│   ├── src/
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── vite-env.d.ts
│   └── vite.config.ts
├── ML_model.ipynb
```

---

## Tech Stack

- **Frontend:** React + TypeScript + Vite  
- **Styling:** Tailwind CSS + PostCSS  
- **Backend Services:** Supabase (for authentication & database)  
- **ML Model:** Python (in `ML_model.ipynb`)  
- **Package Management:** npm  
- **Linting:** ESLint  
- **Env Management:** `.env` files  
- **Prompt Tooling:** Bolt framework (assumed from `.bolt/` folder)

---

## How to Run the Project

### Prerequisites

- Node.js (v16 or above)
- npm or yarn
- Python 3 (for running the ML model notebook)

---

### Running the Frontend

```bash
cd "The Good Gleen - Team Zenesis/Frontend"

# Install dependencies
npm install

# Create a .env file from example
cp .env.example .env

# Run the dev server
npm run dev
```

The app will run at: `http://localhost:5173/`

---

### Running the ML Model

Open `ML_model.ipynb` using Jupyter Notebook or Google Colab.

---

### **Author**  
**Izaan Ibrahim Sayed**  
Email: izaanahmad37@gmail.com  
GitHub: [github.com/izaanahmad37](https://github.com/izaanibrahim37) 
