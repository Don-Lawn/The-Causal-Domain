import { SemanticObject } from "../../pv-object.js";

export class RR2DShip extends SemanticObject {
    constructor(id) {
        super(id);
        this.id = id;
        this.type = "RR2DShip";

        this.v = 0; // 0..1, velocity axis
        this.q = 0; // physics depth axis (Q == Z), positive values move into screen
        this.theta = 0; // angle to the x axis
        this.acceleration = 0.12; // units of c per second
        this.trailCycle = 0;

        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.color = 0xe8f3ff;
        this.visible = true;
    }

    update(dt) {
        const seconds = (dt || 0) / 1000;

        this.v += this.acceleration * seconds;
        if (this.v > 1) {
            this.v = 0;
            this.q = 0;
            this.theta = 0;
            this.x = 0;
            this.y = 0;
            this.z = this.q;
            this.trailCycle += 1;
            return;
        }

        const clampedV = Math.max(0, Math.min(1, this.v));
        this.theta = Math.asin(clampedV);
        // Physics convention: deeper into screen means larger positive Q.
        this.q = 1 - Math.cos(this.theta);

        // Shared spatial state for generic tooling. Domain-specific renderers map these differently.
        this.x = this.v;
        this.y = 0;
        this.z = this.q;
    }

    getRenderHints() {
        return Object.freeze({
            id: this.id,
            type: this.type,
            v: this.v,
            q: this.q,
            theta: this.theta,
            x: this.x,
            y: this.y,
            z: this.z,
            trailCycle: this.trailCycle,
            color: this.color,
            visible: this.visible
        });
    }
}
