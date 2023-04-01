import {Complex} from "./complex.js";
import {DFT} from "./dft.js";

export class Sines{
    constructor(fSpace){
        this.fSpace = fSpace;
        this.finalPos = new Complex();
    }

    static SPEED = 0.0005;

    //an arrow is a source and a destination
    getArrows(timestamp){
        if(timestamp === undefined) throw Error("Sines.getArrows: timestamp cannot be undefined");

        const t = timestamp * Sines.SPEED;
        const arrows = [];
        let finalPos = new Complex();

        this.fSpace.map((c, k) => { 
            const mag = c.abs();
            const phs = c.arg();
            const u = DFT.frequency(k + 1);
            const tht = (t * u) + phs; // our phase angle
            const x = mag * Math.cos(tht);
            const y = mag * Math.sin(tht);
            const arrow = new Complex(x, y);

            finalPos = finalPos.add(arrow);

            arrows.push(arrow);
        });

        this.finalPos = finalPos;

        return arrows;
    }
}
