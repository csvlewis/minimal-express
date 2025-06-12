import express from "express";
import itemsRouter from "./routes/items";
import { initDb } from "./db/pool";

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("OK");
});

app.use("/items", itemsRouter);

if (require.main === module) {
  initDb()
    .then(() => {
      app.listen(3000, () => {
        console.log(`🚀 Server running on http://localhost:3000`);
      });
    })
    .catch((err) => {
      console.error("Failed to init database", err);
      process.exit(1);
    });
}

export default app;
