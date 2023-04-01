import { State } from "./state.js";
import { Points, Point } from "./points.js";
import { DFT } from "./dft.js";
import { Sines, XArrow, YArrow } from "./sines.js";

var canvas = document.getElementById("canvas"); //links the script to the canvas in html
var ctx = canvas.getContext("2d"); //sets renderer context

// console.log((DFT.apply([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])));

const TRAIL_PROPORTION = 1; 
const SUBSTEP = 5; //must be 1 or more
const TRAIL_SIZE = TRAIL_PROPORTION * Math.round((SUBSTEP / 2.5) / Sines.SPEED);
const SCALE = 800;
const OFFSET = new Point(500, 500);
const COLOURS = ["#f00", "#0f0", "#00f", "#ff0", "#0ff", "#f0f"];
const ARROW_COUNT = 500;

let dt, pt;
let trailQueue = Array(TRAIL_SIZE).fill(new Point());
let trailNeedsReset = false;

const pts = new Points(200);
let sinesX, sinesY;
const state = new State(SCALE, OFFSET, (transform) => {
    pts.generate();
    pts.transform(transform);
    pts.transform({
        scale: 1, 
        translate: new Point(-1 * OFFSET.x, -1 * OFFSET.y)
    });
    console.log(pts);
    sinesX = new Sines(DFT.apply(pts.isolateAxis('x')), XArrow);
    sinesY = new Sines(DFT.apply(pts.isolateAxis('y')), YArrow);

    pts.transform({
        scale: 1,
        translate: new Point(OFFSET.x, OFFSET.y)
    });
    trailNeedsReset = true;
});
state.init();

function drawArrows(arrowsX, arrowsY, drawPoint){
    if(arrowsX.length !== arrowsY.length) throw Error("main.drawArrows: need equal length arrow arrays");

    const count = Math.min(arrowsX.length, ARROW_COUNT);

    ctx.strokeStyle = "#ee2";
    ctx.lineWidth = 2;
    ctx.beginPath();
    trailQueue.map(pt => {
        ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();

    let pos = OFFSET;
    ctx.strokeStyle = "#aaa";
    ctx.lineWidth = 1;
    for(let i = 0; i < count; i++){
        const aX = arrowsX[i];
        const lenAX = Math.sqrt((aX.x * aX.x) + (aX.y * aX.y));
        const aY = arrowsY[i];
        const lenAY = Math.sqrt((aY.x * aY.x) + (aY.y * aY.y));
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, lenAX, 0, 2 * Math.PI);
        ctx.stroke(); 
        pos = pos.add(aX);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, lenAY, 0, 2 * Math.PI);
        ctx.stroke(); 
        pos = pos.add(aY);
    }

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.beginPath();

    pos = OFFSET;
    ctx.moveTo(pos.x, pos.y);

    for(let i = 0; i < count; i++){
        const aX = arrowsX[i];
        const aY = arrowsY[i];
        pos = pos.add(aX);
        ctx.lineTo(pos.x, pos.y);
        pos = pos.add(new Point(aY.x, aY.y));
        ctx.lineTo(pos.x, pos.y);
    }
    ctx.stroke();

    ctx.fillStyle = "#00f";
    ctx.beginPath();
    ctx.arc(drawPoint.x, drawPoint.y, 3, 0, 2 * Math.PI);
    ctx.fill(); 
    ctx.strokeStyle = "#00f";
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.rect(drawPoint.x - 20, drawPoint.y - 20, 40, 40);
    ctx.stroke(); 
}

function mainLoop(timestamp){

    dt = timestamp - pt;
    pt = timestamp;

    ctx.fillStyle = "#000";
    ctx.fillRect(0,0,1000,1000);

    pts.getPoints().map((pt) => {
        ctx.fillStyle = "#252";
        ctx.fillRect(pt.x - 4, pt.y - 4, 8, 8);
    });


    if(pts.isLoaded()){
        // let colour = 0;
        // ctx.strokeStyle = COLOURS[0];
        // ctx.lineWidth = 2;
        // ctx.beginPath();
        // let unevenCount = 0;
        // const points = pts.getPoints();
        // for(let i = 0; i <= points.length; i++){
        //     const pt = points[i % points.length];
        //     const nxtPt = points[(i + 1) % points.length];
        //     ctx.lineTo(pt.x, pt.y);
        //     if(i === pts.unevens[unevenCount]){
        //         unevenCount++;
        //         i++;
        //         ctx.stroke();

        //         ctx.strokeStyle = COLOURS[2];
        //         ctx.beginPath();
        //         ctx.moveTo(pt.x, pt.y);
        //         ctx.lineTo(nxtPt.x, nxtPt.y);
        //         ctx.stroke();

        //         ctx.strokeStyle = COLOURS[0];
        //         ctx.beginPath();
        //         ctx.moveTo(nxtPt.x, nxtPt.y);
        //     }
        // }
        // ctx.stroke();

        pts.getComponents().map((c, i) => {
            ctx.strokeStyle = COLOURS[i % (COLOURS.length - 1)];
            ctx.lineWidth = 3;
            ctx.beginPath();
            for(let j = 0; j <= c.length; j++){
                const pt = c[j % c.length];
                ctx.lineTo(pt.x, pt.y);
            }
            ctx.stroke();
            console.log(i);
        })
    }

    if(pts.isLoaded() && false){
        let arrowsX;
        let arrowsY;
        const timestep = dt / SUBSTEP;
        if(trailNeedsReset){
            trailQueue = Array(TRAIL_SIZE).fill(OFFSET);
            trailNeedsReset = false;
        }

        const drawPoint =  new Point(sinesX.finalPos.x, sinesY.finalPos.x);

        for(let i = 0; i < SUBSTEP; i++){
            const tt = timestep * i;
            arrowsX = sinesX.getArrows(timestamp + tt);
            arrowsY = sinesY.getArrows(timestamp + tt);
            trailQueue.shift();
            trailQueue.push(drawPoint.add(OFFSET));
        }
        drawArrows(arrowsX, arrowsY, drawPoint.add(OFFSET));
        //console.log(arrowsX);
        // const lastPtX = lastArrowX.dst.x;
        // const lastPtY = lastArrowX.dst.y;
        // const finalPoint = new Point(lastPtX, lastPtY);
        // ctx.fillStyle = "#fff";
        // ctx.fillRect(finalPoint.x - 4, finalPoint.y + 496, 8, 8);
        //console.log(finalPoint);
    }
        
    // ctx.fillStyle = 'black';
    // ctx.fillRect(0,0,canvas.width,canvas.height);

    requestAnimationFrame(mainLoop);
}

mainLoop();