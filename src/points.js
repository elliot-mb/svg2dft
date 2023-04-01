export class Points {
    constructor(count){
        this.count = count;
        this.svgPoints = [];
        this.svgComponents = [];
        this.unevens = [];
    }

    static transformPoint(pt, trans){
        return {
            x: (pt.x * trans.scale) + trans.translate.x,
            y: (pt.y * trans.scale) + trans.translate.y
        };
    }

    reset(){
        this.svgPoints = [];
        this.svgComponents = [];
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
            const points = [];

            for(let i = 0; i < this.count * proportion; i++){
                const len = i * ratio;
                let svgPt = path.getPointAtLength(len);
                console.log(svgPt);
                const pt = new Point(svgPt.x, svgPt.y);

                points.push(pt);
            }
            
            //points.push({x: 0, y: 0});

            this.svgPoints.push(...points);
        });

        let total = 0;
        const count = this.svgPoints.length;
        const dists = [];
        for(let i = 0; i <= count; i++){
            const curr = this.svgPoints[i % count];
            const next = this.svgPoints[(i+1) % count];
            const dist = curr.dist(next);
            total += dist;
            dists.push(dist);
        }
        const averageDist = total / count;
        let lastComponentIndex = 0;
        dists.map((dist, i) => {
            if(dist > averageDist) {
                const component = this.svgPoints.slice(lastComponentIndex, i + 1);
                lastComponentIndex = i;
                this.svgComponents.push(component);
                this.unevens.push(i);
            }
        });

        console.log(this.unevens);
        console.log(this.svgComponents);
        console.log(this.svgPoints);
    }

    //mutates svgPoints
    transform(trans){
        this.svgPoints = this.svgPoints.map(pt => Points.transformPoint(pt, trans));
        this.svgComponents = this.svgComponents.map(c => c.map(pt => Points.transformPoint(pt, trans)));
    }

    isolateAxis(axis){
        const axisLower = axis.toLowerCase();

        if(this.svgPoints.length === 0){
            throw Error("Points:isolateAxis: seemingly empty array of points");
        } 
        if(axis === undefined || axisLower !== 'x' && axisLower !== 'y'){
            throw Error("Points:isolateAxis: handed a bad axis label");
        }

        return this.svgPoints.map(pt => pt[axisLower]);
    }

    getPoints(){
        return this.svgPoints;
    }

    getComponents(){
        return this.svgComponents; 
    }

    isLoaded(){
        return this.svgPoints !== undefined && this.svgPoints.length !== 0 && this.svgComponents !== undefined && this.svgComponents.length !== 0; 
    }
}

export class Point{
    constructor(x, y){
        this.x = x === undefined ? 0 : x;
        this.y = y === undefined ? 0 : y;
    }

    static assertDefined(pt){
        if(pt.x === undefined || pt.y === undefined){
            throw Error("Point.add: x and y must be defined");
        }
    }

    add(pt){
        Point.assertDefined(pt);
        return new Point(this.x + pt.x, this.y + pt.y);
    }

    //point * scalar multiplication 
    mul(n){
        return new Point(this.x * n, this.y * n);
    }

    sub(pt){
        Point.assertDefined(pt);
        return this.add(pt.mul(-1));
    }

    dist(pt){
        Point.assertDefined(pt);
        const diff = this.sub(pt);
        return Math.sqrt((diff.x * diff.x) + (diff.y * diff.y));
    }
}