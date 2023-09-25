class Controller {
    constructor() {
        /*Ja dit is helaas hoe dat werkt in Javascript*/
        if (this.constructor === Controller) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }
}