import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./databaseConnection";
import { competenciaRouter } from "./routes/competencia.route";
import { idiomaRoute } from "./routes/idioma.route";
import { roleRoute } from "./routes/role.route";
import { usuarioRoute } from "./routes/usuario.route";

dotenv.config();

const HOST = process.env.HOST || "http://localhost";
const PORT = parseInt(process.env.PORT || "4500");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", roleRoute());
app.use("/", usuarioRoute());
app.use("/", competenciaRouter());
app.use("/", idiomaRoute());

app.get("/", (req, res) => {
  return res.json({ message: "Hello World!" });
});

app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Application started on URL ${HOST}:${PORT} 🎉`);
});
