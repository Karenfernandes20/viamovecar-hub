import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
const port = process.env.PORT || 3000;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("DATABASE_URL não definida. Configure-a no Render para conectar ao Postgres/PgHero.");
}

const pool = databaseUrl
  ? new Pool({ connectionString: databaseUrl })
  : null;

app.use(cors());
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  try {
    if (!pool) {
      return res.status(200).json({ status: "ok", database: "not_configured" });
    }

    const result = await pool.query("SELECT NOW() as now");
    return res.status(200).json({
      status: "ok",
      database: "connected",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Erro ao verificar banco de dados:", error);
    return res.status(500).json({ status: "error", message: "DB check failed" });
  }
});

app.listen(port, () => {
  console.log(`Server rodando na porta ${port}`);
});
