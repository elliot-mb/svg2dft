import { State } from "./state.js";
import { Points } from "./points.js";
import { DFT } from "./dft.js";
import { Sines } from "./sines.js";
import { Complex } from "./complex.js";

var canvas = document.getElementById("canvas"); //links the script to the canvas in html
var ctx = canvas.getContext("2d"); //sets renderer context

// console.log((DFT.apply([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])));

const TRAIL_PROPORTION = 1; 
const SUBSTEP = 5; //must be 1 or more
const TRAIL_SIZE = TRAIL_PROPORTION * Math.round((SUBSTEP / 2.5) / Sines.SPEED);
const SCALE = 800;
const OFFSET = new Complex(500, 500);
const COLOURS = ["#f00", "#0f0", "#00f", "#ff0", "#0ff", "#f0f"];
const ARROW_COUNT = 500;
const POINTS = 100;

let dt, pt;
let trailQueue = Array(TRAIL_SIZE).fill(new Complex());
let trailNeedsReset = false;

const pts = new Points(POINTS);
let sines, arrows;

const state = new State(SCALE, OFFSET, (transform) => {
    // pts.generate();
    // pts.transform(transform);
    // pts.transform({ 
    //     scale: new Complex(1, 0),
    //     translate: OFFSET.mul(new Complex(-0.5, 0))
    // });
    // const transformedPoints = pts.getPoints();
    // sines = new Sines(DFT.apply(transformedPoints));
    // console.log(pts);
    
    // console.log(sines);

    // pts.transform(
    //     { 
    //         scale: new Complex(1, 0),
    //         translate: OFFSET.mul(new Complex(0.5, 0))
    //     }
    // )


    pts.generate();
    pts.transform(transform);
    pts.transform({
        scale: new Complex(1, 0), 
        translate: new Complex(-1 * OFFSET.re, -1 * OFFSET.im)
    });

    sines = new Sines(DFT.apply(pts.getPoints()));

    pts.transform({
        scale: new Complex(1, 0),
        translate: new Complex(OFFSET.re, OFFSET.im)
    });

    trailNeedsReset = true;
});

state.init();

function drawArrows(arrows, drawPoint){
    // if(arrowsX.length !== arrowsY.length) throw Error("main.drawArrows: need equal length arrow arrays");

    const count = Math.min(arrows.length, ARROW_COUNT);

    ctx.strokeStyle = "#ee2";
    ctx.lineWidth = 2;
    ctx.beginPath();
    trailQueue.map(pt => {
        ctx.lineTo(pt.re, pt.im);
    });
    ctx.stroke();

    let pos = OFFSET;
    ctx.strokeStyle = "#aaa";
    ctx.lineWidth = 1;
    for(let i = 0; i < count; i++){
        const ar = arrows[i];
        const len = ar.abs();
        ctx.beginPath();
        ctx.arc(pos.re, pos.im, len, 0, 2 * Math.PI);
        ctx.stroke(); 
        pos = pos.add(ar);
    }

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.beginPath();

    pos = OFFSET;
    ctx.moveTo(pos.re, pos.im);

    for(let i = 0; i < count; i++){
        const ar = arrows[i];
        pos = pos.add(ar);
        ctx.lineTo(pos.re, pos.im);
    }
    ctx.stroke();

    ctx.fillStyle = "#00f";
    ctx.beginPath();
    ctx.arc(drawPoint.re, drawPoint.im, 3, 0, 2 * Math.PI);
    ctx.fill(); 
    ctx.strokeStyle = "#00f";
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.rect(drawPoint.re - 20, drawPoint.im - 20, 40, 40);
    ctx.stroke(); 
}

function mainLoop(timestamp){

    dt = timestamp - pt;
    pt = timestamp;

    ctx.fillStyle = "#000";
    ctx.fillRect(0,0,1000,1000);

    // pts.getPoints().map((pt) => {
    //     ctx.fillStyle = "#131";
    //     ctx.fillRect(pt.re - 4, pt.im - 4, 8, 8);
    // });

    ctx.strokeStyle = "#311";
    ctx.lineWidth = 2;
    ctx.beginPath();
    pts.getPoints().map((pt) => {
        ctx.lineTo(pt.re, pt.im);
    });
    ctx.stroke();

    if(pts.isLoaded()){
        const timestep = dt / SUBSTEP;
        if(trailNeedsReset){
            trailQueue = Array(TRAIL_SIZE).fill(OFFSET);
            trailNeedsReset = false;
        }

        let drawPoint = OFFSET;
        
        for(let i = 0; i < SUBSTEP; i++){
            const tt = timestep * i;
            arrows = sines.getArrows(timestamp + tt);
            drawPoint = sines.finalPos.add(OFFSET);
            trailQueue.shift();
            trailQueue.push(drawPoint);
        }

        drawArrows(arrows, drawPoint);
    }
        
    // ctx.fillStyle = 'black';
    // ctx.fillRect(0,0,canvas.width,canvas.height);

    requestAnimationFrame(mainLoop);
}

mainLoop();