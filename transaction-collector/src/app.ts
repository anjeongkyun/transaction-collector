import { PORT } from "@/config";
import { Route } from "@/routes/route";
import express from "express";
import { connect, set } from "mongoose";
import cors from "cors";
import compression from "compression";
import { dbConnection } from "@/data/databases";
import { IJob } from "@/batch/job";

class App {
  public app: express.Application;
  public port: string | number;

  constructor(routes: Route[], jobs: IJob[]) {
    this.app = express();
    this.port = PORT || 3000;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeJobs(jobs);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`=================================`);
      console.log(`🚀 App listening on the port ${this.port}`);
      console.log(`=================================`);
    });
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach((route) => {
      this.app.use("/", route.router);
    });
  }

  private initializeJobs(jobs: IJob[]) {
    jobs.forEach((job) => job.initialize());
  }

  private connectToDatabase() {
    connect(dbConnection.url as string).catch((e) =>
      console.error("Connection error", e.message)
    );
  }

  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }
}

export default App;
