// ---------------------------------------------------------------------------
// PropertySet
//
// Generic collection of mergeable name/value properties.
//
// Responsibilities:
//
//     - Store properties.
//     - Load properties from JSON files.
//     - Merge PropertySets.
//     - Validate required properties.
//     - Provide property access.
//
// PropertySets may be layered:
//
//     Defaults
//          +
//     Profile Properties
//          +
//     Instance Overrides
//          =
//     Effective PropertySet
//
// Examples:
//
//     PhaseWedge Properties
//     Camera Properties
//     Renderer Properties
//     Factory Properties
//
// ---------------------------------------------------------------------------

export class PropertySet
{
    constructor()
    {
        // Property storage.
        this.properties = {};

        // Source files used to construct this PropertySet.
        this.propertyFiles = [];
    }

    // -----------------------------------------------------------------------
    // Purpose:
    //
    //     Load properties from a JSON file.
    //
    // Inputs:
    //
    //     path
    //
    // Outputs:
    //
    //     Updates current PropertySet.
    //
    // Algorithm:
    //
    //     Load JSON file.
    //
    //     Parse JSON into a property collection.
    //
    //     Merge loaded properties into the current PropertySet.
    //
    //     Record the source file name.
    //
    // Notes:
    //
    //     PropertySet files are merged in load order.
    //
    //     Later property values override earlier values.
    //
    // -----------------------------------------------------------------------
    loadFile(path)
    {
        // Load JSON file.
        const properties = this._loadJsonFile(path);

        // Merge loaded properties into the current PropertySet.
        this._mergeProperties( properties         );

        // Record source file name.
        this.propertyFiles.push( path);
    }
    // -----------------------------------------------------------------------
    // Purpose:
    //
    //     Load and parse a JSON PropertySet file.
    //
    // Inputs:
    //
    //     path
    //
    // Outputs:
    //
    //     Plain JavaScript object containing properties.
    //
    // Algorithm:
    //
    //     Create synchronous XHR request.
    //
    //     Load file contents.
    //
    //     Verify successful response.
    //
    //     Parse JSON text.
    //
    //     Return property collection.
    //
    // -----------------------------------------------------------------------
    _loadJsonFile(path)
    {
        // Create synchronous XHR request.
        const xhr =
            new XMLHttpRequest();

        // Load file contents.
        xhr.open(
            "GET",
            path,
            false
        );

        try
        {
            xhr.send(null);
        }
        catch (error)
        {
            console.error(
                `Error loading PropertySet file: ${path}`,
                error
            );

            return {};
        }

        // Verify successful response.
        if (xhr.status !== 200)
        {
            console.error(
                `Failed to load PropertySet file: ${path}`,
                xhr.status
            );

            return {};
        }

        // Parse JSON text.
        try
        {
            return JSON.parse(
                xhr.responseText
            );
        }
        catch (error)
        {
            console.error(
                `Failed to parse PropertySet file: ${path}`,
                error
            );

            return {};
        }
    }

    // -----------------------------------------------------------------------
    // Purpose:
    //
    //     Merge a collection of properties into the current PropertySet.
    //
    // Inputs:
    //
    //     properties
    //
    // Outputs:
    //
    //     Updates current PropertySet.
    //
    // Algorithm:
    //
    //     For each incoming property.
    //
    //         Copy property into the current PropertySet.
    //
    //         Incoming values override existing values.
    //
    // -----------------------------------------------------------------------
    _mergeProperties(properties)
    {
        // Process each incoming property.
        for (const propertyName in properties)
        {
            // Copy property value into the current PropertySet.
            this.properties[propertyName] =
                properties[propertyName];
        }
    }

    // -----------------------------------------------------------------------
    // Purpose:
    //
    //     Rebuild this PropertySet from its original source files.
    //
    // Inputs:
    //
    //     None.
    //
    // Outputs:
    //
    //     Updates current PropertySet.
    //
    // Algorithm:
    //
    //     Clear current properties.
    //
    //     Reload each source file.
    //
    //     Rebuild PropertySet.
    //
    //     Validate properties.
    //
    // -----------------------------------------------------------------------
    reload()
    {
    }

    // -----------------------------------------------------------------------
    // Purpose:
    //
    //     Merge another PropertySet into this PropertySet.
    //
    // Inputs:
    //
    //     propertySet
    //
    // Outputs:
    //
    //     Updates current PropertySet.
    //
    // Algorithm:
    //
    //     For each incoming property.
    //
    //         Copy property into current PropertySet.
    //
    //         Incoming values override existing values.
    //
    // -----------------------------------------------------------------------
    merge(propertySet)
    {
    }

    // -----------------------------------------------------------------------
    // Purpose:
    //
    //     Retrieve a property value.
    //
    // Inputs:
    //
    //     propertyName
    //
    // Outputs:
    //
    //     Property value.
    //
    // -----------------------------------------------------------------------
    get(propertyName)
    {
    }

    // -----------------------------------------------------------------------
    // Purpose:
    //
    //     Store or replace a property value.
    //
    // Inputs:
    //
    //     propertyName
    //     propertyValue
    //
    // Outputs:
    //
    //     Updates current PropertySet.
    //
    // -----------------------------------------------------------------------
    set(propertyName, propertyValue)
    {
    }

    // -----------------------------------------------------------------------
    // Purpose:
    //
    //     Remove a property.
    //
    // Inputs:
    //
    //     propertyName
    //
    // Outputs:
    //
    //     Updates current PropertySet.
    //
    // -----------------------------------------------------------------------
    remove(propertyName)
    {
    }

    // -----------------------------------------------------------------------
    // Purpose:
    //
    //     Validate required properties.
    //
    // Inputs:
    //
    //     requiredProperties
    //
    // Outputs:
    //
    //     Validation result.
    //
    // Algorithm:
    //
    //     Check each required property.
    //
    //     Report missing properties.
    //
    // -----------------------------------------------------------------------
    validate(requiredProperties)
    {
    }
}