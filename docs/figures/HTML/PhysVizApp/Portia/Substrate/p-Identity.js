// ps-Identity.js
console.log("Loading Identity");

import { BaseAspect } from "./p-BaseAspect.js";

/**
 * ============================================================
 * Identity
 * ============================================================
 */
export  class Identity extends BaseAspect {
    constructor( metadata = null)
    {        
        super( "Identity", metadata);
        this.id = metadata?.id ?? crypto.randomUUID();
        this.versionNumber = metadata?.versionNumber ?? 1;
        this.type = metadata?.type ?? null;
        this.name = metadata?.name ?? null;
        this.filename = metadata?.filename ?? null;
        this.url    = metadata?.url ?? null;
    }
}
