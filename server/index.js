import express from "express";
import cors from "cors";
import pkg from "pg";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes.js";

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Pass pool to routes via locals or specific injection if needed, 
// for now we kept simple structure where controller imports pool separately.
// Ideally, dependency injection is better, but following previous pattern:
app.use("/api", routes);

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

// Serve static files from the React app
const distPath = path.join(__dirname, "../dist");
app.use(express.static(distPath));

// Catch-all handler for any request that doesn't match the API or static files
app.use((req, res, next) => {
    if (req.method === 'GET') {
        res.sendFile("index.html", { root: distPath });
    } else {
        next();
    }
});

app.listen(port, () => {
    console.log(`Server rodando na porta ${port}`);
});
