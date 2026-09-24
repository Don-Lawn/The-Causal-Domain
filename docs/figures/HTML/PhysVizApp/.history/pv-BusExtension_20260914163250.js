// ---------------------------------------------------------------------------
// BusExtension.js
// Gives any BaseObject its own event bus + optional parent bus
// ---------------------------------------------------------------------------

import { BaseExtension } from "./BaseExtension.js";
import EventBusInstance from "./pv-eventBus.js";

export class BusExtension extends BaseExtension {
    constructor(localBusName, parentBusName = null) {
        super("bus");

        this.localBusName = localBusName;
        this.parentBusName = parentBusName;
    }

    onAttach(object) {
        // Bind bus name to object
        object.bus = this.localBusName;

        // Create the bus hierarchy
        EventBusInstance.createBus(this.localBusName, this.parentBusName);

        // Glue: allow object to emit events
        object.emit = (eventName, payload = {}) => {
            EventBusInstance.emit(
                eventName,
                payload,
                this.localBusName,
                this.localBusName,
                object.hints
            );
        };

        // Glue: allow object to subscribe to events
        object.on = (eventName, handler) => {
            EventBusInstance.on(this.localBusName, eventName, handler);
        };

        // Glue: allow object to subscribe to all events
        object.onAny = (handler) => {
            EventBusInstance.on(this.localBusName, "*", handler);
        };
    }

    onDetach(object) {
        // Remove glue
        delete object.bus;
        delete object.emit;
        delete object.on;
        delete object.onAny;

        // Remove bus from registry (optional)
        // EventBusInstance.destroyBus(this.localBusName);
    }
}
