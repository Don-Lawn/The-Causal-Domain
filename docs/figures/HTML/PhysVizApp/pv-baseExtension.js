// ---------------------------------------------------------------------------
// BaseExtension.js
// Capability module — behaviour lives here
// ---------------------------------------------------------------------------

export class BaseExtension {
    constructor(extensionType) {
        this.extensionType = extensionType;
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
            this.host.capabilities.delete(this.extensionType);
            this.host = null;
        }
    }

    onDetach(host) {
        // Override in subclasses
    }
}
