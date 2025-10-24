import express from "express";
import { supabase } from "../supabase.js";

const router = express.Router();

// POST -> Registrar nuevo administrador
router.post("/", async (req, res) => {
    const { usuario, contrasena } = req.body;

    const { data, error } = await supabase
        .from("ADMIN")
        .insert([{ usuario, contrasena }])
        .select();

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({ message: "✅ Usuario Administrador registrado correctamente", data: data[0] });
});

// PUT -> Actualizar administrador por ID
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { usuario, contrasena } = req.body;

    const { data, error } = await supabase
        .from("ADMIN")
        .update({ usuario, contrasena })
        .eq("id", id)
        .select();

    if (error) return res.status(400).json({ error: error.message });
    if (!data || data.length === 0) return res.status(404).json({ message: `❌ Administrador con ID ${id} no encontrado.` });

    res.json({ message: "✅ Usuario Administrador actualizado correctamente", data: data[0] });
});

export default router;
