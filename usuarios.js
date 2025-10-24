import express from "express";
import { supabase } from "../supabase.js";

const router = express.Router();

// POST -> Registrar nuevo usuario
router.post("/", async (req, res) => {
    const { Cedula, Nombre, Contrasena } = req.body;

    const { data, error } = await supabase
        .from("usuarios")
        .insert([{ Cedula, Nombre, Contrasena }])
        .select();

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({ message: "✅ Usuario registrado correctamente", data: data[0] });
});

// PUT -> Actualizar usuario por Cedula
router.put("/:Cedula", async (req, res) => {
    const { Cedula: CedulaParam } = req.params;
    const { Cedula, Nombre, Contrasena } = req.body;

    const { data, error } = await supabase
        .from("usuarios")
        .update({ Cedula, Nombre, Contrasena })
        .eq("Cedula", CedulaParam)
        .select();

    if (error) return res.status(400).json({ error: error.message });
    if (!data || data.length === 0) return res.status(404).json({ message: `❌ Usuario con Cédula ${CedulaParam} no encontrado.` });

    res.json({ message: "✅ Usuario actualizado correctamente", data: data[0] });
});

// POST -> Login de usuario
router.post("/login", async (req, res) => {
    const { Cedula, Nombre, Contrasena } = req.body;

    if (!Cedula || !Nombre || !Contrasena) {
        return res.status(400).json({ message: "Debe enviar Cédula, Nombre y Contraseña" });
    }

    const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("Cedula", Cedula)
        .eq("Nombre", Nombre)
        .eq("Contrasena", Contrasena);

    if (error) return res.status(400).json({ error: error.message });
    if (!data || data.length === 0) return res.status(401).json({ message: "Cédula, Nombre o contraseña incorrectos" });

    res.json({ message: "Login exitoso", data: data[0] });
});

export default router;
