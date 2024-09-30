import { FastifyInstance } from "fastify";
import { upload } from "./upload";

export async function measureRoutes(app: FastifyInstance) {
  app.post("/upload", upload);
}
