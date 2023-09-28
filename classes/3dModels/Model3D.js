import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default class Model3D {
    filePath;
    position;
    rotation;

    constructor(filePath = null) {
        this.filePath = filePath;

        /*Ja, dit is helaas hoe dat werkt in Javascript*/
        if (this.constructor === Model3D) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }


/**
 * The function loads a GLTF file using the GLTFLoader and adds the loaded scene to the provided scene
 * object.
 * @param scene - The scene parameter is the THREE.Scene object where you want to add the loaded GLTF
 * model.
 */
    render(scene) {
        const loader = new GLTFLoader();

        loader.load(
            // resource URL
            this.filePath,
            // called when the resource is loaded
            (gltf) => { // Gebruik een arrow-functie om de juiste 'this' context te behouden
                gltf.animations; // Array<THREE.AnimationClip>
                gltf.scene; // THREE.Group
                gltf.scenes; // Array<THREE.Group>
                gltf.cameras; // Array<THREE.Camera>
                gltf.asset; // Object
                gltf.scene.position.copy(this.position);
                scene.add(gltf.scene);
            }
        );
    }

    // function to check if user is colliding with object
    isColliding() {
        //TODO: heeft nog een body nodig
        throw new Error("Method 'isColliding()' must be implemented.");
    }
}
