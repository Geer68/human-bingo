import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { port } from "./config/index.js";
import router from "./routes/routes.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(router);

app.listen(port);
console.log(new Date());
console.log(`Server started on port ${port}`);
