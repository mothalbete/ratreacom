require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const session = require("express-session");
const MongoStore = require("connect-mongo");

const authRoutes = require("./routes/auth.routes");
const isAuthenticated = require("./middleware/auth");
const searchRoutes = require("./routes/search.routes");

const SearchCollection = require("./models/SearchCollection");

const app = express();

// Sesiones guardadas en Mongo (connect-mongo v5)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secretkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 60 * 60 * 24 * 7
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: false
    }
  })
);

// Archivos estáticos
app.use(express.static(path.join(__dirname, "..", "public")));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));

// Mongo
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo conectado"))
  .catch((err) => console.error("Error al conectar Mongo:", err));

// Rutas
app.use("/auth", authRoutes);
app.use("/search", searchRoutes);

// Dashboard protegido (vista + buscador + colecciones del usuario)
app.get("/dashboard", isAuthenticated, async (req, res) => {
  const collections = await SearchCollection.find({
    createdBy: req.session.user.id
  });

  res.render("dashboard", { 
    user: req.session.user,
    query: null,
    city: null,
    results: null,
    error: null,
    collections,
    relatedCollections: []   // ← añadido para evitar ReferenceError
  });
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
});

app.listen(3000, () => console.log("Servidor en puerto 3000"));
