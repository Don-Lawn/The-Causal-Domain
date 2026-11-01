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
        this.type = type;
        this.name = name;
    }
}
