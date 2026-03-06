const express = require("express");
const router = express.Router();
const { getJson } = require("serpapi");
const isAuthenticated = require("../middleware/auth");

const SearchCollection = require("../models/SearchCollection");
const UserSearch = require("../models/UserSearch");

// Procesar búsqueda
router.post("/", isAuthenticated, async (req, res) => {
  const query = req.body.query?.trim();
  const city = req.body.city?.trim() || "";

  if (!query) {
    return res.render("dashboard", {
      user: req.session.user,
      query: null,
      city: null,
      results: null,
      relatedCollections: [],
      error: "Debes introducir un término de búsqueda",
      collections: []
    });
  }

  const fullQuery = city ? `${query} ${city}` : query;

  try {
    let collection = await SearchCollection.findOne({
      term: query,
      city,
      createdBy: req.session.user.id
    });

    if (!collection) {
      const local = await getJson({
        engine: "google_local",
        q: fullQuery,
        api_key: process.env.SERPAPI_KEY
      });

      const shopping = await getJson({
        engine: "google_shopping",
        q: fullQuery,
        api_key: process.env.SERPAPI_KEY
      });

      const businesses = local.local_results || [];
      const products = shopping.shopping_results || [];

      collection = await SearchCollection.create({
        term: query,
        city,
        createdBy: req.session.user.id,
        businesses,
        products
      });
    }

    await UserSearch.create({
      userId: req.session.user.id,
      term: query,
      city,
      collectionId: collection._id
    });

    const userCollections = await SearchCollection.find({
      createdBy: req.session.user.id
    });

    // Colecciones relacionadas con la búsqueda
    const relatedCollections = await SearchCollection.find({
      createdBy: req.session.user.id,
      term: { $regex: query, $options: "i" }
    });

    res.render("dashboard", {
      user: req.session.user,
      query,
      city,
      results: {
        businesses: collection.businesses,
        products: collection.products
      },
      relatedCollections,
      error: null,
      collections: userCollections
    });

  } catch (error) {
    console.error("Error en búsqueda:", error);

    const userCollections = await SearchCollection.find({
      createdBy: req.session.user.id
    });

    res.render("dashboard", {
      user: req.session.user,
      query,
      city,
      results: null,
      relatedCollections: [],
      error: "Error al buscar información",
      collections: userCollections
    });
  }
});

// Ver colección guardada
router.get("/", isAuthenticated, async (req, res) => {
  const term = req.query.term;
  const city = req.query.city || "";

  if (!term) return res.redirect("/dashboard");

  const collection = await SearchCollection.findOne({
    term,
    city,
    createdBy: req.session.user.id
  });

  const userCollections = await SearchCollection.find({
    createdBy: req.session.user.id
  });

  const relatedCollections = await SearchCollection.find({
    createdBy: req.session.user.id,
    term: { $regex: term, $options: "i" }
  });

  if (!collection) {
    return res.render("dashboard", {
      user: req.session.user,
      query: term,
      city,
      results: null,
      relatedCollections,
      error: "No existe una colección con ese término",
      collections: userCollections
    });
  }

  res.render("dashboard", {
    user: req.session.user,
    query: term,
    city,
    results: {
      businesses: collection.businesses,
      products: collection.products
    },
    relatedCollections,
    error: null,
    collections: userCollections
  });
});

// Sugerencias de búsqueda
router.get("/suggestions", isAuthenticated, async (req, res) => {
  const q = req.query.q;

  if (!q) return res.json([]);

  const suggestions = await SearchCollection.find({
    createdBy: req.session.user.id,
    term: { $regex: q, $options: "i" }
  }).limit(10);

  res.json(suggestions);
});

module.exports = router;
