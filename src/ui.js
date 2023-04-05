export class UIHooks {
    //updators
    constructor(sines, speed, substeps){
        if(sines === undefined || sines === null || speed === undefined || speed === null) { throw Error("UIHooks cannot accept undefined hook functions."); }
        this.list = [sines, speed, substeps];
    }

    asList(){
        return this.list;
    }
}

export class UI {

    //static settingsOpen = false;
    static STYLE_HIDDEN = "display: none;";
    static STYLE_SHOWN  = "";

    /* this class interprets interactions with the UI and edits the DOM and runs functions when state changes as required */
    /* hooks contains an object that must have a certain set of named functions inside it to run when certain update buttons are pressed*/ 

    constructor(hooks){

        this.openSettingsSpan = document.getElementById("open-settings");
        this.openSettingsPane = UI.getFirstElementByClassName(document, "open");
        this.closeSettingsSpan = document.getElementById("close-settings");
        this.settingsPane = UI.getFirstElementByClassName(document, "settings");
        
        this.entries = Array.from(document.getElementsByClassName("entry"));
        console.log(this.entries);

        // this.inputs = this.entries.map(entry => UI.getFirstElementByClassName(entry, "number"));
        // console.log(this.inputs);

        // this.updateButtons = this.entries.map(entry => UI.getFirstElementByClassName(entry, "update"));

        UI.zipWidthEventListeners(this.entries, hooks.asList());

        this.openSettingsSpan.addEventListener("click", () => {UI.openSettings(this.settingsPane, this.openSettingsPane);});
        
        this.closeSettingsSpan.addEventListener("click", () => {UI.closeSettings(this.settingsPane, this.openSettingsPane);});
    }

    //this function is absolutely beautiful <3
    static zipWidthEventListeners(entries, hooks){
        if(entries.length !== hooks.length) {
            throw Error("There must be the same number of entries and hooks for them to be zipped together.");
        }

        const inputs = entries.map(entry => UI.getFirstElementByClassName(entry, "number"));

        const updateButtons = entries.map(entry => UI.getFirstElementByClassName(entry, "update"));

        entries.map((entry, i) => {
            updateButtons[i].addEventListener("click", () => { hooks[i](+inputs[i].value)} );
        });
    }

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
}