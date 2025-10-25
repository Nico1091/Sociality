import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import adminRoutes from "./routes/Admin.js";
import usuarioRoutes from "./routes/usuarios.js";
import publicacionesRoutes from "./routes/publicaciones.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Servir HTML/CSS/JS desde "public"
app.use(express.static(path.join(__dirname, "public")));

// Rutas API
app.use("/ADMIN", adminRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/publicaciones", publicacionesRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
