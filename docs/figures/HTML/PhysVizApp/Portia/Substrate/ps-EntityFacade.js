class EntityFacade
{
    constructor()
    {
        this.roles = new Map();
    }

    addRole(role)
    {
        this.roles.set(
            role.identity.name,
            role
        );
    }

    getRole(name)
    {
        return this.roles.get(name);
    }

    hasRole(name)
    {
        return this.roles.has(name);
    }
}