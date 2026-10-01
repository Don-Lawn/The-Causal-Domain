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

        if (!host.bus)
        {
            throw new Error(
                `AnimatorExtension requires host '${host.id}' to have a bus.`
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
            (payload, evt, busName) => this.onLoad(payload, evt, busName)
        );

        EventBusInstance.on(
            host.bus,
            "START",
            (payload, evt, busName)  => this.onStart(payload, evt, busName) 
        );

        EventBusInstance.on(
            host.bus,
            "STOP",
            (payload, evt, busName) => this.onStop(payload, evt, busName)
        );

        EventBusInstance.on(
            host.bus,
            "PAUSE",
            (payload, evt, busName) => this.onPause(payload, evt, busName)
        );

        EventBusInstance.on(
            host.bus,
            "RESUME",
            (payload, evt, busName) => this.onResume(payload, evt, busName)
        );

        EventBusInstance.on(
            host.bus,
            "STEP_FRAME",
            (payload, evt, busName) => this.onStepFrame(payload, evt, busName)
        );
    }

    onLoad()
    {
        this.previousFrameTime =
            performance.now();
    }

    onStart((payload, evt, busName) )
    {
        if (this.isAnimating)
        {
            return;
        }

        this.isAnimating = true;
        this.isPaused = false;

        this.startAnimationLoop();
    }

    onStop((payload, evt, busName) )
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

    onPause((payload, evt, busName) )
    {
        this.isPaused = true;
    }

    onResume((payload, evt, busName) )
    {
        this.isPaused = false;

        this.previousFrameTime =
            performance.now();
    }

    onStepFrame((payload, evt, busName) )
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
            this.host.hints.animator;

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
            this.host.bus,
            "UPDATE",
            framePayload
        );

        EventBusInstance.emit(
            this.host.bus,
            "RENDER",
            framePayload
        );
    };

    onDetach(host)
    {
        this.onStop();
    };
}