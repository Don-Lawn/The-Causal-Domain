// ---------------------------------------------------------------------------
// pv-updateExtension.js
// Provides update(dt) behaviour + TICK event → object.update(dt)
// ---------------------------------------------------------------------------

import { BaseExtension } from "./pv-baseExtension.js";
import EventBusInstance from "./pv-eventBus.js";

export class UpdateExtension extends BaseExtension {
    constructor() {
        super("update");
    }

    onAttach(object) {

        // Safety: require bus
        if (!object.bus) {
            throw new Error(
                `UpdateExtension requires object '${object.id}' to have a bus.`
            );
        }

        const bus = object.bus;

        // -------------------------------------------------------------------
        // Glue: object.update(dt)
        // -------------------------------------------------------------------
        // If the object already has an update() method, we respect it.
        // If not, we install a no-op default.
        if (typeof object.update !== "function") {
            object.update = function(dt) {
                // Default no-op update
            };
        }

        // -------------------------------------------------------------------
        // TICK event → object.update(dt)
        // -------------------------------------------------------------------
        EventBusInstance.on(bus, "TICK", (payload, evt) => {
            const dt = payload?.dt ?? 0;
            object.update(dt);
        });
    }

    onDetach(object) {
        // We do NOT delete object.update because it may be user-defined.
        // If you want stricter cleanup, you can wrap the method and remove only the wrapper.
    }
}
