export class UIHooks {
    //updator functions
    constructor(
        setSines,
        setPercentSpeed,
        setPercentTrail,
        setSubsteps
    ){
        this.list = [setSines, setPercentSpeed, setPercentTrail, setSubsteps];
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

    constructor(hooks){
        this.hooks = hooks;
        this.openSettingsSpan = document.getElementById("open-settings");
        this.openSettingsPane = UI.getFirstElementByClassName(document, "open");
        this.closeSettingsSpan = document.getElementById("close-settings");
        this.settingsPane = UI.getFirstElementByClassName(document, "settings");
        this.entries = Array.from(document.getElementsByClassName("entry"));
    }

    //associate hooks with their respective fields and update buttons
    static zipWidthEventListeners(entries, hooks){
        console.log(entries, hooks);
        if(entries.length !== hooks.length) {
            throw Error("There must be the same number of entries and hooks for them to be zipped together.");
        }

        const inputs = entries.map(entry => UI.getFirstElementByClassName(entry, "number"));

        const updateButtons = entries.map(entry => UI.getFirstElementByClassName(entry, "update"));

        entries.map((entry, i) => {
            updateButtons[i].addEventListener("click", () => { hooks[i](+inputs[i].value)} ); //the plus here '+inputs[i].value' is just javascript mumbo-jumbo for integer casting
        });
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

    init(){
        UI.zipWidthEventListeners(this.entries, this.hooks.getList());

        this.openSettingsSpan.addEventListener("click", () => {UI.openSettings(this.settingsPane, this.openSettingsPane);});
        
        this.closeSettingsSpan.addEventListener("click", () => {UI.closeSettings(this.settingsPane, this.openSettingsPane);});
    }
}