import dns from "node:dns";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dns.setDefaultResultOrder("ipv4first");

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(here, "../.env") });
dotenv.config();
