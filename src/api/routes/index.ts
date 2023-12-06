import { Express } from "express";
import userRoutes from "./user.routes";
import sessionRoutes from "./session.routes";
import { errorHandler } from "@/middleware/errorHandler";

const routes = (app: Express) => {
  app.get("/api/healthCheck", (req, res) => {
    res.sendStatus(200);
  });
  app.use("/api/user", userRoutes);
  app.use("/api/sessions", sessionRoutes);
  app.use(errorHandler);
};

export default routes;
