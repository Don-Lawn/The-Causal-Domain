// ---------------------------------------------------------------------------
// pv-animatorExtension.js
// Produces UPDATE and RENDER events.
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
            "STOP",
            () => this.stopAnimating()
        );

        EventBusInstance.on(
            host.bus,
            "STEP_FRAME",
            () => this.stepFrame()
        );
    }

    onLoad()
    {
        this.previousFrameTime =