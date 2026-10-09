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
            host.busName,
            "LOAD",
            ( evt) => this.onLoad(evt)
        );

        EventBusInstance.on(
            host.busName,
            "START",
            (evt)  => this.onStart(evt) 
        );

        EventBusInstance.on(
            host.busName,
            "STOP",
            (evt) => this.onStop(evt)
        );

        EventBusInstance.on(
            host.busName,
            "PAUSE",
            (evt) => this.onPause(evt)
        );

        EventBusInstance.on(
            host.busName,
            "RESUME",
            (evt) => this.onResume(evt)
        );

        EventBusInstance.on(
            host.busName,
            "STEP_FRAME",
            (evt) => this.onStepFrame(evt)
        );
    }

    onLoad()
    {
        this.previousFrameTime =
            performance.now();
    }

    onStart(evt )
    {
        if (this.isAnimating)
        {
            return;
        }

        this.isAnimating = true;
        this.isPaused = false;

        this.startAnimationLoop();
    }

    onStop(evt)
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

    onPause(evt)
    {
        this.isPaused = true;
    }

    onResume(evt)
    {
        this.isPaused = false;

        this.previousFrameTime =
            performance.now();
    }

    onStepFrame(evt )
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
        const fixedStepSeconds =
            this.host.getHint(
                "animator.fixedStepSeconds",
                1 / 60
            );

        const tempo =
            this.host.getHint(
                "animator.tempo",
                1.0
            );

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
            this.host.busName,
            "animator"
        );

        EventBusInstance.emit(
            "RENDER",
            framePayload,
            this.host.busName,
            "animator"
        );
    };

    onDetach(host)
    {
        this.onStop(null, null);
    };
}