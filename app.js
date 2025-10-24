import express from "express";
import cors from "cors";
import adminRoutes from "./routes/Admin.js";
import usuarioRoutes from "./routes/usuarios.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/ADMIN", adminRoutes);
app.use("/usuarios", usuarioRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
