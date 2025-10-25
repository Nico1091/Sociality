
import express from "express";
import { supabase } from "../supabase.js";

const router = express.Router();


router.get("/", async (req, res) => {
  const { cedula } = req.query;
  if (!cedula) return res.status(400).json({ message: "Debe enviar la cédula del usuario (cedula)" });

  try {
    const { data, error } = await supabase
      .from("Publicaciones")
      .select("*")
      .or(`visibilidad.eq.Publica,"Cedula".eq.${cedula}`)
      .order('"Fecha de Publicacion"', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    const mapped = data.map(pub => ({
      id: pub.id,
      usuario: pub.usuario ?? null,
      comentario_pub: pub["Comentario_Pub"] ?? null,
      url_publicacion: pub["Url publicacion"] ?? null,
      visibilidad: pub.visibilidad ?? null,
      fecha_publicacion: pub["Fecha de Publicacion"] ?? null,
      fecha_edicion: pub["Fecha de edicion"] ?? null,
      likes: pub.Likes ?? 0,
      cedula: pub.Cedula ?? null
    }));

    res.json({ message: "Publicaciones obtenidas", data: mapped });
  } catch (err) {
    res.status(500).json({ message: "Error al obtener publicaciones", error: err.message });
  }
});


router.post("/", async (req, res) => {
  const { usuario, Cedula, comentarioPub, urlPublicacion, visibilidad } = req.body;

  if (!Cedula || !comentarioPub) {
    return res.status(400).json({ message: "Debe enviar Cedula y comentarioPub" });
  }

  try {
    const insertObj = {
      usuario: usuario || null,
      Cedula: Cedula,
      "Comentario_Pub": comentarioPub,
      "Url publicacion": urlPublicacion || null,
      visibilidad: visibilidad || "Privada",
      "Fecha de edicion": null,
      Likes: 0
    };

    const { data, error } = await supabase
      .from("Publicaciones")
      .insert([insertObj])
      .select();

    if (error) throw error;

    const pub = data[0];
    const mapped = {
      id: pub.id,
      usuario: pub.usuario ?? null,
      comentario_pub: pub["Comentario_Pub"] ?? null,
      url_publicacion: pub["Url publicacion"] ?? null,
      visibilidad: pub.visibilidad ?? null,
      fecha_publicacion: pub["Fecha de Publicacion"] ?? null,
      fecha_edicion: pub["Fecha de edicion"] ?? null,
      likes: pub.Likes ?? 0,
      cedula: pub.Cedula ?? null
    };

    res.status(201).json({ message: "Publicación creada", data: mapped });
  } catch (err) {
    res.status(500).json({ message: "Error al crear publicación", error: err.message });
  }
});


router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { Cedula, Url_Publicacion, Comentario_Pub, Visibilidad } = req.body;

  if (!Cedula) return res.status(400).json({ message: "Debe enviar Cedula para verificar propietario" });

  try {
    
    const { data: existingArr, error: selErr } = await supabase
      .from("Publicaciones")
      .select("Cedula")
      .eq("id", id)
      .limit(1)
      .single();

    if (selErr) return res.status(400).json({ error: selErr.message });
    if (!existingArr) return res.status(404).json({ message: "Publicación no encontrada" });

    if (String(existingArr.Cedula) !== String(Cedula)) {
      return res.status(403).json({ message: "No autorizado: solo el propietario puede editar esta publicación" });
    }

    // construir objeto de update respetando nombres con espacios
    const updateObj = {};
    if (typeof Url_Publicacion !== "undefined") updateObj["Url publicacion"] = Url_Publicacion;
    if (typeof Comentario_Pub !== "undefined") updateObj["Comentario_Pub"] = Comentario_Pub;
    if (typeof Visibilidad !== "undefined") updateObj["visibilidad"] = Visibilidad;
    // actualizar Fecha de edicion
    updateObj["Fecha de edicion"] = new Date().toISOString();

    const { data, error } = await supabase
      .from("Publicaciones")
      .update(updateObj)
      .eq("id", id)
      .select();

    if (error) return res.status(400).json({ error: error.message });

    const pub = data[0];
    const mapped = {
      id: pub.id,
      usuario: pub.usuario ?? null,
      comentario_pub: pub["Comentario_Pub"] ?? null,
      url_publicacion: pub["Url publicacion"] ?? null,
      visibilidad: pub.visibilidad ?? null,
      fecha_publicacion: pub["Fecha de Publicacion"] ?? null,
      fecha_edicion: pub["Fecha de edicion"] ?? null,
      likes: pub.Likes ?? 0,
      cedula: pub.Cedula ?? null
    };

    res.json({ message: "Publicación actualizada", data: mapped });
  } catch (err) {
    res.status(500).json({ message: "Error al editar publicación", error: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { Cedula } = req.body;

  if (!Cedula) return res.status(400).json({ message: "Debe enviar Cedula para verificar propietario" });

  try {
    const { data: existingArr, error: selErr } = await supabase
      .from("Publicaciones")
      .select("Cedula")
      .eq("id", id)
      .limit(1)
      .single();

    if (selErr) return res.status(400).json({ error: selErr.message });
    if (!existingArr) return res.status(404).json({ message: "Publicación no encontrada" });

    if (String(existingArr.Cedula) !== String(Cedula)) {
      return res.status(403).json({ message: "No autorizado: solo el propietario puede borrar esta publicación" });
    }

    const { data, error } = await supabase
      .from("Publicaciones")
      .delete()
      .eq("id", id)
      .select();

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: "Publicación eliminada", data: data[0] });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar publicación", error: err.message });
  }
});


router.put("/like/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { data: pubData, error: getError } = await supabase
      .from("Publicaciones")
      .select("Likes")
      .eq("id", id)
      .single();

    if (getError) return res.status(400).json({ error: getError.message });
    if (!pubData) return res.status(404).json({ message: "Publicación no encontrada" });

    const newLikes = (pubData.Likes || 0) + 1;

    const { data, error } = await supabase
      .from("Publicaciones")
      .update({ Likes: newLikes, "Fecha de edicion": new Date().toISOString() })
      .eq("id", id)
      .select();

    if (error) return res.status(400).json({ error: error.message });

    const pub = data[0];
    const mapped = {
      id: pub.id,
      usuario: pub.usuario ?? null,
      comentario_pub: pub["Comentario_Pub"] ?? null,
      url_publicacion: pub["Url publicacion"] ?? null,
      visibilidad: pub.visibilidad ?? null,
      fecha_publicacion: pub["Fecha de Publicacion"] ?? null,
      fecha_edicion: pub["Fecha de edicion"] ?? null,
      likes: pub.Likes ?? 0,
      cedula: pub.Cedula ?? null
    };

    res.json({ message: "Like agregado", data: mapped });
  } catch (err) {
    res.status(500).json({ message: "Error al dar like", error: err.message });
  }
});

export default router;
