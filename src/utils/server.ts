import routes from "@/routes/.";
import express from "express";
import deserializeUser from "@/middleware/deserializeUser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions } from "./corsOptions";

const createServer = () => {
  const app = express();

  app.use(
    cors({
      origin: corsOptions.origin,
      credentials: true,
    })
  );

  app.use(cookieParser());
  app.use(deserializeUser);

  routes(app);

  return app;
};

export default createServer;
