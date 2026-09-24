// pv-domainObject.js
// New capability-based rewrite of PVDomain

import { BaseObject } from "./pv-baseObject.js";
import { BusExtension } from "./pv-BusExtension.js";
import { HintExtension } from "./pv-HintExtension.js";
import { UpdateExtension } from "./pv-updateExtension.js";
import { RenderExtension } from "./pv-renderExtension.js";
import { DomainExtension } from "./pv-domainExtension.js";

import { DomainCanvasExtension } from "./pv-domainCanvasExtension.js";
import { DomainRendererRegistryExtension } from "./pv-domainRendererRegistryExtension.js";
import { DomainObjectRegistryExtension } from "./pv-domainObjectRegistryExtension.js";

    export function DomainObject(domainName, panelId, canvasId) {

        const domain = new BaseObject(domainName);

        // Core PV capabilities
        domain.extend(new BusExtension(domainName, "MASTER"));
        domain.extend(new HintExtension());
        domain.extend(new UpdateExtension());
        domain.extend(new RenderExtension());

        // Domain identity + metadata
        domain.extend(new DomainExtension({
            domainName,
            metadata: {
                panelId,
                canvasId
            }
        }));

        // Canvas + 2D/3D context
        domain.extend(new DomainCanvasExtension({
            panelId,
            canvasId
        }));

        // Renderer registry (ABC, XYZ, etc.)
        domain.extend(new DomainRendererRegistryExtension());

        // Objects inside this domain
        domain.extend(new DomainObjectRegistryExtension());

        return domain;


    }
    addObject(obj) {

        // Attach object to this domain
        obj.attachToDomain(this);

        // Register object in the domain's object registry
        // JS-only feature: capability lookup via extension
        // Reason: DomainObjectRegistryExtension manages object storage
        this.domainObjects.register(obj);

        // Retrieve the correct renderer for this object's type
        const renderer = this.domainRenderers.getRenderer(obj.type);

        // Ensure the renderer has a handle for this object
        renderer.ensureHandle(obj);
    }
