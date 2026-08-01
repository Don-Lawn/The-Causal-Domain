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
        this.fadeRate = 0.02;
        this.trailStartPhase = 2 * Math.PI;
        this.pausePhase = 4 * Math.PI;
        this.trailingRevolutions = 10;
        this.trailFrames = 0;

        // Renderer handle (renderer manages this)
        this._pvHandle = null;
        this.domainName = null;

        this.fsm = new PVFSM(`${this.id}-phaseArrow`, "MASTER");
        this._configureFSM();
        this.fsm.transition(this.fsm.definition?.initialStage || this.fsm.definition?.initialState || "STAGE1");
    }

    attachToDomain(domain) {
        super.attachToDomain(domain);
        this.domainName = domain?.name || null;
        this.trailFadeEnabled = this.domainName === "XYZ";
        this.fsm.logicalBus = domain.name;

        if (domain?.name === "ABZ") {
            this.pausePhase = this.trailStartPhase + (this.trailingRevolutions * 2 * Math.PI);
            const stage3Trigger = this.fsm.definition?.triggers?.find((t) => t.state === "STAGE3");
            if (stage3Trigger) {
                stage3Trigger.value = this.pausePhase;
            }
        }
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
                if (this.domainName === "ABC") {
                    this.phaseVelocity = 0;
                }
            }
        }, {
            canAdvance: (context) => this.phase >= this.trailStartPhase && this.phase < this.pausePhase,
            canPause: (context) => this.phase >= this.pausePhase
        });
    }

    update(dt) {
        const seconds = (dt || 0) / 1000;

        if (this.fsm.state === "PAUSED") {
            return;
        }

        if (this.fsm.state !== "STAGE3" || this.domainName !== "ABC") {
            this.phase += this.phaseVelocity * seconds;

            if (this.domainName === "XYZ") {
                this.x = 0;
                this.y = 0;
                this.z += this.c * seconds;
            } else {
                this.y = this.baseY + this.amplitude * Math.sin(this.phase);
                this.z += this.c * seconds;
            }
        }

        const payload = this.getRenderHints();
        this.fsm._receive("TICK", payload);
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
            x: this.x,
            y: this.y,
            z: this.z,
            color: this.color,
            visible: this.visible
        });
    }
}
