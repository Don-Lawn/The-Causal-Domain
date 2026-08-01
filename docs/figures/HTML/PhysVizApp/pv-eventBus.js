// ---------------------------------------------------------------------------
// pv-eventBus.js — Clean, deterministic, wildcard-based hierarchical bus
// ---------------------------------------------------------------------------

class EventBus {

    constructor() {
        this.buses = new Map();     // busName → { parent, children[], handlers: Map(event → [fn]) }
        this.monitors = [];         // global monitors
    }

    // -----------------------------------------------------------------------
    // Create a logical bus
    // -----------------------------------------------------------------------
    createBus(busName, parentBusName = null) {

        if (this.buses.has(busName)) {
            console.warn(`EventBus: Bus '${busName}' already exists`);
            return;
        }

        this.buses.set(busName, {
            name: busName,
            parent: parentBusName,
            children: [],
            handlers: new Map()
        });

        // Register child with parent
        if (parentBusName) {
            const parent = this.buses.get(parentBusName);
            if (!parent) throw new Error(`EventBus: Parent bus '${parentBusName}' does not exist`);
            parent.children.push(busName);

            // ⭐ Child receives ALL parent events via wildcard forwarding
            this.on(parentBusName, "*", (payload, evt, deliveredBus) => {
                this.forward(evt, deliveredBus, busName);
            });
        }
    }

    // -----------------------------------------------------------------------
    // Register a handler for an event on a bus
    // -----------------------------------------------------------------------
    on(busName, eventName, callback) {
        const bus = this.buses.get(busName);
        if (!bus) throw new Error(`EventBus: Bus '${busName}' does not exist`);

        // No special wildcard logic — "*" is stored normally
        if (!bus.handlers.has(eventName)) {
            bus.handlers.set(eventName, []);
        }

        const handlers = bus.handlers.get(eventName);

        // Prevent duplicate registration of the same callback
        if (!handlers.includes(callback)) {
            handlers.push(callback);
        }
    }

    // -----------------------------------------------------------------------
    // Emit an event on a bus (downward propagation)
    // -----------------------------------------------------------------------
    emit(eventName, payload, busName, senderName) {
        const bus = this.buses.get(busName);
        if (!bus) throw new Error(`EventBus: Bus '${busName}' does not exist`);

        const evt = {
            time: performance.now(),
            eventName,
            payload,
            bus: busName,
            sender: senderName
        };

        // Notify monitors
        for (const monitor of this.monitors) {
            monitor.handle(busName, evt, "E");
        }

        // ⭐ Unified dispatch: specific + wildcard
        const specific = bus.handlers.get(eventName) || [];
        const wildcard = bus.handlers.get("*") || [];

        for (const fn of specific) fn(evt.payload, evt, busName);
        for (const fn of wildcard) fn(evt.payload, evt, busName);
    }

    // -----------------------------------------------------------------------
    // Forward an event to another bus
    // -----------------------------------------------------------------------
    forward(evt, deliveredBus, targetBus) {
        const target = this.buses.get(targetBus);
        if (!target) throw new Error(`EventBus: Bus '${targetBus}' does not exist`);

        // Notify monitors
//        for (const monitor of this.monitors) {
//            monitor.handle(targetBus, evt, "F");
//        }

        // ⭐ Unified dispatch: specific + wildcard
        const specific = target.handlers.get(evt.eventName) || [];
        const wildcard = target.handlers.get("*") || [];

        for (const fn of specific) fn(evt.payload, evt, targetBus);
        for (const fn of wildcard) fn(evt.payload, evt, targetBus);
    }

    addMonitor(callback) {
        this.monitors.push(callback);
    }
}

// Singleton instance
const EventBusInstance = new EventBus();
export default EventBusInstance;
