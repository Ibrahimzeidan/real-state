import express from "express";
import cors from "cors";

import { env } from "./config/env";
import { errorHandler } from "./middlewares/error";
import routes from "./routes";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN || true,
    credentials: true,
  }),
);

app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api", routes);

app.use(errorHandler);

export default app;
