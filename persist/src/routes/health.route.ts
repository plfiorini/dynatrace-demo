import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { State } from "../state";
import logger from "../logger";

export default async function healthRoutes(fastify: FastifyInstance) {
    fastify.get("/healthz", async (_request: FastifyRequest, _reply: FastifyReply) => {
        const state = State.getInstance();

        if (state.simulateError) {
            logger.warn("Simulating an error");
            throw new Error("Simulated error");
        }

        if (state.simulateSlow) {
            logger.warn("Simulating slow response");
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }

        return {
            status: "ok",
            timestamp: new Date(),
        };
    });
    fastify.get("/readyz", async (_request: FastifyRequest, _reply: FastifyReply) => {
        return {
            status: "ok",
            timestamp: new Date(),
        };
    });
}
