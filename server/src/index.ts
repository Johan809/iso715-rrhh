import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { authRouter } from "./routes/auth.route";
import { puestoRouter } from "./routes/puesto.route";
import { errorHandler } from "./lib/middleware/errors";
import { connectToDatabase } from "./databaseConnection";
import { empleadoRouter } from "./routes/empleado.route";
import { candidatoRouter } from "./routes/candidato.route";
import { roleRoute as roleRouter } from "./routes/role.route";
import { competenciaRouter } from "./routes/competencia.route";
import { capacitacionRouter } from "./routes/capacitacion.route";
import { idiomaRoute as idiomaRouter } from "./routes/idioma.route";
import { usuarioRoute as usuarioRouter } from "./routes/usuario.route";
import { experienciaLaboralRouter } from "./routes/experienciaLaboral.route";

dotenv.config();

const HOST = process.env.HOST || "http://localhost";
const PORT = parseInt(process.env.PORT || "4500");
const corsOptions = { origin: "http://localhost:4200", credentials: true };

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
app.get("/", (req, res) => {
  return res.json({ message: "Hello World!" });
});

app.use("/api", authRouter());
app.use("/api", candidatoRouter());
app.use("/api", experienciaLaboralRouter());
app.use("/api", capacitacionRouter());
app.use("/api", puestoRouter());
app.use("/api", competenciaRouter());
app.use("/api", idiomaRouter());
app.use("/api", empleadoRouter());
app.use("/api", roleRouter());
app.use("/api", usuarioRouter());
app.use(errorHandler);

app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Application started on URL ${HOST}:${PORT} 🎉`);
});
