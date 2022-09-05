import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import 'express-async-errors';
import router from "./routes/index"
import errorHandler from "./middlewares/errorHandler";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(router);
app.use(errorHandler);

const PORT = process.env.PORT || 4000

app.listen(PORT, () => console.log(`running on port ${PORT}`))