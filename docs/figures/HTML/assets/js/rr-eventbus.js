// pv-EventBus.js
// Central nervous system of the PV reactive engine.
// Supports logging, monitoring, and event delivery.

export const EventBus = {

    // eventName → [handlers]
    listeners: {},

    // chronological event ledger
    log: [],

    // global observers (see all events)
    monitors: [],


    // Register a listener for a specific event
    on(eventName, handler) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(handler);
    },


    // Register a monitor that receives ALL events
    addMonitor(handler) {
        this.monitors.push(handler);
    },


    // Emit an event to listeners + monitors
    emit(eventName, payload = {}) {
        const time = performance.now();

        const evt = { time, eventName, payload };

        // Log event
        this.log.push(evt);

        // Notify monitors
        for (const monitor of this.monitors) {
            monitor(evt);
        }

        // Deliver to listeners
        const handlers = this.listeners[eventName];
        if (handlers) {
            for (const handler of handlers) {
                handler(payload);
            }
        }
    }
};

export const EventBusInstance = EventBus;
