// ---------------------------------------------------------------------------
// pv-renderExtension.js
// Provides render(dt) behaviour + RENDER event → object.render(dt)
// ---------------------------------------------------------------------------

import { BaseExtension } from "./pv-baseExtension.js";
import EventBusInstance from "./pv-eventBus.js";

export class RenderExtension extends BaseExtension {
    constructor() {
        super("render");
    }

    onAttach(object) {

        // Safety: require bus
        if (!object.bus) {
            throw new Error(
                `RenderExtension requires object '${object.id}' to have a bus.`
            );
        }

        const bus = object.bus;

        // -------------------------------------------------------------------
        // Glue: object.render(dt)
        // -------------------------------------------------------------------
        // If the object already has a render() method, we respect it.
        // If not, we install a no-op default.
        if (typeof object.render !== "function") {
            object.render = function(dt) {
                // Default no-op render
            };
        }

        // -------------------------------------------------------------------
        // RENDER event → object.render(dt)
        // -------------------------------------------------------------------
        EventBusInstance.on(bus, "RENDER", (payload, evt) => {
            const dt = payload?.dt ?? 0;
            object.render(dt);
        });
    }

    onDetach(object) {
        // We do NOT delete object.render because it may be user-defined.
        // If you want stricter cleanup, you can wrap the method and remove only the wrapper.

        // Nothing else to clean up — eventBusInstance.on() has no unsubscribe yet.
    }
}
