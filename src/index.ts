import express from "express";
import itemsRouter from "./routes/items";

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("OK");
});

app.use("/items", itemsRouter);

if (require.main === module) {
  app.listen(3000, () => {
    console.log(`🚀 Server running on http://localhost:3000`);
  });
}

export default app;
