import { FastifyInstance } from "fastify";
import { upload } from "./upload";
import { confirm } from "./confirm";
import { listMeasures } from "./list-measures";

export async function measureRoutes(app: FastifyInstance) {
  app.post("/upload", upload);
  app.patch("/confirm", confirm);
  app.get("/:customer_code/list", listMeasures);
}
