// ---------------------------------------------------------------------------
// pv-phaseWedgeExtension.js
// RR domain-specific behaviour for PhaseWedge objects
// ---------------------------------------------------------------------------

import { BaseExtension } from "../../../pv-baseExtension.js";

export class PhaseWedgeExtension extends BaseExtension {
    constructor({
        angle = 0,
        magnitude = 1,
        domain = "RR",
        color = 0xff0000
    } = {}) {
        super("phaseWedge");

        // Domain state
        this.angle = angle;
        this.magnitude = magnitude;
        this.domain = domain;
        this.color = color;
    }

    onAttach(wedgeObject) {

        // -------------------------------------------------------------------
        // Add domain hints (merged automatically downstream)
        // -------------------------------------------------------------------
        wedgeObject.setHint("phaseWedge.angle", this.angle);
        wedgeObject.setHint("phaseWedge.magnitude", this.magnitude);
        wedgeObject.setHint("phaseWedge.domain", this.domain);
        wedgeObject.setHint("phaseWedge.color", this.color);

        // -------------------------------------------------------------------
        // Glue: domain setters (update both local + hint state)
        // -------------------------------------------------------------------
        wedgeObject.setAngle = (a) => {
            this.angle = a;
            wedgeObject.hints.phaseWedge.angle = a;
        };

        wedgeObject.setMagnitude = (m) => {
            this.magnitude = m;
            wedgeObject.hints.phaseWedge.magnitude = m;
        };

        wedgeObject.setDomain = (d) => {
            this.domain = d;
            wedgeObject.hints.phaseWedge.domain = d;
        };

        wedgeObject.setColor = (c) => {
            this.color = c;
            wedgeObject.hints.phaseWedge.color = c;
        };

        // -------------------------------------------------------------------
        // Domain behaviour: phase evolution
        // -------------------------------------------------------------------
        wedgeObject.updatePhase = (dt) => {
            // Example RR behaviour: angle evolves with magnitude
            this.angle += this.magnitude * dt * 0.001;

            // Update hint bag (merged automatically on emit)
            wedgeObject.hints.phaseWedge.angle = this.angle;
        };

        // -------------------------------------------------------------------
        // Hook into update(dt) if present
        // -------------------------------------------------------------------
        if (typeof wedgeObject.update === "function") {
            const originalUpdate = wedgeObject.update;

            wedgeObject.update = (dt) => {
                originalUpdate(dt);
                wedgeObject.updatePhase(dt);
            };
        }
    }

    onDetach(wedgeObject) {
        delete wedgeObject.setAngle;
        delete wedgeObject.setMagnitude;
        delete wedgeObject.setDomain;
        delete wedgeObject.setColor;
        delete wedgeObject.updatePhase;

        delete wedgeObject.hints.phaseWedge;
    }
}
