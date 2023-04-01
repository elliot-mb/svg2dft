import { Complex } from "./complex.js";

//static class of Discrete Fourier Transform methods

export class DFT {
    constructor(){}

    static makeFreqs(count){
        const xs = Array(count).fill(0);
        xs.forEach((x, i) => xs[i] = i);

        return xs;
    }

    static frequency(k){
        const sign = k % 2 === 0 ? -1 : 1;
        const u = sign * Math.floor(k / 2);
        return u;
    }

    //a signal is an array of complex values
    static apply(signal){
        if(signal === undefined || signal.length === 0) throw Error("DFT.apply: seemingly empty or undefined signal");

        const N = signal.length;
        const fSpace = []; //array of complex numbers as the fourier space

        for(let k = 0; k < N; k++) {
            let sum = new Complex(0, 0);
            const u = DFT.frequency(k + 1);
            for(let x = 0; x < N; x++){
                const phi = -1 * (Complex.TWO_PI * u * x) / N;
                const c = Complex.exp(new Complex(0, phi));
                sum = sum.add(signal[x].mul(c));
            }
            console.log(`${u} responds ${sum.see()}`);
            fSpace.push(sum.div(N));
        }

        return fSpace;
    }

}