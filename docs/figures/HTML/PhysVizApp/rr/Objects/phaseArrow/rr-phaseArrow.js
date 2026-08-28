// rr-phaseArrow.js
import { PhaseIndicator } from "./rr-phaseIndicator.js";
import { PVFSM } from "../../../pv-fsm.js";
import { PhaseArrowFSM } from "./phaseArrow-fsm.js";
import EventBusInstance from "../../../pv-eventBus.js";

export class PhaseArrow extends PhaseIndicator {
    constructor(id) {
        super(id, "PhaseArrow", {
            visible: true,
            color: 0xff0000,
            trailEnabled: false,
            trailFadeEnabled: false,
            fadeRate: 0.02,
            trailUseSourceOpacity: false,
        });

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
        this.zDriftVelocity = this.c;

        // Trail lifecycle
        this.trailFadeEnabled = false; // disable decay for persistent phase-disk tracing
        this.stage1Turns = 1;
        this.stage2Turns = 1;
        this.trailingRevolutions = 2;
        this.trailStartPhase = this.stage1Turns * 2 * Math.PI;
        this.stage3StartPhase = (this.stage1Turns + this.stage2Turns) * 2 * Math.PI;
        this.pausePhase = this.stage3StartPhase + (this.trailingRevolutions * 2 * Math.PI);

        this.fsm = new PVFSM(`${this.id}-phaseArrow`, "MASTER");
        this._configureFSM();
        this.fsm.transition(this.fsm.definition?.initialStage || this.fsm.definition?.initialState || "STAGE1");
    }

    attachToDomain(domain) {
        super.attachToDomain(domain);
        this.trailFadeEnabled = this.domainName === "XYZ";
        this.fsm.logicalBus = domain.name;

        if (domain?.name === "ABZ") {
            this.pausePhase = this.stage3StartPhase + (this.trailingRevolutions * 2 * Math.PI);
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
            startCameraLift: () => {
                if (this.domainName) {
                    EventBusInstance.emit("CAMERA_LIFT", {}, this.domainName, this.id);
                }
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
            this._resetForLoop();
            return;
        }

        if (this.fsm.state !== "STAGE3" || this.domainName !== "ABC") {
            this.phase += this.phaseVelocity * seconds;

            this.z += this.zDriftVelocity * seconds;

            if (this.domainName === "XYZ") {
                this.x = 0;
                this.y = 0;
            } else {
                this.y = this.baseY + this.amplitude * Math.sin(this.phase);
            }
        }

        const payload = this.getSemanticHints();
        this.fsm._receive("TICK", payload);
    }

    _resetForLoop() {
        this.phase = 0;
        this.phaseVelocity = 1;
        this.x = 0;
        this.y = this.domainName === "XYZ" ? 0 : this.baseY;
        this.z = 0;
        this.trailEnabled = false;
        this.trailFrames = 0;
        this.trailCycle += 1;
        if (this.domainName) {
            EventBusInstance.emit("CAMERA_RESET", {}, this.domainName, this.id);
        }
        this.fsm.transition(this.fsm.definition?.initialStage || this.fsm.definition?.initialState || "STAGE1");
    }

    resetPhase() {
        this.phase = 0;
    }

    // Projection hints (Domain → Renderer)
    getSemanticHints() {
        return Object.freeze({
            id: this.id,
            type: this.type,
            phase: this.phase,
            stage: this.fsm.state,
            x: this.x,
            y: this.y,
            z: this.z,
            trailCycle: this.trailCycle,
            color: this.color,
            visible: this.visible
        });
    }
}
