import { ZodError } from "zod";
import fastify from "fastify";
import { env } from "./env";
import { measureRoutes } from "./http/controllers/routes";
import multipart from "@fastify/multipart";

export const app = fastify();

app.register(multipart);

app.register(measureRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error.", issues: error.format() });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    console.error(error.message);
  }

  return reply.status(500).send({ message: "Internal server error." });
});
