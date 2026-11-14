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
import{ File }  from "./p-File.js";

export class JsonFile extends File
{
    constructor (filename) {
        super(filename);
    }

    serialise( object ) {
        return JSON.stringify(object, null, 4);
    }

    deserialise( jsonText ) {
        return JSON.parse(jsonText);
    }
}