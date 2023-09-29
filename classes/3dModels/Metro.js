import Model3D from '/classes/3dModels/Model3D';
import * as THREE from "three";
import {v4 as uuid} from 'uuid';

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
        const animations = this.object.animations;
        this.mixer = new THREE.AnimationMixer(this.object.scene);
        this.playAnimation(animations, 1);
    }

    // function to close doors
    closeDoors() {
        //TODO: heeft nog een body nodig
        const animations = this.object.animations;
        this.mixer = new THREE.AnimationMixer(this.object.scene);
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

    /**
     * The `renderFull` function asynchronously renders a scene and then clones it, because the a metro contains 2 metro models (2 metro cars)
     * @param scene - The `scene` parameter is an object that represents the scene to be rendered.
     */
    async renderFull(scene) {
        await this.render(scene).then(() => {
            this.clone(scene, undefined, undefined, 3.1415926536);
        });
    }

    /**
     * The function `cloneFull` asynchronously clones a scene and then clones it again, because the a metro contains 2 metro models (2 metro cars)
     * @param scene - The scene parameter represents the scene object where the cloning operation will take
     * place. It could be a 3D scene or any other type of scene in the context of your application.
     * @param position - The position parameter is the desired position of the cloned object in the scene.
     * It specifies the coordinates (x, y, z) where the object should be placed.
     * determines the amount of rotation around the z-axis for the cloned object.
     */
    async cloneFull(scene, position) {
        await this.clone(scene, position).then(() => {
            this.clone(scene, position, undefined, 3.1415926536);
        });
    }

    playAnimation(animations, direction) {
        // console.log(animations);
        for (var i = 0; i < animations.length; i++) {
            var action = this.mixer.clipAction(animations[i]);
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
