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
const POINTS = 200;

let dt, pt;
let trailQueue = Array(TRAIL_SIZE).fill(new Complex());
let trailNeedsReset = false;

const pts = new Points(POINTS);
let sines, arrows;

const state = new State(SCALE, OFFSET, (transform) => {
    pts.generate();

    console.log(pts);
    sines = new Sines(DFT.apply(pts.getPoints()));
    console.log(sines);

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

    // ctx.fillStyle = "#00f";
    // ctx.beginPath();
    // ctx.arc(drawPoint.re, drawPoint.im, 3, 0, 2 * Math.PI);
    // ctx.fill(); 
    // ctx.strokeStyle = "#00f";
    // ctx.beginPath();
    // ctx.lineWidth = 3;
    // ctx.rect(drawPoint.re - 20, drawPoint.im - 20, 40, 40);
    // ctx.stroke(); 
}

function mainLoop(timestamp){

    dt = timestamp - pt;
    pt = timestamp;

    ctx.fillStyle = "#000";
    ctx.fillRect(0,0,1000,1000);

    pts.getPoints().map((pt) => {
        ctx.fillStyle = "#252";
        const tPt = Points.transformPoint(pt, state.transform);
        ctx.fillRect(tPt.re - 4, tPt.im - 4, 8, 8);
    });


    if(pts.isLoaded()){
        //let colour = 0;
        ctx.strokeStyle = COLOURS[0];
        ctx.lineWidth = 2;
        ctx.beginPath();
        // let unevenCount = 0;
        const points = pts.getPoints();
        for(let i = 0; i <= points.length; i++){
            const pt = Points.transformPoint(points[i % points.length], state.transform);
            ctx.lineTo(pt.re, pt.im);
        }
        ctx.stroke();
    }

    if(pts.isLoaded()){
        const timestep = dt / SUBSTEP;
        if(trailNeedsReset){
            trailQueue = Array(TRAIL_SIZE).fill(OFFSET);
            trailNeedsReset = false;
        }

        const drawPoint = new Complex(sines.finalPos.re, sines.finalPos.im);

        for(let i = 0; i < SUBSTEP; i++){
            const tt = timestep * i;
            arrows = sines.getArrows(timestamp + tt).map(a => Points.transformPoint(a, state.transform));
            trailQueue.shift();
            trailQueue.push(drawPoint.add(OFFSET));
        }
        //console.log(arrows);
        drawArrows(arrows, drawPoint.add(OFFSET));
        //console.log(arrowsX);
        // const lastPtX = lastArrowX.dst.re;
        // const lastPtY = lastArrowX.dst.im;
        // const finalPoint = new Point(lastPtX, lastPtY);
        // ctx.fillStyle = "#fff";
        // ctx.fillRect(finalPoint.re - 4, finalPoint.im + 496, 8, 8);
        //console.log(finalPoint);
    }
        
    // ctx.fillStyle = 'black';
    // ctx.fillRect(0,0,canvas.width,canvas.height);

    requestAnimationFrame(mainLoop);
}

mainLoop();