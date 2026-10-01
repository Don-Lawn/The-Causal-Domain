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

        this.isAnimating = false;
        this.isPaused = false;

        this.previousFrameTime = 0;
        this.animationFrameId = null;
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

        EventBusInstance.on(
            host.bus,
            "LOAD",
            () => this.onLoad()
        );

        EventBusInstance.on(
            host.bus,
            "START",
            () => this.startAnimating()
        );

        EventBusInstance.on(
            host.bus,
            "STOP",
            () => this.stopAnimating()
        );

        EventBusInstance.on(
            host.bus,
            "PAUSE",
            () => this.pauseAnimating()
        );

        EventBusInstance.on(
            host.bus,
            "RESUME",
            () => this.resumeAnimating()
        );

        EventBusInstance.on(
            host.bus,
            "STEP_FRAME",
            () => this.stepFrame()
        );
    }

    onLoad()
    {
        if (!this.host.hints.animator)
        {
            this.host.hints.animator =
            {
                fixedStepSeconds : 1.0 / 60.0,
                tempo : 1.0
            };
        }

        this.previousFrameTime =
            performance.now();
    }

    startAnimating()
    {
        if (this.isAnimating)
        {
            return;
        }

        this.isAnimating = true;
        this.isPaused = false;

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

    stopAnimating()
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

    pauseAnimating()
    {
        this.isPaused = true;
    }

    resumeAnimating()
    {
        this.isPaused = false;

        this.previousFrameTime =stepFrame()
{
    if (!this.isPaused)
    {
        return;
    }

    this.processOneFrame();
}

processOneFrame(
    actualDeltaTimeSeconds = null
)
{
    const fixedStepSeconds =
        this.host.hints.animator.fixedStepSeconds;

    const tempo =
        this.host.hints.animator.tempo;

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
}

onDetach(host)
{
    this.stopAnimating();
}
            performance.now();
    }

    stepFrame()
    {
        if (!this.isPaused)
        {
            return;
        }

        this.