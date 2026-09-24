import { BaseExtension } from "./pv-baseExtension.js";

export class DomainObjectRegistryExtension extends BaseExtension {
    constructor() {
        super("domainObjectRegistry");
        this.objects = new Map();
    }

    onAttach(object) {
        object.objects = this.objects;
        object.registerObject = (key, value) => {
            this.objects.set(key, value);
            return value;
        };
        object.unregisterObject = (key) => {
            const value = this.objects.get(key);
            this.objects.delete(key);
            return value;
        };
    }

    onDetach(object) {
        delete object.objects;
        delete object.registerObject;
        delete object.unregisterObject;
    }
}
