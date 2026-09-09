// pv-stateVector.js

export class PVStateVector {
    constructor(numDomains = 0, numDerivatives = 3, numAxes = 3) {
        this.domains = numDomains;
        this.derivatives = numDerivatives;
        this.axes = numAxes;

        // Create empty SV: [domain][derivative][axis]
        this.data = Array.from({ length: numDomains }, () =>
            Array.from({ length: numDerivatives }, () =>
                Array.from({ length: numAxes }, () => 0)
            )
        );
    }

    // Get value
    get(d, n, a) {
        return this.data[d][n][a];
    }

    // Set value
    set(d, n, a, value) {
        this.data[d][n][a] = value;
    }

    // Clone
    clone() {
        const sv = new PVStateVector(this.domains, this.derivatives, this.axes);
        for (let d = 0; d < this.domains; d++)
            for (let n = 0; n < this.derivatives; n++)
                for (let a = 0; a < this.axes; a++)
                    sv.data[d][n][a] = this.data[d][n][a];
        return sv;
    }

    // Compute delta between two SVs
    static delta(target, current) {
        const out = new PVStateVector(target.domains, target.derivatives, target.axes);
        for (let d = 0; d < target.domains; d++)
            for (let n = 0; n < target.derivatives; n++)
                for (let a = 0; a < target.axes; a++)
                    out.data[d][n][a] = target.data[d][n][a] - current.data[d][n][a];
        return out;
    }

    // Add another SV (correction)
    add(other) {
        for (let d = 0; d < this.domains; d++)
            for (let n = 0; n < this.derivatives; n++)
                for (let a = 0; a < this.axes; a++)
                    this.data[d][n][a] += other.data[d][n][a];
    }

    // Generate hints (self-documentation)
    generateHints() {
        return {
            spatialD0: this.data[0]?.[0],
            spatialD1: this.data[0]?.[1],
            angularD0: this.data[1]?.[0],
            semanticD0: this.data[2]?.[0],
            // Extend as RR grows
        };
    }
}
