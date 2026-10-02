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

    onAttach(host) {

        // Safety: require bus
        // Safety: require bus
        if (!host.bus) {
            throw new Error(
                `UpdateExtension requires object '${host.id}' to have a bus.`
            );
        }

        const bus = host.bus;
        // -------------------------------------------------------------------
        // Glue: object.update(dt)
        // -------------------------------------------------------------------
        // If the object already has an update() method, we respect it.
        // If not, we install a no-op default.
        if (typeof host.update !== "function") {
            host.update = function(dt) {
                // Default no-op update
            };
        }

        // -------------------------------------------------------------------
        // UPDATE event → object.update(dt)
        // -------------------------------------------------------------------
        EventBusInstance.on(bus, "UPDATE", (payload, evt) => {
            const dt = payload?.dt ?? 0;
            host.update(dt);
        });
    }

    onDetach(host) {
        // We do NOT delete host.update because it may be user-defined.
        // If you want stricter cleanup, you can wrap the method and remove only the wrapper.
    }
}
