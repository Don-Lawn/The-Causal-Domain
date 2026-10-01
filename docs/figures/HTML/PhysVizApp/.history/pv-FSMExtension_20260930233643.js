// pv-animatorExtension.js

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
    }

    onAttach(host)
    {
        this.host = host;

        host.hints.animator =
        {
            state : "Stopped",

            fixedStepSeconds : 1.0 / 60.0,

            tempo : 1.0
        };

        EventBusInstance.on(
            host.bus,
            "LOAD",
            () => this.onLoad()
        );

        EventBusInstance.on(
            host.bus,
            "START",
            () => this.onStart()
        );

        EventBusInstance.on(
            host.bus,
            "STOP",
            () => this.onStop()
        );

        EventBusInstance.on(
            host.bus,
            "PAUSE",
            () => this.onPause()
        );

        EventBusInstance.on(
            host.bus,
            "RESUME",
            () => this.onResume()
        );

        EventBusInstance.on(
            host.bus,
            "STEP_FRAME",
            () => this.onStepFrame()
        );
    }

    onLoad()
    {
        this.previousFrameTime =
            performance.now();
    }

    onStart()
    {
        const animatorHints =
            this.host.hints.animator;

        if (animatorHints.state !== "Stopped")
        {
            return;
        }

        animatorHints.state = "Running";

        this.startAnimationLoop();
    }

    onStop()
    {
        this.host.hints.animator.state =
            "Stopped";

        if (this.animationFrameId)
        {
            cancelAnimationFrame(
                this.animationFrameId
            );

            this.animationFrameId = null;
        }
    }

    onPause()
    {
        if (this.host.hints.animator.state === "Running")
        {
            this.host.hints.animator.state =
                "Paused";
        }
    }

    onResume()
    {
        if (this.host.hints.animator.state === "Paused")
        {
            this.host.hints.animator.state =
                "Running";

            this.previousFrameTime =
                performance.now();
        }
    }

    onStepFrame()
    {
        if (this.host.hints.animator.state !== "Paused")
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
            if (
                this.host.hints.animator.state
                === "Stopped"
            )
            {
                return;
            }

            const actualDeltaTimeSeconds =
                (currentFrameTime
                    - this.previousFrameTime)
                / 1000.0;

            this.previousFrameTime =
                currentFrameTime;

            if (
                this.host.hints.animator.state
                === "Running"
            )
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
    }

    onDetach(host)
    {
        this.onStop();
    }
}