// ---------------------------------------------------------------------------
// pv-busExtension.js
// Gives any BaseObject its own event bus + merged-hint propagation
// ---------------------------------------------------------------------------

import { BaseExtension } from "./pv-baseExtension.js";
import EventBusInstance from "./pv-eventBus.js";

export class BusExtension extends BaseExtension {
    constructor(localBusName, parentBusName = null) {
        super("bus");

        this.localbusName = localBusName;
        this.parentBusName = parentBusName;
    }

    onAttach(host) {

        host.busName = this.localbusName;

        // Create the bus hierarchy
        EventBusInstance.createBus(host.busName, this.parentBusName);

        // -------------------------------------------------------------------
        // Glue: emit() with merged-hint propagation
        // -------------------------------------------------------------------
        host.emit = (eventName, payload = {}) => {

            // Extract passed-in hints (if any)
            const passedHints = payload.hints || {};

            // Merge host hints with passed-in hints
            const mergedHints = {
                ...host.hints,
                ...passedHints
            };

            // Emit event with merged hints
            EventBusInstance.emit(
                eventName,
                {
                    ...payload,
                    hints: mergedHints
                },
                host.busName,
                host.busName
            );
        };

        // -------------------------------------------------------------------
        // Glue: allow host to subscribe to events
        // -------------------------------------------------------------------
        host.on = (eventName, handler) => {
            EventBusInstance.on(host.busName, eventName, handler);
        };

        // Glue: subscribe to all events
        host.onAny = (handler) => {
            EventBusInstance.on(host.busName, "*", handler);
        };
    }

    onDetach(host) {
        delete host.busName;
        delete host.emit;
        delete host.on;
        delete host.onAny;
    }
}
