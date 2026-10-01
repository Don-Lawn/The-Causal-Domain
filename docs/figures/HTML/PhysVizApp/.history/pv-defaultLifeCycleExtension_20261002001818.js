// ---------------------------------------------------------------------------
// pv-lifecycleExtension.js
// ---------------------------------------------------------------------------

import { BaseExtension } from "./pv-baseExtension.js";

export class DefaultLifecycleExtension extends BaseExtension
{
    constructor()
    {
        super("defaultlifecycle");

        this.host = null;
    }

    onAttach(host)
    {
        this.host = host;

        if (!host.fsm)
        {
            throw new Error(
                `default LifecycleExtension requires FSMExtension on '${host.id}'.`
            );
        }

        this.configureDefaultLifecycle();
    }

    configureDefaultLifecycle()
    {
        this.host.fsm.on(
            "UNINITIALISED",
            "LOAD",
            () =>
            {
                this.host.fsm.transition(
                    "READY"
                );
            }
        );

        this.host.fsm.on(
            "READY",
            "START",
            () =>
            {
                this.host.fsm.transition(
                    "ACTIVE"
                );
            }
        );

        this.host.fsm.on(
            "ACTIVE",
            "PAUSE",
            () =>
            {
                this.host.fsm.transition(
                    "PAUSED"
                );
            }
        );

        this.host.fsm.on(
            "PAUSED",
            "RESUME",
            () =>
            {
                this.host.fsm.transition(
                    "ACTIVE"
                );
            }
        );

        this.host.fsm.on(
            "*",
            "STOP",
            () =>
            {
                this.host.fsm.transition(
                    "STOPPED"
                );
            }
        );
    }
}