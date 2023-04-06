import {Complex} from "./complex.js";
import {UI, UIHooks} from "./ui.js";

export class State{

    static DEFAULT_SVG_ID = "default-svg";
    static DEFAULT_SVG_TEXT = '<svg xmlns="http://www.w3.org/2000/svg" width="5000" height="5000" viewBox="0 0 5000 5000"><defs><style>.cls-1 { fill-rule: evenodd; } </style></defs><path id="Form_1" data-name="Form 1" class="cls-1" d="M4409.97,247.015L1695.37,734.16V3836.79c-72.43-68.39-193.11-88.49-333.93-88.49-160.92,0-354.03,80.47-506.922,205.17-152.868,120.67-265.531,285.61-265.531,450.54,0,104.6,44.269,193.12,120.682,253.46,72.424,60.33,177.028,96.54,289.69,96.54,177.031,0,378.191-72.41,531.051-193.09,156.9-120.7,265.53-285.64,265.53-466.64V1096.73L4310.41,645.5V3367.46c-72.43-68.39-193.14-88.49-333.93-88.49-160.95,0-354.05,80.47-506.92,205.17C3316.66,3604.81,3204,3769.75,3204,3934.68c0,104.6,44.26,193.12,120.71,253.46,72.43,60.33,177.04,96.54,289.66,96.54,177.03,0,378.19-72.41,531.09-193.09,156.89-120.7,265.53-285.64,265.53-466.64Z"></path></svg>';

    constructor(makePointsHook, resetHook){
        this.file = null;
        this.fileText = null;
        this.selected = document.getElementById("selected");
        this.input = document.getElementById("file-input");
        this.svgId = "input-svg";
        this.svgBox = null;
        this.bBox = null;
        this.transform = null;
        this.makePointsHook = makePointsHook; //function to run when file changes, is run during promise
        // hook should take one argument (transform)
        this.resetHook = resetHook;
    }

    processSVGAsText(text){
        this.fileText = text;
        const centre = document.getElementById("centre-absolute");
        const lastBox = document.getElementById(this.svgId);
        if(lastBox !== null){ //remove the previous svg 
            lastBox.remove();
        }
        const svgBox = document.createElement("div");
        svgBox.setAttribute("id", this.svgId);
        svgBox.setAttribute("style", "display: none;");
        svgBox.innerHTML = text;
        centre.appendChild(svgBox);

        const paths = document.getElementsByTagName("path");
        if(paths.length === 0){
            document.getElementById(this.svgId).remove();
            centre.appendChild(lastBox); //brings back last svg file, as it failed to verify this one was drawable 
            this.setPromptAndError("Could not find paths in SVG");
        }
    
        this.svgBox = svgBox;

        const nums = /[0-9]+\.?[0-9]*/g; //match decimals 

        let width, height;
        const widthMatch = nums.exec(this.getSvg().getAttribute("width"));
        const heightMatch = nums.exec(this.getSvg().getAttribute("height"));
        if(widthMatch === null || heightMatch === null) {
            //try matching on viewBox property
            const viewBoxMatch = this.getSvg().getAttribute("viewBox").match(nums); //top left x, top left y, bottom right ...
            if(viewBoxMatch === null){
                this.setPromptAndError("SVG has non-numerical dimesions");
            }else{
                
                width = viewBoxMatch[2]; // bottom right x coord
                height = viewBoxMatch[3]; //bottom right y coord
            }
        }else{
            width = widthMatch[0];
            height = heightMatch[0];
        }

        this.bBox = { w: width, h: height };    

        this.resetHook(); //sets a new svg to default size
        this.makePointsHook(this.getOriginTransform());
    }

    //sets change function
    init(){ 
        this.input.onchange = e => { 
            //writes svg to document on update
            this.file = e.target.files[e.target.files.length - 1]; 

            if(!this.isValid()){
                this.setPromptAndError("Can only process SVGs");
            }

            this.file.text().then((text) => this.processSVGAsText(text));
            this.setPromptSuccess();
        }

        this.processSVGAsText(State.DEFAULT_SVG_TEXT);
    }

    getOriginTransform() {
        return { //honestly make a transform object
            scale: new Complex(1, 0),
            translate: new Complex(this.bBox.w / 2, this.bBox.h / 2).mul(new Complex(-1, 0))
        }
    }

    getScale(scalePx){
        const largestDim = Math.max(this.bBox.w, this.bBox.h);
        return scalePx / largestDim;
    }

    // getScreenTransform() {
    //     const largestDim = Math.max(this.bBox.w, this.bBox.h);
    //     const scaleFact = this.scale / largestDim;
    //     const diffX = this.scale - (this.bBox.w * scaleFact);
    //     const diffY = this.scale - (this.bBox.h * scaleFact);

    //     return {
    //         scale: new Complex(scaleFact, 0),
    //         translate: new Complex(this.offset.re - (this.scale/2) + (diffX / 2), this.offset.im - (this.scale/2) + (diffY / 2))
    //     }
    // }

    isValid(){
        return this.file !== null && this.file.type === "image/svg+xml";
    }

    isLoaded(){
        return this.isValid() && this.svgBox !== null && this.bBox !== null && this.transform !== null;
    }

    setPromptSuccess(){
        this.selected.textContent = "Uploaded '" + this.file.name + "'";
    }

    setPromptAndError(e){
        this.selected.textContent = "Error: " + e;
        throw Error(e); //crash (could not handle error)
    }

    getBBox(){
        return this.bBox;
    }

    getSvgBox(){
        return this.svgBox;
    }

    getSvg(){
        return this.svgBox.children[0];
    }
}