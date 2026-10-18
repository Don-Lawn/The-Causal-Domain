// ---------------------------------------------------------------------------
// JsonFile
//
// Utility methods for loading and parsing JSON files.
//
// Responsibilities:
//
//     - Load JSON text.
//     - Parse JSON.
//
// Does NOT:
//
//     - Understand Metadata.
//     - Understand PropertySets.
//     - Validate contents.
//
// ---------------------------------------------------------------------------

export class JsonFile
{
    static load(path)
    {
        const xhr =
            new XMLHttpRequest();

        xhr.open(
            "GET",
            path,
            false
        );

        try
        {
            xhr.send();
        }
        catch (error)
        {
            console.error(
                `Error loading JSON file: ${path}`,
                error
            );

            return {};
        }

        if (xhr.status !== 200)
        {
            console.error(
                `Failed to load JSON file: ${path}`
            );

            return {};
        }

        try
        {
            return JSON.parse(
                xhr.responseText
            );
        }
        catch (error)
        {
            console.error(
                `Failed to parse JSON file: ${path}`,
                error
            );

            return {};
        }
    }
}