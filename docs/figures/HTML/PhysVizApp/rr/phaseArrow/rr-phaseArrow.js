// rr-phaseArrow.js
import { SemanticObject } from "../../pv-object.js";
import { PVFSM } from "../../pv-fsm.js";
import { PhaseArrowFSM } from "./phaseArrow-fsm.js";

export class PhaseArrow extends SemanticObject {
    constructor(id) {
        super(id);
        this.id = id;
        this.type = "PhaseArrow";

        // Core semantic state
        this.phase = 0;          // radians
        this.phaseVelocity = 1;  // radians per second

        this.x = 0;
        this.baseY = 0;
        this.y = 0;
        this.z = 0;

        // Vertical oscillation amplitude
        this.amplitude = 1.0;

        // Steady linear drift for the ABZ helix view
        this.c = 0.5;

        // Appearance meaning
        this.color = 0xff0000;
        this.visible = true;

        // Trail lifecycle
        this.trailEnabled = false;
        this.trailFadeEnabled = false; // disable decay for persistent phase-disk tracing
        this.fadeRate = 0.05;
        this.maxCycles = 3;
        this.pauseAfterCycles = 4;
        this.trailFrames = 0;

        // Renderer handle (renderer manages this)
        this._pvHandle = null;

        this.fsm = new PVFSM(`${this.id}-phaseArrow`, "MASTER");
        this._configureFSM();
        this.fsm.transition(this.fsm.definition?.initialState || "SPINNING");
    }

    attachToDomain(domain) {
        super.attachToDomain(domain);
        this.fsm.logicalBus = domain.name;
    }

    _configureFSM() {
        this.fsm.configureFromDefinition(PhaseArrowFSM, {
            beginSpin: () => {
                this.phaseVelocity = 1;
                this.trailEnabled = false;
                this.trailFrames = 0;
            },
            activateTrail: () => {
                this.trailEnabled = true;
                this.trailFrames = 0;
            },
            freezeMotion: () => {
                this.phaseVelocity = 0;
                this.trailEnabled = true;
            }
        }, {
            canAdvance: () => this.phase >= this.maxCycles * (2 * Math.PI),
            canPause: () => this.phase >= this.pauseAfterCycles * (2 * Math.PI)
        });
    }

    update(dt) {
        const seconds = (dt || 0) / 1000;

        if (this.fsm.state === "PAUSED") {
            return;
        }

        this.phase += this.phaseVelocity * seconds;
        this.y = this.baseY + this.amplitude * Math.sin(this.phase);
        this.z += this.c * seconds;

        this.fsm._receive("TICK");
    }

    // Semantic API
    setColor(hex) {
        this.color = hex;
    }

    resetPhase() {
        this.phase = 0;
    }

    // Projection hints (Domain → Renderer)
    getRenderHints() {
        return Object.freeze({
            id: this.id,
            type: this.type,
            phase: this.phase,
            radians: this.phase,
            x: this.x,
            y: this.y,
            z: this.z,
            color: this.color,
            visible: this.visible
        });
    }
}
