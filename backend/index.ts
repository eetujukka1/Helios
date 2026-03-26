import dotenv from "dotenv";
import app from "./app.js";

const env = process.env.NODE_ENV;

dotenv.config({
  path: env ? `.env.${env}` : ".env",
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
