// ---------------------------------------------------------------------------
// Metadata
//
// Generic description of a thing.
//
// Responsibilities:
//
//     - Identify a thing.
//     - Describe a thing.
//     - Describe how a thing is assembled.
//
// Identity:
//
//     id
//         Unique identifier.
//
//     name
//         Human-readable name.
//
//     type
//         Type identifier.
//
// Type identifiers normally mirror the metadata
// filename without the ".json" suffix.
//
// Example:
//
//     ABC.PhaseWedge.Constructor.Metadata.json
//
// becomes:
//
//     ABC.PhaseWedge.Constructor.Metadata
//
// Metadata does NOT:
//
//     - Store runtime property values.
//     - Execute behaviour.
//     - Create objects.
//
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Metadata
//
// Generic description of a thing.
//
// Responsibilities:
//
//     - Identify a thing.
//     - Describe a thing.
//     - Describe how a thing is assembled.
//
// ---------------------------------------------------------------------------
import { JsonFile }  from "./p-jsonFile.js";
import { PropertySet } from "./pv-propertySet.js";
export class Metadata
{
    constructor()
    {
        // Unique identifier.
        this.id = "";

        // Human-readable name.
        this.name = "";

        // Type identifier.
        this.type = "";

        // PropertySet files used to assemble
        // runtime properties.
        this.propertySetFiles = [];

        // Required properties.
        this.requiredProperties = [];

        // Optional properties.
        this.optionalProperties = [];
    }

    // -----------------------------------------------------------------------
    // Purpose:
    //
    //     Load metadata from a JSON file.
    //
    // Inputs:
    //
    //     path
    //
    // Outputs:
    //
    //     Updates current Metadata object.
    //
    // Algorithm:
    //
    //     Load JSON file.
    //
    //     Parse JSON.
    //
    //     Copy metadata fields into this object.
    //
    // -----------------------------------------------------------------------
    loadFile(path)
    {
        const metadata =
            JsonFile.load(path);

        Object.assign(
            this,
            metadata
        );
    }



    // -----------------------------------------------------------------------
    // Purpose:
    //
    //     Validate metadata structure.
    //
    // Inputs:
    //
    //     None
    //
    // Outputs:
    //
    //     true if valid
    //     false if invalid
    //
    // Algorithm:
    //
    //     Ensure required metadata fields exist.
    //
    // -----------------------------------------------------------------------
    validate()
    {
        if (!this.id)
        {
            console.error(
                "Metadata missing id"
            );

            return false;
        }

        if (!this.type)
        {
            console.error(
                "Metadata missing type"
            );

            return false;
        }

        if (!Array.isArray(
            this.propertySetFiles
        ))
        {
            console.error(
                "Metadata propertySetFiles is invalid"
            );

            return false;
        }

        return true;
    }

    // -----------------------------------------------------------------------
    // Purpose:
    //
    //     Build a PropertySet from the PropertySet files
    //     referenced by this Metadata object.
    //
    // Outputs:
    //
    //     Fully assembled PropertySet.
    //
    // Algorithm:
    //
    //     Create empty PropertySet.
    //
    //     For each PropertySet file.
    //
    //         Load file into PropertySet.
    //
    //     Return assembled PropertySet.
    //
    // Notes:
    //
    //     PropertySet files are loaded in order.
    //
    //     Later files override earlier files.
    //
    // -----------------------------------------------------------------------
    buildPropertySet()
    {
        // Create empty PropertySet.
        const propertySet =
            new PropertySet();

        // Load each PropertySet file.
        for (const path of this.propertySetFiles)
        {
            propertySet.loadFile(
                path
            );
        }

        // Return assembled PropertySet.
        return propertySet;
    }
}