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

// the following tell buttons what functions to run, and what settings attributes correspond to which fields, respectively 

//this object has all hooks for setting settings fields IN ORDER
const setterHooks = new UIHooks( 
    (sines) => { 
        settings.setSines(sines);
        points = new Points(sines); 
        makePointsHook(state.getOriginTransform());
    },
    (percentSpeed) => {
        settings.setPercentSpeed(percentSpeed);
        sines.setSpeed(percentSpeed * Sines.SPEED_SCALAR);
        settings.setTrailSize();

        drawingMustReset = true; //reset it so trail adjusts to speed dynamically
    },
    (scalePx) => {
        const scale = state.getScale(scalePx); //relative to the svg size
        settings.setScale(scale);
        trailQueue = trailQueue.map((pt) => pt
            .sub(settings.getOffset())
            .mul(new Complex(settings.getScale()/settings.getLastScale()))
            .add(settings.getOffset())
        );

    },
    (offsetXPx) => {
        const offset = settings.getOffset();
        const newOffset = new Complex(offsetXPx, offset.im);
        trailQueue = trailQueue.map((pt) => pt
            .sub(settings.getOffset())
            .add(newOffset)
        );
        settings.setOffset(newOffset);
    },
    (offsetYPx) => {
        const offset = settings.getOffset();
        const newOffset = new Complex(offset.re, offsetYPx);
        trailQueue = trailQueue.map((pt) => pt
            .sub(settings.getOffset())
            .add(newOffset)
        );
        settings.setOffset(newOffset);
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
);

//hooks to retreive the value which corresponds to their field from settings object (always a 1:1 correspondence between settings setter hooks and resetter hooks, hence the reuse of UIHooks class)
const getterHooks = new UIHooks( 
    () => settings.getSines(),
    () => settings.getPercentSpeed(),
    () => Settings.DEFAULT_SCALE_PX, // we need to use the default directly for this since our actual scale is relative to the svg
    () => settings.getOffset().re, //x coordinate like in the input
    () => settings.getOffset().im, //y coordinate like in the input
    () => settings.getTrailProportion() * 100, //turns it into a percentage, like in the input
    () => settings.getSubsteps()
)

const ui = new UI(setterHooks, getterHooks);

ui.init();

const makePointsHook = (transform) => {

    points.generate();
    points.transform(transform);

    sines = new Sines(DFT.apply(points.getPoints()), settings.getPercentSpeed());

    drawingMustReset = true;
}

//is run whenever we load a new svg, and thats it! hooks onto image upload in state
const resetHook = () => {
    settings.reset(); //set settings to defaults
    const scale = state.getScale(Settings.DEFAULT_SCALE_PX); 
    settings.setScale(scale);
    ui.reset(); //set ui fields to settings (and thus defaults)
}

const state = new State(makePointsHook, resetHook);

state.init();

function drawArrows(arrows, finalPoint){
    const count = Math.min(arrows.length, settings.getArrowCount());

    ctx.strokeStyle = "#ee2";
    ctx.lineWidth = 2;
    ctx.beginPath();
    trailQueue.map(pt => {
        ctx.lineTo(pt.re, pt.im);
    });
    ctx.stroke();

    //draws circles
    let pos = new Complex();
    ctx.strokeStyle = "#aaa";
    ctx.lineWidth = 1;
    for(let i = 0; i < count; i++){
        const ar = arrows[i];
        const len = ar.abs();
        ctx.beginPath();
        const dispPos = toDisplay(pos);
        ctx.arc(dispPos.re, dispPos.im, len * settings.getScale(), 0, 2 * Math.PI);
        ctx.stroke(); 

        pos = pos.add(ar);
    }

    //draws spinny vectors
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    pos = new Complex();
    for(let i = 0; i < count; i++){
        const ar = arrows[i];
        const dispPos = toDisplay(pos);
        ctx.lineTo(dispPos.re, dispPos.im);

        pos = pos.add(ar);
    }
    ctx.stroke();

    ctx.fillStyle = "#00f";
    ctx.beginPath();
    ctx.arc(finalPoint.re, finalPoint.im, 3, 0, 2 * Math.PI);
    ctx.fill(); 
    ctx.strokeStyle = "#00f";
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.rect(finalPoint.re - 20, finalPoint.im - 20, 40, 40);
    ctx.stroke(); 
}

//transforms coordinates around the origin into display space
function toDisplay(point){
    return point.mul(new Complex(settings.getScale())).add(settings.getOffset());
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
        const dispPt = toDisplay(pt);
        ctx.lineTo(dispPt.re, dispPt.im);
    });
    ctx.stroke();

    if(points.isLoaded()){
        const timestep = dt / settings.getSubsteps();
        if(drawingMustReset){
            arrows = sines.getArrows(timestamp);
            trailQueue = Array(settings.getTrailSize()).fill(toDisplay(sines.getFinalPos()));

            drawingMustReset = false;
        }

        let finalPoint;
        
        for(let i = 0; i < settings.getSubsteps(); i++){
            const tt = timestep * i;
            arrows = sines.getArrows(timestamp + tt);
            finalPoint = sines.getFinalPos();
            trailQueue.shift();
            trailQueue.push(toDisplay(finalPoint));
        }

        drawArrows(arrows, toDisplay(finalPoint));
    }

    requestAnimationFrame(mainLoop);
}

mainLoop();