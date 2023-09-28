import Model3D from '/classes/3dModels/Model3D';
import {v4 as uuid} from 'uuid';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class Metro extends Model3D {
    #id;
    filePath = "/assets/3d/ubahn.glb";

    constructor(position) {
        super();
        this.#id = uuid();
        this.position = position
    }

    // function to open doors
    openDoors() {
        //TODO: heeft nog een body nodig
        console.log('openDoors');
        // console.log(this.filePath);
    }

    // function to close doors
    closeDoors() {
        console.log('closeDoors');
    }

    // function to accelerate metro
    accelerate() {

    }

    // function to decrease speed of metro
    brake() {

    }

    // get metro id
    getID() {
        return this.#id;
    }

    // Overrides default renderer, because the metro needs to be shown two times
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

                // Second metro part
                let model2 = gltf.scene.clone();
                model2.rotation.y = 3.1415926536; // radiants
                model2.t
                scene.add(model2);
            }
        );
    }
}
