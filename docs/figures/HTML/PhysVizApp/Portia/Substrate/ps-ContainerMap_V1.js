export class ContainerMap_V1
    extends Container
{
    constructor(...)
    {
        super(...);

        this.byId = new Map();
        this.byName = new Map();
        this.byTypeName = new Map();
    }

    createThing(identity)
    {
        return SmartFactory.new(
        {
            type: identity.type,
            imp: "Map",
            version: 1
        });
    }

    getOrCreate(identity)
    {
        let thing =
            this.findThing(identity);

        if (thing)
        {
            return thing;
        }

        thing =
            this.createThing(
                identity
            );

        this.storeThing(thing);

        return thing;
    }
}