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

export function PhaseWedgeObject(id, {
    angle = 0,
    magnitude = 1,
    color = 0xff0000
} = {}) {

    const obj = new BaseObject(id);

    obj.extend(new BusExtension(id, domain.busName));
    obj.extend(new HintExtension());
    obj.extend(new UpdateExtension());
    obj.extend(new RenderExtension());

    obj.extend(new GeometryExtension({ autoAddToScene: true }));

    obj.extend(new DomainExtension({
        domainName: "RR",
        metadata: { type: "PhaseWedge" }
    }));

    obj.extend(new PhaseWedgeExtension({ angle, magnitude, color }));
    obj.extend(new PhaseWedgeGeometryExtension());
    obj.extend(new PhaseWedgeRendererExtension_ABC());

    return obj;
}
