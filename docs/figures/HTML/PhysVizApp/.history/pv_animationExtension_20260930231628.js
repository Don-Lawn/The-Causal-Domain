// ---------------------------------------------------------------------------
// pv-animatorExtension.js
// Produces UPDATE and RENDER events using requestAnimationFrame()
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
            "START",
            () => this.startAnimating()
        );

        EventBusInstance.on(
            host.bus,
            "STOP",
            () => this.stopAnimating()
        );
    }

    startAnimating()
    {
        if (this.isAnimating)
        {
            return;
        }

        this.isAnimating = true;

        this.previousFrameTime = performance.now();

        const frame = (currentFrameTime) =>
        {
            if (!this.isAnimating)
            {
                return;
            }

            const deltaTimeSeconds =
                (currentFrameTime - this.previousFrameTime)
                / 1000.0;

            this.previousFrameTime = currentFrameTime;

            EventBusInstance.emit(
                this.host.bus,
                "UPDATE",
                {
                    deltaTimeSeconds
                }
            );

            EventBusInstance.emit(
                this.host.bus,
                "RENDER",
                {
                    deltaTimeSeconds
                }
            );

            this.animationFrameId =
                requestAnimationFrame(frame);
        };

        this.animationFrameId =
            requestAnimationFrame(frame);
    }

    stopAnimating()
    {
        this.isAnimating = false;

        if (this.animationFrameId)
        {
            cancelAnimationFrame(
                this.animationFrameId
            );

            this.animationFrameId = null;
        }
    }

    onDetach(host)
    {
        this.stopAnimating();
    }
}
