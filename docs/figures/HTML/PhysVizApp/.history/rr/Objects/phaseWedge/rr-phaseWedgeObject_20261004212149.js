// rr-phaseWedgeObject.js

import { BaseObject } from "../../../pv-baseObject.js";
import { BusExtension } from "../../../pv-BusExtension.js";
import { HintExtension } from "../../../pv-HintExtension.js";
import { UpdateExtension } from "../../../pv-updateExtension.js";
import { RenderExtension } from "../../../pv-renderExtension.js";
import { GeometryExtension } from "../../../pv-GeometryExtension.js";
import { DomainExtension } from "../../../pv-domainExtension.js";

import { PhaseWedgeExtension } from "./rr-phaseWedgeExtension.js";
import { PhaseWedgeGeometryExtension } from "./rr-phaseWedgeGeometryExtension.js";
import { PhaseWedgeRendererExtension_ABC } from "./rr-phaseWedgeRendererExtension_ABC.js";

export function PhaseWedgeObject(id, domain, {
    angle = 0,
    magnitude = 1,
    color = 0xff0000
} = {}) {

    const host = new BaseObject(id);
    host.type = "PhaseWedge";
    
    // Domain-specific behaviour
    host.extend(new PhaseWedgeExtension({ angle, magnitude, color }));

    // add bus interaction extension, for the domain's bus
    host.extend(new BusExtension(domain.busName, null));

    host.extend(new HintExtension());
    host.extend(new UpdateExtension());


    host.extend(new GeometryExtension());
    host.extend(new RenderExtension());
    host.extend(new DomainExtension());
    host.extend(new PhaseWedgeGeometryExtension());
    host.extend(new PhaseWedgeRendererExtension_ABC());

    return host;
}
