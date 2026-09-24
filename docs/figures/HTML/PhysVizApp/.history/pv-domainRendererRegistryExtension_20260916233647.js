// pv-domainRendererRegistryExtension.js
import { BaseExtension } from "./pv-baseExtension.js";
import { RendererRegistry } from "./pv-rendererRegistry.js";

export class DomainRendererRegistryExtension extends BaseExtension {

    constructor() {
        super("domainRenderers");   // ✔ matches DomainObject expectations
        this.registry = new RendererRegistry();
    }

    onAttach(domain) {

        // JS-only feature: dynamic capability injection
        // Reason: renderer registry must attach at runtime
        domain.domainRenderers = this.registry;

        // Glue: convenience wrappers
        domain.registerRenderer = (typeName, rendererClass) => {
            this.registry.register(domain.getDomain(), typeName, rendererClass);
        };

        domain.getRenderer = (typeName) => {
            return this.registry.getClass(domain.getDomain(), typeName);
        };
    }

    onDetach(domain) {
        delete domain.domainRenderers;
        delete domain.registerRenderer;
        delete domain.getRenderer;
    }
}
