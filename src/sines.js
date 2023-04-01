import {Complex} from "./complex.js";

export class Sines{
    constructor(fSpace, arrowType){
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

        this.fSpace.map((c, u) => { // u is our frequency
            const mag = c.abs();
            const phs = c.arg();
            
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
