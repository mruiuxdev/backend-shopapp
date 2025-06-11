import cookieSession from "cookie-session";
import cors from "cors";
import dotenv from "dotenv";
import express, { Application, ErrorRequestHandler } from "express";
import path from "path";
import { AuthRouter } from "./auth/auth.routers";
import connectDB from "./db/db";
import { NotFoundError } from "./errors";
import { currentUser, errorHandler } from "./middlewares";

export class AppModule {
  constructor(private app: Application) {
    this.loadEnv();
    this.connectDatabase();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private loadEnv() {
    dotenv.config();
  }

  private async connectDatabase() {
    await connectDB();
  }

  private setupMiddleware() {
    this.app.set("trust proxy", false);

    this.app.use(
      cors({
        origin: "*",
        credentials: false,
        optionsSuccessStatus: 200,
      })
    );

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

    this.app.use(
      cookieSession({
        signed: false,
        secure: process.env.NODE_ENV === "production",
      })
    );

    this.app.use(currentUser);

    this.app.use(
      "/uploads",
      express.static(path.join(process.cwd(), "src", "uploads"))
    );
  }

  private setupRoutes() {
    console.log("Mounting AuthRouter on /api/auth");
    this.app.use("/api/auth", AuthRouter);
    this.app.all("/api", (_req, _res, next) => {
      next(new NotFoundError());
    });
  }

  private setupErrorHandling() {
    this.app.use(errorHandler as ErrorRequestHandler);
  }

  public start() {
    const port = process.env.PORT || 8000;
    this.app.listen(port, () =>
      console.log(`🚀 Server is running on port ${port}`)
    );
  }
}
