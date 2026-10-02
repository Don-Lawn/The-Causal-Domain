// pv-domainObject.js
// Full PV capability-based DomainObject (OO style)

import { BaseObject } from "./pv-baseObject.js";
import { BusExtension } from "./pv-BusExtension.js";
import { HintExtension } from "./pv-HintExtension.js";
import { UpdateExtension } from "./pv-updateExtension.js";
import { RenderExtension } from "./pv-renderExtension.js";

import { DomainExtension } from "./pv-domainExtension.js";
import { DomainCanvasExtension } from "./pv-domainCanvasExtension.js";
import { DomainRendererRegistryExtension } from "./pv-domainRendererRegistryExtension.js";
import { DomainObjectRegistryExtension } from "./pv-domainObjectRegistryExtension.js";

export class DomainObject extends BaseObject {

    constructor(domainName, panelId, canvasId) {
        super(domainName);

        // Core PV capabilities
        this.extend(new BusExtension(domainName, "MASTERBUS"));
        this.extend(new HintExtension());
        this.extend(new UpdateExtension());
        this.extend(new RenderExtension());

        // Domain identity + metadata
        this.extend(new DomainExtension({
            domainName,
            metadata: {
                panelId,
                canvasId
            }
        }));

        // Canvas + 2D/3D context
        this.extend(new DomainCanvasExtension({
            panelId,
            canvasId
        }));

        // Renderer registry (ABC, XYZ, etc.)
        this.extend(new DomainRendererRegistryExtension());

        // Objects inside this domain
        this.extend(new DomainObjectRegistryExtension());
    }

    // ------------------------------------------------------------
    // Domain API: addObject
    // ------------------------------------------------------------
    addObject(semObj)
    {
        // Attach semantic object to this domain
        semObj.setDomain(this);

        // Registry
        this.domainObjects.register(semObj);

        // Legacy RendererBase path removed.
        // In the capability architecture the renderer
        // creates geometry / handles lazily during render.
    }

}
