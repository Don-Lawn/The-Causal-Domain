// pv-rendererRegistry.js
export class RendererRegistry {
    constructor() {
        this.map = new Map(); // key: "domain:type" → RendererClass
    }

    register(domainName, semanticType, RendererClass) {
        const key = `${domainName}:${semanticType}`;
        this.map.set(key, RendererClass);
    }

    typesForDomain(domainName) {
        const types = [];

        for (const key of this.map.keys()) {
            const [d, type] = key.split(":");
            if (d === domainName) {
                types.push(type);
            }
        }

        return types;
    }

    getClass(domainName, semanticType) {
        const key = `${domainName}:${semanticType}`;
        return this.map.get(key);
    }

}
