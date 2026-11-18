// ps-Identity.js
console.log("Loading Identity");
/**
 * ============================================================
 * Identity
 * ============================================================
 */
export  class Identity
{
    constructor( metadata = null)
    {        
        this.id = metadata?.id ?? crypto.randomUUID();
        this.versionNumber = metadata?.versionNumber ?? 1;
        this.type = metadata?.type ?? null;
        this.name = metadata?.name ?? null;
    }
}
