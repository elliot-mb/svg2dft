import { State } from "./state.js";
import { Points } from "./points.js";
import { DFT } from "./dft.js";
import { Sines } from "./sines.js";
import { Complex } from "./complex.js";
import { UI, UIHooks } from "./ui.js";
import { Settings } from "./settings.js";

var canvas = document.getElementById("canvas"); //links the script to the canvas in html
var ctx = canvas.getContext("2d"); //sets renderer context
let dt, pt;

const settings = new Settings();
console.log(settings.getTrailSize());

let trailQueue = Array(settings.getTrailSize()).fill(new Complex());
let drawingMustReset = false; 

let points = new Points(settings.getSines());
let sines, arrows;

const stateTransformHook = (transform) => {
    const offset = settings.getOffset();
    points.generate();
    points.transform(transform);
    points.transform({
        scale: new Complex(1, 0), 
        translate: new Complex(-1 * offset.re, -1 * offset.im)
    });

    sines = new Sines(DFT.apply(points.getPoints()), settings.getPercentSpeed());

    points.transform({
        scale: new Complex(1, 0),
        translate: new Complex(offset.re, offset.im)
    });

    drawingMustReset = true;
}

//UIHooks object has all hooks for settings fields IN ORDER
const ui = new UI(new UIHooks( 
    (sines) => { 
        settings.setSines(sines);
        points = new Points(sines); 
        stateTransformHook(state.getTransform());
    },
    (percentSpeed) => {
        settings.setPercentSpeed(percentSpeed);
        sines.setSpeed(percentSpeed * Sines.SPEED_SCALAR);
        settings.setTrailSize();

        drawingMustReset = true; //reset it so trail adjusts to speed dynamically
    },
    (scale) => {
        settings.setScale(scale);
        state.setScale(scale);
        stateTransformHook(state.getTransform());
    },
    (percentTrail) => {
        settings.setTrailProportion(percentTrail/100);
        settings.setTrailSize();

        drawingMustReset = true;
    },
    (substeps) => {
        settings.setSubsteps(substeps);
        settings.setTrailSize();

        drawingMustReset = true; 
    }
));

ui.init();

const state = new State(settings.getScale(), settings.getOffset(), stateTransformHook);

state.init();

function drawArrows(arrows, drawPoint){
    const count = Math.min(arrows.length, settings.getArrowCount());

    ctx.strokeStyle = "#ee2";
    ctx.lineWidth = 2;
    ctx.beginPath();
    trailQueue.map(pt => {
        ctx.lineTo(pt.re, pt.im);
    });
    ctx.stroke();

    let pos = settings.getOffset();
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

    pos = settings.getOffset();
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

    // points.getPoints().map((pt) => {
    //     ctx.fillStyle = "#131";
    //     ctx.fillRect(pt.re - 4, pt.im - 4, 8, 8);
    // });

    ctx.strokeStyle = "#511";
    ctx.lineWidth = 2;
    ctx.beginPath();
    points.getPoints().map((pt) => {
        ctx.lineTo(pt.re, pt.im);
    });
    ctx.stroke();

    if(points.isLoaded()){
        const timestep = dt / settings.getSubsteps();
        if(drawingMustReset){
            arrows = sines.getArrows(timestamp);
            trailQueue = Array(settings.getTrailSize()).fill(sines.finalPos.add(settings.getOffset()));

            drawingMustReset = false;
        }

        let drawPoint;
        
        for(let i = 0; i < settings.getSubsteps(); i++){
            const tt = timestep * i;
            arrows = sines.getArrows(timestamp + tt);
            drawPoint = sines.finalPos.add(settings.getOffset());
            trailQueue.shift();
            trailQueue.push(drawPoint);
        }

        drawArrows(arrows, drawPoint);
    }

    requestAnimationFrame(mainLoop);
}

mainLoop();