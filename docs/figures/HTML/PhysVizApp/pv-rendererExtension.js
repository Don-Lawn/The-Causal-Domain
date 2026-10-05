// ---------------------------------------------------------------------------
// pv-renderExtension.js
// Provides render(dt) behaviour + RENDER event → host.render(dt)
// ---------------------------------------------------------------------------

import { BaseExtension } from "./pv-baseExtension.js";
import EventBusInstance from "./pv-eventBus.js";

export class RendererExtension extends BaseExtension {
    constructor() {
        super("renderer");
    }

    onAttach(host) {

        // Safety: require bus
        if (!host.busName) {
            throw new Error(
                `RenderExtension requires host '${host.busName}' to have a bus.`
            );
        }

        const busName = host.busName;

        // -------------------------------------------------------------------
        // Glue: host.render(dt)
        // -------------------------------------------------------------------
        // If the host already has a render() method, we respect it.
        // If not, we install a no-op default.
        if (typeof host.render !== "function") {
            host.render = function(dt) {
                // Default no-op render
            };
        }

        // -------------------------------------------------------------------
        // RENDER event → host.render(dt)
        // -------------------------------------------------------------------
        EventBusInstance.on(busName, "RENDER", (payload, evt) => {
            const dt = payload?.dt ?? 0;
            host.render(dt);
        });
    }

    onDetach(host) {
        // We do NOT delete host.render because it may be user-defined.
        // If you want stricter cleanup, you can wrap the method and remove only the wrapper.

        // Nothing else to clean up — eventBusInstance.on() has no unsubscribe yet.
    }
}
