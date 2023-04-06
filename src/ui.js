import { Settings } from "./settings.js";

export class UIHooks {
    //updator functions
    constructor( //functions are not passed as an array to make them very deliberate
        setSines,
        setPercentSpeed,
        setScale,
        setXOffset,
        setYOffset,
        setPercentTrail,
        setSubsteps
    ){
        this.list = [setSines, setPercentSpeed, setScale, setXOffset, setYOffset, setPercentTrail, setSubsteps];
        this.list.map(f => {
            if(f === undefined || f === null) { 
                throw Error("UIHooks cannot accept undefined/null hook functions."); 
            }
        })
    }

    getList(){
        return this.list;
    }
}

export class UI {

    static STYLE_HIDDEN = "display: none;";
    static STYLE_SHOWN  = "";

    /* this class interprets interactions with the UI and edits the DOM and runs functions when state changes as required */
    /* hooks contains an object that must have a certain set of named functions inside it to run when certain update buttons are pressed*/ 

    constructor(setterHooks, getterHooks){
        //both hooks collections denote the correspondance between the settings object in main and the ui fields and update boxes
        this.setterHooks = setterHooks.getList(); 
        this.getterHooks = getterHooks.getList();

        this.enabled = false;

        this.openSettingsSpan = document.getElementById("open-settings");
        this.openSettingsPane = UI.getFirstElementByClassName(document, "open");
        this.closeSettingsSpan = document.getElementById("close-settings");
        this.settingsPane = UI.getFirstElementByClassName(document, "settings");
        this.entries = Array.from(document.getElementsByClassName("entry"));
    }

    static getInputs(entries){
        return entries.map(entry => UI.getFirstElementByClassName(entry, "number"));
    }

    //stateless functions
    static openSettings(settingsPane, openSettingsPane){
        settingsPane.style = UI.STYLE_SHOWN;
        openSettingsPane.style = UI.STYLE_HIDDEN;
    }

    static closeSettings(settingsPane, openSettingsPane){
        settingsPane.style = UI.STYLE_HIDDEN;
        openSettingsPane.style = UI.STYLE_SHOWN;
    }

    static getFirstElementByClassName(parent, name){
        return parent.getElementsByClassName(name)[0];
    }

    //returns a function which will apply the change if there is a change in value
    static applyIfChanged(f, last, curr){
        if(last !== curr){
            f();
        }
    }

    //associate hooks with their respective fields and update buttons
    zipWidthEventListeners(){
        if(this.entries.length !== this.setterHooks.length) {
            throw Error("There must be the same number of this.entries and hooks for them to be zipped together.");
        }

        const inputs = UI.getInputs(this.entries);
        const updateButtons = this.entries.map(entry => UI.getFirstElementByClassName(entry, "update"));

        this.entries.map((entry, i) => {
            updateButtons[i].addEventListener("click", 
            () => UI.applyIfChanged(
                () => this.setterHooks[i](+inputs[i].value),
                this.getterHooks[i](),
                +inputs[i].value
            )); 
        });//the plus here '+inputs[i].value' is just javascript mumbo-jumbo for integer casting
    }

    init(){
        this.zipWidthEventListeners();

        this.openSettingsSpan.addEventListener("click", () => {UI.openSettings(this.settingsPane, this.openSettingsPane);});
        
        this.closeSettingsSpan.addEventListener("click", () => {UI.closeSettings(this.settingsPane, this.openSettingsPane);});
    }

    reset(){
        UI.getInputs(this.entries).map((input, i) => input.value = this.getterHooks[i]());
        this.enabled = true; //is enabled forever more
    }
}