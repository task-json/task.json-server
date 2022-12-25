import Fastify from "fastify";
import { authHandler, getTokenFromHeader, verifyToken } from "./auth.js";
import { readData } from "./data.js";

const fastify = Fastify({ logger: true });

// Type definition for 
declare module 'fastify' {
  interface FastifyRequest {
    userId: string
  }
}

// Session routes
fastify.register(async (instance, opts) => {
  // create a new session
  fastify.post("/session", async (request, reply) => {
  });
});

// Data routes
fastify.register(async (instance, opts) => {
  // Add userId field to request object prototype to make it faster
  instance.decorateRequest("userId", "");

  // one-way download
  instance.get("/", { preHandler: authHandler }, async (request, reply) => {
    const data = readData(request.userId);
    return { data };
  });
  // one-way upload
  fastify.put("/", { preHandler: authHandler }, async (request, reply) => {
  });
  // two-way sync
  fastify.patch("/", { preHandler: authHandler }, async (request, reply) => {
  });
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
start();
