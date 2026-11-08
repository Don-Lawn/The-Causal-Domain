// ps-Identity.js
/**
 * ============================================================
 * Identity
 * ============================================================
 */
export class Identity
{
    constructor( type, name, extras = null)
    {        
        this.id = extras?.id ?? crypto.randomUUID();
        this.versionNumber = extras?.versionNumber ?? 1;
        this.type = type;
        this.name = name;
    }
}
