import express from "express";
import { supabase } from "../supabase.js";

const router = express.Router();

/** ------------------------------
 * ADMINISTRADORES
 * ------------------------------ */
router.post("/", async (req, res) => {
  let { usuario, contrasena } = req.body;
  if (!usuario || !contrasena)
    return res.status(400).json({ message: "Faltan usuario o contraseña" });

  usuario = usuario.trim();
  contrasena = contrasena.trim();

  const { data, error } = await supabase
    .from("ADMIN")
    .insert([{ usuario, contrasena }])
    .select();

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json({ message: "✅ Usuario Administrador registrado correctamente", data: data[0] });
});

router.post("/admin-login", async (req, res) => {
  let { usuario, contrasena } = req.body;
  if (!usuario || !contrasena)
    return res.status(400).json({ message: "Faltan usuario o contraseña" });

  usuario = usuario.trim();
  contrasena = contrasena.trim();

  try {
    const { data, error } = await supabase
      .from("ADMIN")
      .select("*")
      .ilike("usuario", usuario)
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116")
      return res.status(400).json({ error: error.message });

    if (!data || data.contrasena.trim() !== contrasena)
      return res.status(400).json({ message: "Usuario o contraseña incorrectos" });

    return res.json({ message: "✅ Admin validado", data: { usuario: data.usuario, id: data.id } });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/list-admins", async (req, res) => {
  try {
    const { data, error } = await supabase.from("ADMIN").select("*");
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/** ------------------------------
 * USUARIOS
 * ------------------------------ */
router.get("/usuarios", async (req, res) => {
  try {
    const { data, error } = await supabase.from("usuarios").select("*");
    if (error) return res.status(400).json({ error: error.message });
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/usuarios", async (req, res) => {
  const { Cedula, Nombre, Contrasena } = req.body;
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .insert([{ Cedula, Nombre, Contrasena }])
      .select();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ message: "✅ Usuario creado", data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/usuarios/:Cedula", async (req, res) => {
  const { Cedula: CedulaParam } = req.params;
  const { Cedula, Nombre, Contrasena } = req.body;

  try {
    const { data, error } = await supabase
      .from("usuarios")
      .update({ Cedula, Nombre, Contrasena })
      .eq("Cedula", CedulaParam)
      .select();
    if (error) return res.status(400).json({ error: error.message });
    if (!data || data.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "✅ Usuario actualizado", data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/usuarios/:Cedula", async (req, res) => {
  const { Cedula } = req.params;
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .delete()
      .eq("Cedula", Cedula)
      .select();
    if (error) return res.status(400).json({ error: error.message });
    if (!data || data.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "✅ Usuario eliminado", data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** ------------------------------
 * PUBLICACIONES
 * ------------------------------ */
router.get("/publicaciones", async (req, res) => {
  try {
    const { data, error } = await supabase.from("publicaciones").select("*");
    if (error) return res.status(400).json({ error: error.message });
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/publicaciones/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from("publicaciones")
      .delete()
      .eq("id", id)
      .select();
    if (error) return res.status(400).json({ error: error.message });
    if (!data || data.length === 0) return res.status(404).json({ message: "Publicación no encontrada" });
    res.json({ message: "✅ Publicación eliminada", data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
