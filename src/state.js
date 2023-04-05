import {Complex} from "./complex.js";
import {UI, UIHooks} from "./ui.js";

export class State{

    constructor(scale, offset, hook){
        this.file = null;
        this.fileText = null;
        this.selected = document.getElementById("selected");
        this.input = document.getElementById("file-input");
        this.svgId = "input-svg";
        this.svgBox = null;
        this.bBox = null;
        this.transform = null;
        this.scale = scale;
        this.offset = offset; //offsetation of the centre of the points

        this.hook = hook; //function to run when file changes, is run during promise
        // hook should take one argument (transform)
    }

    //sets change function
    init(){ 
        this.input.onchange = e => { 
            //writes svg to document on update
            this.file = e.target.files[e.target.files.length - 1]; 
            this.selected.textContent = this.filePrompt();

            this.file.text()
            .then((text) => {
                this.fileText = text;
                const centre = document.getElementById("centre-absolute");
                const lastBox = document.getElementById(this.svgId);
                if(lastBox !== null){
                    lastBox.remove();
                }
                const svgBox = document.createElement("div");
                svgBox.setAttribute("id", this.svgId);
                svgBox.setAttribute("style", "display: none;");
                svgBox.innerHTML = text;
                centre.appendChild(svgBox);
            
                this.svgBox = svgBox;

                const nums = /[0-9]+\.?[0-9]*/g; //match decimals 

                let width, height;
                const widthMatch = nums.exec(this.getSvg().getAttribute("width"));
                const heightMatch = nums.exec(this.getSvg().getAttribute("height"));
                if(widthMatch === null || heightMatch === null) {
                    //try matching on viewBox property
                    const viewBoxMatch = this.getSvg().getAttribute("viewBox").match(nums); //top left x, top left y, bottom right ...
                    if(viewBoxMatch === null){
                        throw Error("Error, SVG has non-numerical dimesions");
                    }else{
                        
                        width = viewBoxMatch[2]; // bottom right x coord
                        height = viewBoxMatch[3]; //bottom right y coord
                    }
                }else{
                    width = widthMatch[0];
                    height = heightMatch[0];
                }

                this.bBox = { w: width, h: height };

                this.hook(this.getTransform());
            });
        }
    }

    getTransform() {
        const largestDim = Math.max(this.bBox.w, this.bBox.h);
        const scaleFact = this.scale / largestDim;
        const diffX = this.scale - (this.bBox.w * scaleFact);
        const diffY = this.scale - (this.bBox.h * scaleFact);

        return {
            scale: new Complex(scaleFact, 0),
            translate: new Complex(this.offset.re - (this.scale/2) + (diffX / 2), this.offset.im - (this.scale/2) + (diffY / 2))
        }
    }

    isValid(){
        return this.file !== null && this.file.type === "image/svg+xml";
    }

    isLoaded(){
        return this.isValid() && this.svgBox !== null && this.bBox !== null && this.transform !== null;
    }

    filePrompt() {
        let text = ""
        if(this.isValid()){
            text = `Uploaded '${this.file.name}'`;
        }else{
            text = `'${this.file.name}' has the wrong extension, please upload a SVG file`;
        }
        return text;
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

    setScale(scale){ this.scale = scale; }
    setOffset(offset) { this.offset = offset; }
}