export type StateType = {
    simulateError: boolean;
    simulateSlow: boolean;
};

export class State {
    private static instance: State;

    public simulateError: boolean = false;
    public simulateSlow: boolean = false;

    private constructor() {}

    static getInstance(): State {
        if (!State.instance) {
            State.instance = new State();
        }
        return State.instance;
    }
}
