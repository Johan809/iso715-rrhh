import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./databaseConnection";
import { competenciaRouter } from "./routes/competencia.route";
import { idiomaRoute as idiomaRouter } from "./routes/idioma.route";
import { roleRoute as roleRouter } from "./routes/role.route";
import { usuarioRoute as usuarioRouter } from "./routes/usuario.route";
import { capacitacionRouter } from "./routes/capacitacion.route";
import { puestoRouter } from "./routes/puesto.route";

dotenv.config();

const HOST = process.env.HOST || "http://localhost";
const PORT = parseInt(process.env.PORT || "4500");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", roleRouter());
app.use("/", usuarioRouter());
app.use("/", competenciaRouter());
app.use("/", idiomaRouter());
app.use("/", capacitacionRouter());
app.use("/", puestoRouter());

app.get("/", (req, res) => {
  return res.json({ message: "Hello World!" });
});

app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Application started on URL ${HOST}:${PORT} 🎉`);
});
