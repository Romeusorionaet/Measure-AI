import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { env } from "../env";

config();
console.log("Node env:", env.NODE_ENV);

export const prisma = new PrismaClient();
