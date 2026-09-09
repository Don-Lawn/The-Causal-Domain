// pv-PID.js

export class PVPID {
    constructor(domains, derivatives = 3, axes = 3) {
        this.domains = domains;
        this.derivatives = derivatives;
        this.axes = axes;

        // PID cube: [domain][derivative][axis]
        this.P = this._makeCube(0.5);
        this.I = this._makeCube(0.0);
        this.D = this._makeCube(0.1);

        this.integral = this._makeCube(0);
        this.lastError = this._makeCube(0);
    }

    _makeCube(init) {
        return Array.from({ length: this.domains }, () =>
            Array.from({ length: this.derivatives }, () =>
                Array.from({ length: this.axes }, () => init)
            )
        );
    }

    update(errorSV, dt) {
        const correction = errorSV.clone();

        for (let d = 0; d < this.domains; d++)
            for (let n = 0; n < this.derivatives; n++)
                for (let a = 0; a < this.axes; a++) {

                    const e = errorSV.data[d][n][a];

                    this.integral[d][n][a] += e * dt;
                    const derivative = (e - this.lastError[d][n][a]) / dt;
                    this.lastError[d][n][a] = e;

                    correction.data[d][n][a] =
                        this.P[d][n][a] * e +
                        this.I[d][n][a] * this.integral[d][n][a] +
                        this.D[d][n][a] * derivative;
                }

        return correction;
    }
}
