import * as THREE from "three";

class Model3D {
    filePath;
    position;
    rotation;

    constructor() {
        /*Ja, dit is helaas hoe dat werkt in Javascript*/
        if (this.constructor === Model) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    // function to render object
    render() {
        //TODO: heeft nog een body nodig
    }

    // function to check if user is colliding with object
    isColliding() {
        //TODO: heeft nog een body nodig
    }
}