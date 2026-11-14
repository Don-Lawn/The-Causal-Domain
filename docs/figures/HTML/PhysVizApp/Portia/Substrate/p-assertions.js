// assertions

export function AssertNotNull (value, location, message) {
    if (value === null || value === undefined) {
        throw new Error(message ?? `Value must not be null or undefined at ${location}`);
    }
}

export function AssertNotImplemented  (location, message) {
    throw new Error(message ?? `Not implemented at ${location}`);
}
