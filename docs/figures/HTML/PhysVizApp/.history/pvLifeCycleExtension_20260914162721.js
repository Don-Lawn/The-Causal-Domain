// ---------------------------------------------------------------------------
// pv-lifecycleExtension.js
// Provides RR lifecycle event → FSM wiring for any BaseObject
// ---------------------------------------------------------------------------

import { BaseExtension } from "./pv-baseExtension.js";
import EventBusInstance from "./pv-eventBus.js";

export class LifecycleExtension extends BaseExtension {
    constructor() {
        super("lifecycle");
    }

    onAttach(object) {

        // Safety: require bus + FSM
        if (!object.bus) {
            throw new Error(
                `LifecycleExtension requires object '${object.id}' to have a bus.`
            );
        }

        if (!object.fsm) {
            throw new Error(
                `LifecycleExtension requires object '${object.id}' to have an FSM.`
            );
        }

        const bus = object.bus;
        const fsm = object.fsm;

        // -------------------------------------------------------------------
        // Lifecycle → FSM wiring
        // -------------------------------------------------------------------

        EventBusInstance.on(bus, "LOAD", (payload, evt) => {
            fsm._receive("LOAD", payload, evt);
        });

        EventBusInstance.on(bus, "START", (payload, evt) => {
            fsm._receive("START", payload, evt);
        });

        EventBusInstance.on(bus, "PAUSE", (payload, evt) => {
            fsm._receive("PAUSE", payload, evt);
        });

        EventBusInstance.on(bus, "RESUME", (payload, evt) => {
            fsm._receive("RESUME", payload, evt);
        });

        EventBusInstance.on(bus, "STOP", (payload, evt) => {
            fsm._receive("STOP", payload, evt);
        });

        // -------------------------------------------------------------------
        // Tick + Render → FSM wiring
        // -------------------------------------------------------------------

        EventBusInstance.on(bus, "TICK", (payload, evt) => {
            fsm._receive("TICK", payload, evt);
        });

        EventBusInstance.on(bus, "RENDER", (payload, evt) => {
            fsm._receive("RENDER", payload, evt);
        });

        // Glue: convenience lifecycle triggers
        object.load = (p = {}) => object.emit("LOAD", p);
        object.start = (p = {}) => object.emit("START", p);
        object.pause = (p = {}) => object.emit("PAUSE", p);
        object.resume = (p = {}) => object.emit("RESUME", p);
        object.stop = (p = {}) => object.emit("STOP", p);
    }

    onDetach(object) {
        // Remove glue methods
        delete object.load;
        delete object.start;
        delete object.pause;
        delete object.resume;
        delete object.stop;

        // Note: eventBusInstance.on() cannot be “unsubscribed” in your current implementation.
        // If you later add unsubscribe support, detach() can clean up subscriptions too.
    }
}
