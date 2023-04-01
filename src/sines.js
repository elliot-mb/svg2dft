import { Point } from "./points.js";

export class Sines{
    constructor(fSpace, arrowType){
        this.fSpace = fSpace;
        this.arrowType = arrowType;
        this.finalPos = new Point();
    }

    static SPEED = 0.0005;

    //an arrow is a source and a destination
    getArrows(timestamp){
        if(timestamp === undefined) throw Error("Sines.getArrows: timestamp cannot be undefined");

        const t = timestamp * Sines.SPEED;
        const arrows = [];
        let finalPos = new Point();
        this.fSpace.map((c, u) => { // u is our frequency
            const mag = c.abs();
            const phs = c.arg();
            
            const tht = (t * u) + phs; // our phase angle
            const x1 = (mag / 2) * Math.cos(tht);
            const y1 = (mag / 2) * Math.sin(tht);
            const dst1 = new Point(x1, y1);

            finalPos = finalPos.add(dst1);

            arrows.push(new this.arrowType(dst1.x, dst1.y));

            const x2 = (mag / 2) * Math.cos(-tht);
            const y2 = (mag / 2) * Math.sin(-tht);
            const dst2 = new Point(x2, y2);

            finalPos = finalPos.add(dst2);

            arrows.push(new this.arrowType(dst2.x, dst2.y));
        });

        this.finalPos = finalPos;

        return arrows;
    }
}

export class XArrow extends Point {
    constructor(x, y){
        super(x, y);
    }
}

export class YArrow extends Point{
    constructor(x, y){
        super(y, x);
    }
}