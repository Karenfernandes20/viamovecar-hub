
import "./server/env";
import { runMigrations } from "./server/db/migrations";

async function run() {
    try {
        console.log("Starting migrations...");
        await runMigrations();
        console.log("Migrations finished successfully!");
    } catch (e) {
        console.error("Migration error:", e);
    } finally {
        process.exit(0);
    }
}

run();
