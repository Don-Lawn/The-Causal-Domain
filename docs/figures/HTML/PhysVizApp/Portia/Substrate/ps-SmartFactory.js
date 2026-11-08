export class SmartFactory
{
    static new(extras)
    {
        if (
            extras.type    === "Container" &&
            extras.imp     === "Map" &&
            extras.version === 1
        )
        {
            return new ContainerMap_V1(
                extras
            );
        }

        throw new Error(
            `Unsupported type=${extras.type}, imp=${extras.imp}, version=${extras.version}`
        );
    }
}