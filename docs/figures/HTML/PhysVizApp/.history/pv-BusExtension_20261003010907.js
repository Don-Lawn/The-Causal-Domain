// ---------------------------------------------------------------------------
// pv-busExtension.js
// Gives any BaseObject its own event bus + merged-hint propagation
// ---------------------------------------------------------------------------

import { BaseExtension } from "./pv-baseExtension.js";
import EventBusInstance from "./pv-eventBus.js";

export class BusExtension extends BaseExtension {
    constructor(localBusName, parentBusName = null) {
        super("bus");

        this.busName = localBusName;
        this.parentBusName = parentBusName;
    }

    onAttach(object) {


        // Create the bus hierarchy
        EventBusInstance.createBus(this.busName, this.parentBusName);

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
                this.busName,
                this.busName
            );
        };

        // -------------------------------------------------------------------
        // Glue: allow object to subscribe to events
        // -------------------------------------------------------------------
        object.on = (eventName, handler) => {
            EventBusInstance.on(this.busName, eventName, handler);
        };

        // Glue: subscribe to all events
        object.onAny = (handler) => {
            EventBusInstance.on(this.busName, "*", handler);
        };
    }

    onDetach(object) {
        delete object.busName;
        delete object.emit;
        delete object.on;
        delete object.onAny;
    }
}
