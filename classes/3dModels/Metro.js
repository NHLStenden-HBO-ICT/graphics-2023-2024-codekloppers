import Model3D from '/classes/3dModels/Model3D';
import * as THREE from "three";
import {v4 as uuid} from 'uuid';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class Metro extends Model3D {
    #id;
    filePath = "/assets/3d/ubahn.glb";
    animations;
    mixer;

    constructor(position) {
        super();
        this.#id = uuid();
        this.position = position
        this.mixer = new THREE.AnimationMixer();
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
    render(scene,animationMixer) {
        const loader = new GLTFLoader();
        // this.handleAnimations();

        loader.load(
            // resource URL
            this.filePath,
            // called when the resource is loaded
            (gltf) => { // Gebruik een arrow-functie om de juiste 'this' context te behouden
                this.handleAnimations(gltf);
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
                scene.add(model2);
            }
        );
    }

    handleAnimations(model3D) {
            const animations = model3D.animations;
            this.mixer = new THREE.AnimationMixer(model3D.scene);
            this.playAnimation(animations);
    }

    playAnimation(animations) {
        console.log(animations);
        for (var i = 0; i < animations.length; i++) {
            var action = this.mixer.clipAction(animations[i]);
            action.paused = false; // Hervat de animatie
            // console.log(animations[i])

            // Zorg ervoor dat de animatie in de juiste richting wordt afgespeeld (voorwaarts)
            action.timeScale = 1;
            action.setLoop(THREE.LoopOnce); // Bijvoorbeeld: speel de animatie slechts één keer
            action.clampWhenFinished = true; // Houd de animatie op het laatste frame wanneer deze is voltooid

            // Als de actie eindigt (completed) of als deze nog niet is gestart (uninitialized),
            // dan start de actie opnieuw.
            if (action._clip.tracks.length === 0 || action._clip.tracks[0].times[0] === 0) {
                action.reset();
            }
            action.play();
        }
    }


}
