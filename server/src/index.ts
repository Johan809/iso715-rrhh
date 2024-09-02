import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./databaseConnection";
import { competenciaRouter } from "./routes/competencia.route";
import { idiomaRoute as idiomaRouter } from "./routes/idioma.route";
import { roleRoute as roleRouter } from "./routes/role.route";
import { usuarioRoute as usuarioRouter } from "./routes/usuario.route";
import { capacitacionRouter } from "./routes/capacitacion.route";
import { puestoRouter } from "./routes/puesto.route";
import { experienciaLaboralRouter } from "./routes/experienciaLaboral.route";
import { candidatoRouter } from "./routes/candidato.route";
import { empleadoRouter } from "./routes/empleado.route";
import { authRouter } from "./routes/auth.route";
import { errorHandler } from "./lib/middleware/errors";

dotenv.config();

const HOST = process.env.HOST || "http://localhost";
const PORT = parseInt(process.env.PORT || "4500");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", roleRouter());
app.use("/api", usuarioRouter());
app.use("/api", competenciaRouter());
app.use("/api", idiomaRouter());
app.use("/api", capacitacionRouter());
app.use("/api", puestoRouter());
app.use("/api", experienciaLaboralRouter());
app.use("/api", candidatoRouter());
app.use("/api", empleadoRouter());
app.use("/api", authRouter());

app.get("/", (req, res) => {
  return res.json({ message: "Hello World!" });
});

app.use(errorHandler);

app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Application started on URL ${HOST}:${PORT} 🎉`);
});
