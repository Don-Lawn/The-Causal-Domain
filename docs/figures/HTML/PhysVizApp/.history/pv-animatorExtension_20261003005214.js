// ---------------------------------------------------------------------------
// pv-animatorExtension.js
// ---------------------------------------------------------------------------

import { BaseExtension } from "./pv-baseExtension.js";
import EventBusInstance from "./pv-eventBus.js";

export class AnimatorExtension extends BaseExtension
{
    constructor()
    {
        super("animator");

        this.host = null;

        this.animationFrameId = null;
        this.previousFrameTime = 0;

        this.isAnimating = false;
        this.isPaused = false;
    }

    onAttach(host)
    {
        this.host = host;

        if (!host.busName)
        {
            throw new Error(
                `AnimatorExtension requires host '${host.busName}' to have a bus.`
            );
        }

        if (!host.hints.animator)
        {
            host.hints.animator =
            {
                fixedStepSeconds : 1.0 / 60.0,
                tempo : 1.0
            };
        }

        EventBusInstance.on(
            host.bus,
            "LOAD",
            ( evt, busName) => this.onLoad(evt, busName)
        );

        EventBusInstance.on(
            host.bus,
            "START",
            (evt, busName)  => this.onStart(evt, busName) 
        );

        EventBusInstance.on(
            host.bus,
            "STOP",
            (evt, busName) => this.onStop(evt, busName)
        );

        EventBusInstance.on(
            host.bus,
            "PAUSE",
            (evt, busName) => this.onPause(evt, busName)
        );

        EventBusInstance.on(
            host.bus,
            "RESUME",
            (evt, busName) => this.onResume(evt, busName)
        );

        EventBusInstance.on(
            host.bus,
            "STEP_FRAME",
            (evt, busName) => this.onStepFrame(evt, busName)
        );
    }

    onLoad()
    {
        this.previousFrameTime =
            performance.now();
    }

    onStart(evt, busName )
    {
        if (this.isAnimating)
        {
            return;
        }

        this.isAnimating = true;
        this.isPaused = false;

        this.startAnimationLoop();
    }

    onStop(evt, busName)
    {
        this.isAnimating = false;
        this.isPaused = false;

        if (this.animationFrameId)
        {
            cancelAnimationFrame(
                this.animationFrameId
            );

            this.animationFrameId = null;
        }
    }

    onPause(evt, busName)
    {
        this.isPaused = true;
    }

    onResume(evt, busName)
    {
        this.isPaused = false;

        this.previousFrameTime =
            performance.now();
    }

    onStepFrame(evt, busName )
    {
        if (!this.isPaused)
        {
            return;
        }

        this.processOneFrame();
    }

    startAnimationLoop()
    {
        this.previousFrameTime =
            performance.now();

        const frameCallback = (currentFrameTime) =>
        {
            if (!this.isAnimating)
            {
                return;
            }

            const actualDeltaTimeSeconds =
                (currentFrameTime
                    - this.previousFrameTime)
                / 1000.0;

            this.previousFrameTime =
                currentFrameTime;

            if (!this.isPaused)
            {
                this.processOneFrame(
                    actualDeltaTimeSeconds
                );
            }

            this.animationFrameId =
                requestAnimationFrame(
                    frameCallback
                );
        };

        this.animationFrameId =
            requestAnimationFrame(
                frameCallback
            );
    }

    processOneFrame(
        actualDeltaTimeSeconds = null
    )
    {
        const animatorHints =
            this.host.hints?.animator;

        const fixedStepSeconds =
            animatorHints.fixedStepSeconds;

        const tempo =
            animatorHints.tempo;

        const baseDeltaTimeSeconds =
            actualDeltaTimeSeconds
            ?? fixedStepSeconds;

        const simulationDeltaTimeSeconds =
            baseDeltaTimeSeconds * tempo;

        const framePayload =
        {
            deltaTimeSeconds :
                simulationDeltaTimeSeconds,

            fixedStepSeconds,

            tempo
        };

        EventBusInstance.emit(
            "UPDATE",
            framePayload,
            this.host.bus,
            "animator"
        );

        EventBusInstance.emit(
            "RENDER",
            framePayload,
            this.host.bus,
            "animator"
        );
    };

    onDetach(host)
    {
        this.onStop(null, null);
    };
}