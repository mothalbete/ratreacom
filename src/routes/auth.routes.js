const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

// REGISTER
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const { email, nombre, password, edad } = req.body;

  if (!email || !nombre || !password) {
    return res
      .status(400)
      .render("register", { error: "Todos los campos son obligatorios" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .render("register", { error: "El email ya está registrado" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await User.create({
      email,
      nombre,
      password: hashedPassword,
      edad: edad || null
    });

    return res.redirect("/auth/login");
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return res
      .status(500)
      .render("register", { error: "Error al registrar usuario" });
  }
});

// LOGIN
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .render("login", { error: "Todos los campos son obligatorios" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .render("login", { error: "El email no está registrado" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(400)
      .render("login", { error: "Contraseña incorrecta" });
  }

  // Guardar usuario en sesión
  req.session.user = {
    id: user._id,
    email: user.email,
    nombre: user.nombre,
    edad: user.edad
  };

  return res.redirect("/dashboard");
});

module.exports = router;
