import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default class Model3D {
    filePath;
    position;
    rotation;
    object;
    #objectScene;

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
    async render(scene) {
        const loader = new GLTFLoader();

        await loader.loadAsync(this.filePath).then((gltf) => { // Gebruik een arrow-functie om de juiste 'this' context te behouden
            this.object = gltf; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object
            gltf.scene.position.copy(this.position);
            scene.add(gltf.scene);
            this.#objectScene = gltf.scene;
        });
    }


    // function to check if user is colliding with object
    isColliding() {
        //TODO: heeft nog een body nodig
        throw new Error("Method 'isColliding()' must be implemented.");
    }

    /**
     * The `clone` function clones a 3D model and adds it to a scene
     * @param scene - The `scene` parameter is the three.js scene object where you want to add the cloned
     * model.
     * @param position - The position parameter is an optional parameter that represents the position at
     * which the cloned object should be placed in the scene. It is a three-dimensional vector that
     * specifies the x, y, and z coordinates of the position.
     * @param rotationX - The rotation around the x-axis in radians.
     * @param rotationY - The `rotationY` parameter represents the rotation around the Y-axis (vertical
     * axis) of the cloned object.
     * @param rotationZ - The `rotationZ` parameter represents the rotation around the z-axis (in radians)
     * that you want to apply to the cloned object.
     */
    clone(scene, position, rotationX, rotationY, rotationZ) {

        let model = this.#objectScene.clone();

        if (position !== undefined) {
            model.position.copy(position);
        }
        if (rotationX !== undefined) {
            model.rotation.x = rotationX;
        }
        if (rotationY !== undefined) {
            model.rotation.y = rotationY;
        }
        if (rotationZ !== undefined) {
            model.rotation.z = rotationZ;
        }

        scene.add(model);
    }
}
