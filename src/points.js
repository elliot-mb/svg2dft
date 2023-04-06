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

    setCount(count){
        this.count = count;
    }

    getComponents(){
        return this.components; 
    }

    isLoaded(){
        return this.points !== undefined && this.points.length !== 0; 
    }
}
