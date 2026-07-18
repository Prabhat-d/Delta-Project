# Roamly

A full-stack Airbnb-inspired travel platform built with the MERN stack (MongoDB, Express, EJS, Node.js). Browse, list, and review unique stays around the world — with real authentication, image uploads, interactive maps, and a fully custom, premium frontend design.

**Live demo:** [https://roamly-02v3.onrender.com](https://roamly-02v3.onrender.com)

> Hosted on Render's free tier — the server spins down after periods of inactivity, so the first request after a while may take 30–60 seconds to wake up. Subsequent requests are fast.

---

## Features

- **Authentication** — secure signup/login with Passport.js (local strategy), hashed credentials, persistent sessions
- **Listings CRUD** — create, edit, and delete listings with owner-only permissions enforced server-side
- **Image uploads** — hosted on Cloudinary via Multer, with client- and server-side file size validation
- **Reviews & ratings** — 5-star rating system with author-only delete permissions
- **Interactive maps** — Leaflet + OpenStreetMap geocoding to pin each listing's location
- **Flash messaging** — clear success/error feedback across every user action
- **Fully responsive design** — custom-built UI across desktop, tablet, and mobile
- **Themed confirmation modals** — no browser-native `confirm()` dialogs, matches the app's visual language throughout

---

## Tech stack

**Backend**
- Node.js, Express
- MongoDB with Mongoose
- Passport.js (`passport-local`, `passport-local-mongoose`)
- express-session, connect-flash
- Multer + Cloudinary (`multer-storage-cloudinary`)
- Joi (schema validation)
- method-override

**Frontend**
- EJS with `ejs-mate` for layout support
- Bootstrap 5 (utility/behavior layer only — fully custom visual design on top)
- Leaflet.js for maps
- Vanilla JS for interactions (scroll reveals, wishlist toggle, modals, category filters)
- Custom design system: Fraunces + Plus Jakarta Sans typography, CSS variables for theming

**Hosting**
- Render (app)
- MongoDB Atlas (database)
- Cloudinary (image storage)

---

## Getting started locally

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB connection (local `mongod`, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- A free [Cloudinary](https://cloudinary.com/) account for image uploads

### 1. Clone the repo
```bash
git clone https://github.com/your-username/roamly.git
cd roamly
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the project root:
```
ATLASDB_URL=mongodb://127.0.0.1:27017/roamly
SECRET=your_session_secret_here
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

### 4. (Optional) Seed sample data
```bash
node init/index.js
```

### 5. Run the app
```bash
node app.js
```
or, with auto-restart on file changes:
```bash
npx nodemon app.js
```

The app runs at `http://localhost:8080` by default.

---

## Project structure

```
roamly/
├── app.js                 Entry point — Express setup, sessions, routes
├── cloudConfig.js          Cloudinary + Multer storage config
├── middleware.js           Auth guards, ownership checks, validation
├── schema.js                Joi validation schemas
├── controllers/            Route logic (listings, reviews, users)
├── models/                  Mongoose schemas (Listing, Review, User)
├── routes/                  Express routers
├── views/                   EJS templates
│   ├── layouts/
│   ├── includes/            navbar, footer, flash
│   ├── listings/
│   └── users/
├── public/
│   ├── css/                  style.css, rating.css
│   └── js/                    script.js, map.js
└── init/                     Database seed script
```

---

## Notes on scope

This project's frontend was fully redesigned as a portfolio piece — all backend logic (routes, controllers, schema, authentication) was preserved as-is; only presentation (EJS markup, CSS, and light interaction JS) was rebuilt.

---

## License

This project is for educational and portfolio purposes.
