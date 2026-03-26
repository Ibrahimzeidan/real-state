import app from "./app";
import { connectDb } from "./config/db";
import { env } from "./config/env";

const port = env.PORT;

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
