import { Sines } from "./sines.js";
import { Complex } from "./complex.js";

export class Settings{

    static DEFAULT_TRAIL_PROPORTION = 1; 
    static DEFAULT_SUBSTEPS = 5; //must be 1 or more
    static DEFAULT_SCALE = 800;
    static DEFAULT_OFFSET = new Complex(500, 500);
    //static COLOURS = ["#f00", "#0f0", "#00f", "#ff0", "#0ff", "#f0f"];
    static DEFAULT_ARROW_COUNT = 500;
    static DEFAULT_SINES = 100;
    static DEFAULT_PERCENT_SPEED = 20;
    static DEFAULT_TRAIL_SIZE = Settings.calcTrailSize(Settings.DEFAULT_TRAIL_PROPORTION, Settings.DEFAULT_SUBSTEPS, Settings.DEFAULT_PERCENT_SPEED);

    static calcTrailSize(proportion, substeps, percentSpeed){
        console.log(proportion, substeps, percentSpeed);
        return proportion * Math.round((substeps / 2.5) / (percentSpeed * Sines.SPEED_SCALAR));
    }

    constructor(){
        //all the parameters the user customises
        this.trailProportion = Settings.DEFAULT_TRAIL_PROPORTION;
        this.substeps = Settings.DEFAULT_SUBSTEPS;
        this.scale = Settings.DEFAULT_SCALE;
        this.offset = Settings.DEFAULT_OFFSET;
        this.arrowCount = Settings.DEFAULT_ARROW_COUNT;
        this.sines = Settings.DEFAULT_SINES;
        this.percentSpeed = Settings.DEFAULT_PERCENT_SPEED;
        this.trailSize = Settings.DEFAULT_TRAIL_SIZE;
    }

    getTrailProportion() { return this.trailProportion; }
    getSubsteps() { return this.substeps; }
    getScale() { return this.scale; }
    getOffset() { return this.offset; }
    getArrowCount() { return this.arrowCount; }
    getSines() { return this.sines; }
    getPercentSpeed() { return this.percentSpeed; }
    getTrailSize() { console.log(this.trailSize); return this.trailSize; }

    setTrailProportion(trailProportion) { this.trailProportion = trailProportion; }
    setSubsteps(substeps) { this.substeps = substeps; }
    setScale(scale) { this.scale = scale; }
    setOffset(offset) { this.offset = offset; }
    setArrowCount(arrowCount) {this.arrowCount = arrowCount; }
    setSines(sines) { this.sines = sines; }
    setPercentSpeed(percentSpeed) { this.percentSpeed = percentSpeed ; }
    setTrailSize() { 
        //sets according to static method
        this.trailSize = this.percentSpeed < 1 ? 1 : Settings.calcTrailSize(this.trailProportion, this.substeps, this.percentSpeed); 
    }
}