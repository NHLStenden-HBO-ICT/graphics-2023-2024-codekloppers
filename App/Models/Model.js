class Model {
    constructor() {
        /*Ja dit is helaas hoe dat werkt in Javascript*/
        if (this.constructor === Model) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

}