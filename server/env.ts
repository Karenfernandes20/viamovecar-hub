import dotenv from "dotenv";
import path from "path";

// Load .env from parent directory
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
