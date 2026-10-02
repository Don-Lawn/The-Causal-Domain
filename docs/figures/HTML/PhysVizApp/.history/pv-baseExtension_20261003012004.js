// ---------------------------------------------------------------------------
// BaseExtension.js
// Capability module — behaviour lives here
// ---------------------------------------------------------------------------

export class BaseExtension {
    constructor(name) {
        this.name = name;
        this.host = null;
    }

    // Called by Basehost.extend()
    attachTo(host) {
        this.host = host;
        this.onAttach(host);
    }

    // Optional hook for subclasses
    onAttach(host) {
        // Override in subclasses
    }

    // Optional detach support
    detach() {
        if (this.host) {
            this.onDetach(this.host);
            this.host.capabilities.delete(this.name);
            this.host = null;
        }
    }

    onDetach(host) {
        // Override in subclasses
    }
}
