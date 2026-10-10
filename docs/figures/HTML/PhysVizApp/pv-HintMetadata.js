export class HintMetadata
{
    constructor()
    {
        // List of hint files to load
        this.hintFiles = [];

        // Required hints
        this.requiredHints = [];

        // Optional hints
        this.optionalHints = [];
    }

    load(path)
    {
        // Load metadata JSON file
        // Populate member fields
    }

    validate()
    {
        // Validate metadata structure
        // Ensure required sections exist
    }
}
