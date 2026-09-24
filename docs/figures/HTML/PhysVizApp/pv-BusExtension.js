// ---------------------------------------------------------------------------
// pv-busExtension.js
// Gives any BaseObject its own event bus + merged-hint propagation
// ---------------------------------------------------------------------------

import { BaseExtension } from "./pv-baseExtension.js";
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

        // -------------------------------------------------------------------
        // Glue: emit() with merged-hint propagation
        // -------------------------------------------------------------------
        object.emit = (eventName, payload = {}) => {

            // Extract passed-in hints (if any)
            const passedHints = payload.hints || {};

            // Merge object hints with passed-in hints
            const mergedHints = {
                ...object.hints,
                ...passedHints
            };

            // Emit event with merged hints
            EventBusInstance.emit(
                eventName,
                {
                    ...payload,
                    hints: mergedHints
                },
                this.localBusName,
                this.localBusName
            );
        };

        // -------------------------------------------------------------------
        // Glue: allow object to subscribe to events
        // -------------------------------------------------------------------
        object.on = (eventName, handler) => {
            EventBusInstance.on(this.localBusName, eventName, handler);
        };

        // Glue: subscribe to all events
        object.onAny = (handler) => {
            EventBusInstance.on(this.localBusName, "*", handler);
        };
    }

    onDetach(object) {
        delete object.bus;
        delete object.emit;
        delete object.on;
        delete object.onAny;
    }
}
