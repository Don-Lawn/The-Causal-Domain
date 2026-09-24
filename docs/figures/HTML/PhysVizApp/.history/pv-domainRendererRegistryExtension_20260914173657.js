// pv-domainRendererRegistryExtension.js

import { BaseExtension } from "./pv-baseExtension.js";

export class DomainRendererRegistryExtension extends BaseExtension {
    constructor() {
        super("domainRendererRegistry");
        this.registry = new Map();
    }

    onAttach(domain) {
        domain.registerRenderer = (typeName, rendererClass) => {
            this.registry.set(typeName, rendererClass);
        };

        domain.getRenderer = (typeName) => {
            return this.registry.get(typeName);
        };
    }

    onDetach(domain) {
        delete domain.registerRenderer;
        delete domain.getRenderer;
    }
}
