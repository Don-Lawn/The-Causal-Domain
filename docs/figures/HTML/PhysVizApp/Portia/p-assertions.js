// assertions

export function AssertNotNull (value, location, message) {
    if (value === null || value === undefined) {
        throw new Error(message ?? `Value must not be null or undefined at ${location}`);
    }
}
