import { Complex } from "./complex.js";

export class Points {
    constructor(count){
        this.count = count;
        this.points = []; //array of Complex
        this.components = [];
        this.unevens = [];
    }

    static transformPoint(pt, trans){
        const out = pt.mul(trans.scale).add(trans.translate);
        return out;
    }

    reset(){
        this.points = [];
        this.componenets = [];
        this.unevens = [];
    }

    generate(){
        this.reset(); 

        console.log("generate");
        const paths = document.getElementsByTagName("path");

        const totalLength = Array.from(paths).reduce((tot, p) => tot + p.getTotalLength(), 0);
        const ratio = totalLength / this.count;
        
        
        // we will check if a distance is notably larger than this to determine where discontinuities occur
        Array.from(paths).map((path) => {
            const pathLength = path.getTotalLength();
            const proportion = pathLength / totalLength;
            for(let i = 0; i < this.count * proportion; i++){
                const len = i * ratio;
                let svgPt = path.getPointAtLength(len);
                const pt = new Complex(svgPt.x, svgPt.y);

                this.points.push(pt);
            }
        });

        // let total = 0;
        // const count = this.points.length;
        // const dists = [];
        // for(let i = 0; i <= count; i++){
        //     const curr = this.points[i % count];
        //     const next = this.points[(i+1) % count];
        //     const dist = curr.sub(next).abs();
        //     total += dist;
        //     dists.push(dist);
        // }
        // const averageDist = total / count;
        // let lastComponentIndex = 0;
        // dists.map((dist, i) => {
        //     if(dist > averageDist) {
        //         const component = this.points.slice(lastComponentIndex, i + 1);
        //         lastComponentIndex = i;
        //         this.components.push(component);
        //         this.unevens.push(i);
        //     }
        // });

        // console.log(this.unevens);
        // console.log(this.components);
    }

    //mutates points
    transform(trans){
        this.points = this.points.map(pt => Points.transformPoint(pt, trans));
        this.components = this.components.map(c => c.map(pt => Points.transformPoint(pt, trans)));
    }

    // isolateAxis(axis){
    //     const axisLower = axis.toLowerCase();

    //     if(this.points.length === 0){
    //         throw Error("Points:isolateAxis: seemingly empty array of points");
    //     } 
    //     if(axis === undefined || axisLower !== 'x' && axisLower !== 'y'){
    //         throw Error("Points:isolateAxis: handed a bad axis label");
    //     }

    //     return this.points.map(pt => pt[axisLower]);
    // }

    getPoints(){
        return this.points;
    }

    getComponents(){
        return this.components; 
    }

    isLoaded(){
        return this.points !== undefined && this.points.length !== 0; 
    }
}

// export class Point{
//     constructor(x, y){
//         this.x = x === undefined ? 0 : x;
//         this.y = y === undefined ? 0 : y;
//     }

//     static assertDefined(pt){
//         if(pt.x === undefined || pt.y === undefined){
//             throw Error("Point.add: x and y must be defined");
//         }
//     }

//     add(pt){
//         Point.assertDefined(pt);
//         return new Point(this.x + pt.x, this.y + pt.y);
//     }

//     //point * scalar multiplication 
//     mul(n){
//         return new Point(this.x * n, this.y * n);
//     }

//     sub(pt){
//         Point.assertDefined(pt);
//         return this.add(pt.mul(-1));
//     }

//     dist(pt){
//         Point.assertDefined(pt);
//         const diff = this.sub(pt);
//         return Math.sqrt((diff.x * diff.x) + (diff.y * diff.y));
//     }
// }