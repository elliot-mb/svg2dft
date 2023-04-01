import { Complex } from "./complex.js";

//static class of Discrete Fourier Transform methods

export class DFT {
    constructor(){}

    static makeFreqs(count){
        const xs = Array(count).fill(0);
        xs.forEach((x, i) => xs[i] = i);

        return xs;
    }

    //low-pass filter on all frequencies above n/2 for n length fSpace
    static nyquistFilter(fSpace){
        fSpace.splice(Math.floor(fSpace.length / 2));
        for(let i = 1; i < fSpace.length; i++){
            fSpace[i] = fSpace[i].mul(2);
        }
        return fSpace;
    }

    //a signal is an array of real values
    static apply(signal){
        if(signal === undefined || signal.length === 0) throw Error("DFT.apply: seemingly empty or undefined signal");

        const N = signal.length;
        const fSpace = []; //array of complex numbers as the fourier space
        const freqs = DFT.makeFreqs(N);

        freqs.map((u) => {
            let sum = new Complex();
            signal.forEach((pt, x) => {
                const radians = (Complex.TWO_PI * -1 * u * x) / N;
                sum = sum.add(Complex.exp(new Complex(0, radians)).mul(signal[x]));
            });
            fSpace.push(sum.div(N));
        });

        return DFT.nyquistFilter(fSpace);
    }

}