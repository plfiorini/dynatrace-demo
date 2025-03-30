import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { State, StateType } from "../state";

export default async function stateRoutes(fastify: FastifyInstance) {
    fastify.post("/state", {
        schema: {
            body: {
                type: "object",
                properties: {
                    simulateError: { type: "boolean" },
                    simulateSlow: { type: "boolean" },
                },
                required: ["simulateError", "simulateSlow"],
            },
        },
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        const { simulateError, simulateSlow } = request.body as StateType;
        const state = State.getInstance();
        state.simulateError = simulateError;
        state.simulateSlow = simulateSlow;

        reply.status(204).send();
    });
}
