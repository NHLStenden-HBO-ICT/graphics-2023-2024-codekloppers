import Model3D from '/classes/3dModels/Model3D';
import * as THREE from "three";
import {v4 as uuid} from 'uuid';

export class Metro extends Model3D {
    #id;
    filePath = "/assets/3d/ubahn.glb";
    animations;
    mixer;

    constructor(position, rotation) {
        super();
        this.#id = uuid();
        this._position = position;
        this._rotation = rotation;
        this.mixer = new THREE.AnimationMixer();
    }

    // function to open doors
    openDoors() {
        //TODO: heeft nog een body nodig
        const animations = this._objectAnimations;
        this.mixer = new THREE.AnimationMixer(this._objectScene);
        this.playAnimation(animations, 1);
    }

    // function to close doors
    closeDoors() {
        //TODO: heeft nog een body nodig
        const animations = this._objectAnimations;
        this.mixer = new THREE.AnimationMixer(this._objectScene);
        this.playAnimation(animations, -1);
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

    playAnimation(animations, direction) {
        // console.log(animations);
        for (let i = 0; i < animations.length; i++) {
            let action = this.mixer.clipAction(animations[i]);
            action.paused = false; // Hervat de animatie
            // console.log(animations[i])

            // Zorg ervoor dat de animatie in de juiste richting wordt afgespeeld (voorwaarts)
            action.timeScale = direction;
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
