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
        this.zDriftVelocity = this.c;

        // Appearance meaning
        this.color = 0xff0000;
        this.visible = true;

        // Trail lifecycle
        this.trailEnabled = false;
        this.trailFadeEnabled = false; // disable decay for persistent phase-disk tracing
        this.fadeRate = 0.02;
        this.stage1Turns = 1;
        this.stage2Turns = 1;
        this.trailingRevolutions = 2;
        this.trailStartPhase = this.stage1Turns * 2 * Math.PI;
        this.stage3StartPhase = (this.stage1Turns + this.stage2Turns) * 2 * Math.PI;
        this.pausePhase = this.stage3StartPhase + (this.trailingRevolutions * 2 * Math.PI);
        this.cameraLiftStartPhase = this.stage3StartPhase;
        this.cameraLiftEndPhase = this.pausePhase;
        this.cameraLiftTarget = Math.PI / 4;
        this.cameraRadius = 10;
        this.cameraZFollowFactor = 0.5;
        this.trailFrames = 0;
        this.cameraDelta = {
            positionDelta: { x: 0, y: 0, z: 0 },
            targetZDelta: 0,
            active: false
        };
        this.trailCycle = 0;
        this.cameraResetRequested = false;

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
        const previousPhase = this.phase;
        const previousZ = this.z;

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

        this.cameraDelta = this._computeCameraDelta(previousPhase, previousZ);

        const payload = this.getRenderHints();
        this.fsm._receive("TICK", payload);
    }

    _computeCameraDelta(previousPhase, previousZ) {
        if (this.domainName !== "ABZ" && this.domainName !== "XYZ") {
            return {
                positionDelta: { x: 0, y: 0, z: 0 },
                targetZDelta: 0,
                active: false
            };
        }

        const span = Math.max(this.cameraLiftEndPhase - this.cameraLiftStartPhase, 0.0001);
        const clamp01 = (value) => Math.max(0, Math.min(1, value));

        const previousRatio = clamp01((previousPhase - this.cameraLiftStartPhase) / span);
        const currentRatio = clamp01((this.phase - this.cameraLiftStartPhase) / span);

        const previousTilt = previousRatio * this.cameraLiftTarget;
        const currentTilt = currentRatio * this.cameraLiftTarget;

        const previousOffset = {
            x: Math.sin(previousTilt) * this.cameraRadius,
            y: Math.sin(previousTilt) * this.cameraRadius * 0.35,
            z: Math.cos(previousTilt) * this.cameraRadius
        };

        const currentOffset = {
            x: Math.sin(currentTilt) * this.cameraRadius,
            y: Math.sin(currentTilt) * this.cameraRadius * 0.35,
            z: Math.cos(currentTilt) * this.cameraRadius
        };

        const positionDelta = {
            x: currentOffset.x - previousOffset.x,
            y: currentOffset.y - previousOffset.y,
            z: currentOffset.z - previousOffset.z
        };

        const targetZDelta = (this.z - previousZ) * this.cameraZFollowFactor;
        const hasMotion =
            Math.abs(positionDelta.x) > 0 ||
            Math.abs(positionDelta.y) > 0 ||
            Math.abs(positionDelta.z) > 0 ||
            Math.abs(targetZDelta) > 0;

        return {
            positionDelta,
            targetZDelta,
            active: hasMotion
        };
    }

    // Semantic API
    setColor(hex) {
        this.color = hex;
    }

    _resetForLoop() {
        this.phase = 0;
        this.phaseVelocity = 1;
        this.x = 0;
        this.y = this.domainName === "XYZ" ? 0 : this.baseY;
        this.z = 0;
        this.trailEnabled = false;
        this.trailFrames = 0;
        this.cameraDelta = {
            positionDelta: { x: 0, y: 0, z: 0 },
            targetZDelta: 0,
            active: false
        };
        this.trailCycle += 1;
        this.cameraResetRequested = this.domainName === "XYZ" || this.domainName === "ABZ";
        this.fsm.transition(this.fsm.definition?.initialStage || this.fsm.definition?.initialState || "STAGE1");
    }

    consumeCameraResetRequest() {
        const requested = this.cameraResetRequested;
        this.cameraResetRequested = false;
        return requested;
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
            stage: this.fsm.state,
            x: this.x,
            y: this.y,
            z: this.z,
            trailCycle: this.trailCycle,
            cameraDelta: this.cameraDelta,
            color: this.color,
            visible: this.visible
        });
    }
}
