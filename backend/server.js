import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";
import path from "path";

dotenv.config();
const app = express();
const __dirname = path.resolve();

app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(morgan("dev"));

app.use(async (req, res, next) => {
	try {
		const decision = await aj.protect(req, { requested: 1 });

		if (decision.isDenied()) {
			if (decision.reason.isRateLimit()) {
				res.status(429).json({ success: false, error: "Rate limit exceeded" });
			} else if (decision.reason.isBot()) {
				res.status(403).json({ success: false, error: "Bot detected" });
			} else {
				res.status(403).json({ success: false, error: "Forbidden" });
			}
			return;
		}
		if (
			decision.results.some(
				(result) => result.reason.isBot() && result.reason.isSpoofed()
			)
		) {
			res.status(403).json({ success: false, error: "Spoofed Bot detected" });
			return;
		}
		next();
	} catch (error) {
		console.log(error);
		next(error);
	}
});

app.use("/api/products", productRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist  ")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

async function initDb() {
	try {
		await sql`
            CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            image  VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
            )
        `;

		console.log("Database initialized successfully");
	} catch (error) {
		console.log(error);
	}
}

initDb().then(
	app.listen(process.env.PORT || 3000, () => {
		console.log("Server is running on port 3000");
	})
);
