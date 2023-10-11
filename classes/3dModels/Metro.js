import Model3D from '/classes/3dModels/Model3D';
import {gsap} from "gsap";
import * as THREE from "three";
import {v4 as uuid} from 'uuid';

export class Metro extends Model3D {
    #id;
    filePath = "/assets/3d/ubahn.glb";
    animations;
    mixer;
    secondCarriage;

    constructor(position, rotation) {
        super();
        this.#id = uuid();
        this._position = position;
        this._rotation = rotation;
        this.mixer = new THREE.AnimationMixer();
        this.secondCarriage = null;
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
    accelerate(endPosition, isSecondCarriage = false) {
        gsap.to(this._objectScene.position, {
            x: endPosition.vector.x,
            y: endPosition.vector.y,
            z: endPosition.vector.z,
            duration: Math.abs(10),
            ease: "power1.inOut",
            // onComplete: state.openDoors
        });

        if (!isSecondCarriage) {
            this.secondCarriage.accelerate(endPosition, true)
        }

    }

    setDestinationCoordinates(positionNextStation, isRightCarriage) {
        let endPosition = positionNextStation;

        if (isRightCarriage) {
            endPosition.vector.x = endPosition.vector.x - 5;
            endPosition.vector.y = endPosition.vector.y - 1;
            return endPosition;
        }

        /*Left carriage*/
        endPosition.vector.x = endPosition.vector.x - 5;
        endPosition.vector.y = endPosition.vector.y - 1;
        endPosition.vector.z = endPosition.vector.z - 6.8;

        return endPosition
    }

    /**
     * Overwrites the render method from Model3D and renders a second carriage,
     */
    async render(scene) {
        let secondCarriageRotation = this._rotation;
        secondCarriageRotation[1] += Math.PI;

        await super.render(scene)
        this.secondCarriage = await this.clone(scene, new Metro(this._position, secondCarriageRotation));

        /*Return the object so it's easier to use */
        return this;
    }

/*    async clone(scene, newModel) {
        let model = await super.clone(scene, newModel);

        if (model.secondCarriage === null) {
            let secondCarriageRotation = this._rotation;
            secondCarriageRotation[1] += Math.PI;

            // this.secondCarriage = await this.clone(scene, new Metro(this._position, secondCarriageRotation));
        }

        return this;
    }*/

    // function to decrease speed of metro
    brake() {

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
