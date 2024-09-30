import { FastifyInstance } from "fastify";
import { upload } from "./upload";
import { confirm } from "./confirm";

export async function measureRoutes(app: FastifyInstance) {
  app.post("/upload", upload);
  app.patch("/confirm", confirm);
}
