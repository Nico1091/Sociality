import express from "express";
import { supabase } from "../supabase.js";

const router = express.Router();

/** ------------------------------
 * ADMINISTRADORES
 * ------------------------------ */

// POST -> Registrar nuevo administrador
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

// POST -> Login Admin
router.post("/admin-login", async (req, res) => {
  let { usuario, contrasena } = req.body;
  if (!usuario || !contrasena)
    return res.status(400).json({ message: "Faltan usuario o contraseña" });

  usuario = usuario.trim();
  contrasena = contrasena.trim();

  try {
    const { data, error } = await supabase
      .from("ADMIN")       // <-- uso correcto de mayúsculas
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

// Listar todos los admins
router.get("/list-admins", async (req, res) => {
  try {
    const { data, error } = await supabase.from("ADMIN").select("usuario");
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
