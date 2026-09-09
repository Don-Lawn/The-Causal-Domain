// pv-dynamics.js

import { PVStateVector } from "./pv-stateVector.js";

export class PVDynamics {

    // Transition from A → B over time T with dt
    static transition(A, B, pid, dt, totalTime) {
        const steps = Math.floor(totalTime / dt);
        const path = [];

        let current = A.clone();

        for (let i = 0; i < steps; i++) {
            const delta = PVStateVector.delta(B, current);
            const correction = pid.update(delta, dt);
            current.add(correction);
            path.push(current.clone());
        }

        return path;
    }

    // Convert path to string (debug / logging)
    static pathToString(path) {
        return path.map((sv, i) => `Step ${i}: ${JSON.stringify(sv.data)}`).join("\n");
    }
}
