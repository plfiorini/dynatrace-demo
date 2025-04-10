import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { State, StateType } from "../state";

export default async function stateRoutes(fastify: FastifyInstance) {
    fastify.post("/state", {
        schema: {
            body: {
                type: "object",
                properties: {
                    simulateError: { type: "number", minimum: 0, maximum: 100 },
                    simulateSlow: { type: "number", minimum: 0, maximum: 100 },
                },
                required: ["simulateError", "simulateSlow"],
            },
        },
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        const { simulateError, simulateSlow } = request.body as StateType;
        const state = State.getInstance();
        state.simulateError = simulateError;
        state.simulateSlow = simulateSlow;

        return {
            message: "State updated successfully",
            simulateError,
            simulateSlow,
        };
    });
}
