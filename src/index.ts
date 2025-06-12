import express from "express";
import itemsRouter from "./routes/items";
import { initDb, dropDb, pool } from "./db/pool";

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("OK");
});

app.use("/items", itemsRouter);

if (require.main === module) {
  initDb()
    .then(() => {
      const server = app.listen(3000, () => {
        console.log(`🚀 Server running on http://localhost:3000`);
      });

      const shutdown = async () => {
        try {
          await dropDb();
          await pool.end();
        } catch (err) {
          console.error("Error during shutdown", err);
        } finally {
          server.close(() => process.exit(0));
        }
      };

      process.on("SIGINT", shutdown);
      process.on("SIGTERM", shutdown);
    })
    .catch((err) => {
      console.error("Failed to init database", err);
      process.exit(1);
    });
}

export default app;
