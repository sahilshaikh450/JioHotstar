# JioHotstar-Style Streaming Platform

A polished **React + Vite** streaming-platform project inspired by modern OTT interfaces. It is built for learning, portfolio demonstrations, and frontend CRUD practice.

> **Note:** This is a learning project and is not affiliated with or endorsed by JioHotstar.

## ✨ Features

- Modern dark OTT interface
- Hero banner with Watch Now / My List actions
- Trending, Top Rated, Action-packed and Continue Watching rows
- Search across title, genre, director, cast and description
- Category filters
- Home / Movies / Shows / Sports / Kids navigation
- Movie detail modal with metadata and embedded trailer
- My List powered by `localStorage`
- Continue Watching history powered by `localStorage`
- **Complete frontend CRUD**
  - Create a title
  - Read/list all titles
  - Update a title
  - Delete a title
- CRUD data persists in browser `localStorage`
- Responsive mobile/tablet/desktop layout
- Reusable React components

## 🧰 Tech Stack

- React 19
- Vite
- JavaScript (ES Modules)
- HTML5
- CSS3
- Browser LocalStorage

## 🚀 Run in VS Code

Open the project folder in VS Code and run:

```bash
npm install
npm run dev
```

Vite will show a local URL, normally:

```text
http://localhost:5173/
```

For a production build:

```bash
npm run build
npm run preview
```

## 🧩 CRUD Demo

Scroll to **Content Management** at the bottom of the homepage and click **Open CRUD Manager**.

### Create
Fill the form and click **Add Title**.

### Read
All current titles are displayed in the library table.

### Update
Click **Edit**, change fields, then click **Update Title**.

### Delete
Click **Delete** to remove a title from the library and My List.

The changes remain after refreshing because the library is stored in browser LocalStorage.

## 📁 Structure

```text
jiohotstar-main/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── MovieCard.jsx
│   │   └── MovieModal.jsx
│   ├── data/
│   │   └── movies.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 Portfolio Highlights

This project demonstrates React state management with `useState`, derived data with `useMemo`, side effects with `useEffect`, reusable components, conditional rendering, responsive CSS, search/filter logic, modal UI, and browser persistence.

## ⚠️ Image / Trailer URLs

The sample catalog uses publicly accessible image and YouTube embed URLs from the source learning project. For a production application, use properly licensed assets and a backend/database instead of LocalStorage.
