import { State } from "./state.js";
import { Points } from "./points.js";
import { DFT } from "./dft.js";
import { Sines } from "./sines.js";
import { Complex } from "./complex.js";
import { UIHooks } from "./ui.js";

var canvas = document.getElementById("canvas"); //links the script to the canvas in html
var ctx = canvas.getContext("2d"); //sets renderer context

const DEFAULT_TRAIL_PROPORTION = 1; 
const DEFAULT_SUBSTEP = 5; //must be 1 or more
const SCALE = 800;
const OFFSET = new Complex(500, 500);
const COLOURS = ["#f00", "#0f0", "#00f", "#ff0", "#0ff", "#f0f"];
const ARROW_COUNT = 500;
const DEFAULT_SINES = 100;

const settingsState = {
    substep: DEFAULT_SUBSTEP,
    trailSize: DEFAULT_TRAIL_PROPORTION * Math.round((DEFAULT_SUBSTEP / 2.5) / (Sines.DEFAULT_PERCENTAGE * Sines.SPEED_SCALAR)),
    trailProportion: DEFAULT_TRAIL_PROPORTION,
    sines: DEFAULT_SINES, 
    percentSpeed: Sines.DEFAULT_PERCENTAGE
}


let dt, pt;
let trailQueue = Array(settingsState.trailSize).fill(new Complex());
let trailNeedsReset = false;

let pts = new Points(DEFAULT_SINES);
let sines, arrows;

const stateTransformHook = (transform) => {
    pts.generate();
    pts.transform(transform);
    pts.transform({
        scale: new Complex(1, 0), 
        translate: new Complex(-1 * OFFSET.re, -1 * OFFSET.im)
    });

    sines = new Sines(DFT.apply(pts.getPoints()), settingsState.percentSpeed);

    pts.transform({
        scale: new Complex(1, 0),
        translate: new Complex(OFFSET.re, OFFSET.im)
    });

    trailNeedsReset = true;
}

const state = new State(SCALE, OFFSET, stateTransformHook, 
    new UIHooks(
        (sines) => { 
            settingsState.sines = sines;
            pts = new Points(sines); 
            stateTransformHook(state.transform);
        },
        (percentSpeed) => {
            settingsState.percentSpeed = percentSpeed;

            sines.speed = percentSpeed * Sines.SPEED_SCALAR;

            if(percentSpeed < 1){
                settingsState.trailSize = 1;
            }else{
                settingsState.trailSize = settingsState.trailProportion * Math.round((settingsState.substep / 2.5) / (percentSpeed * Sines.SPEED_SCALAR));
            }

            console.log(settingsState.trailSize, percentSpeed);

            trailNeedsReset = true; //reset it so trail adjusts to speed dynamically
        }
    ));

state.init();

function drawArrows(arrows, drawPoint){
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

    ctx.strokeStyle = "#511";
    ctx.lineWidth = 2;
    ctx.beginPath();
    pts.getPoints().map((pt) => {
        ctx.lineTo(pt.re, pt.im);
    });
    ctx.stroke();

    if(pts.isLoaded()){
        const timestep = dt / settingsState.substep;
        if(trailNeedsReset){
            arrows = sines.getArrows(timestamp);
            trailQueue = Array(settingsState.trailSize).fill(sines.finalPos.add(OFFSET));
            trailNeedsReset = false;
        }

        let drawPoint;
        
        for(let i = 0; i < settingsState.substep; i++){
            const tt = timestep * i;
            arrows = sines.getArrows(timestamp + tt);
            drawPoint = sines.finalPos.add(OFFSET);
            trailQueue.shift();
            trailQueue.push(drawPoint);
        }

        drawArrows(arrows, drawPoint);
    }

    requestAnimationFrame(mainLoop);
}

mainLoop();