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
    animationTimeline = gsap.timeline({repeat: Infinity, delay: 0, repeatDelay: 5});
    _headLight1;
    _headLight1Target;
    _headLight2;
    _headLight2Target;


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

    driveRoute(stations, isRightCarriage) {
        for (let i = 1; i < stations.length; i++) {
            this.accelerate(this.getDestinationCoordinates(stations[i], isRightCarriage));
        }
        this.animationTimeline.yoyo(true);
        this.animationTimeline.play();
    }

    // function to accelerate metro
    accelerate(endPosition, isSecondCarriage = false) {
        const objectScenes = [
            this._objectScene,
            this._headLight1,
            this._headLight1Target,
            this._headLight2,
            this._headLight2Target
        ];

        objectScenes.forEach(objectScene => {
            this.animationTimeline.to(objectScene.position, {
                x: endPosition.x,
                y: endPosition.y,
                z: endPosition.z,
                delay: 5,
                duration: Math.abs(10),
                ease: "power1.inOut",
                // onComplete: state.openDoors
            });
        });

        if (!isSecondCarriage) {
            // this.secondCarriage.accelerate(endPosition, true)
        }

    }

    getDestinationCoordinates(positionNextStation, isRightCarriage) {
        let endPosition;
        if (isRightCarriage) {
            endPosition = new THREE.Vector3(
                positionNextStation.vector.x - 5,
                positionNextStation.vector.y - 1,
                positionNextStation.vector.z,
            );
            return endPosition;
        }

        /*Left carriage*/
        endPosition = new THREE.Vector3(
            positionNextStation.vector.x - 5,
            positionNextStation.vector.y - 1,
            positionNextStation.vector.z - 6.8,
        );

        return endPosition
    }

    /**
     * Overwrites the render method from Model3D and renders a second carriage,
     */
    async render(scene) {
        let secondCarriageRotation = this._rotation;
        secondCarriageRotation[1] += Math.PI;

        await super.render(scene)
        // this.secondCarriage = await this.clone(scene, new Metro(this._position, secondCarriageRotation));

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

    /**
     * The function `renderHeadLights` adds two spotlights to a scene to simulate headlights on the metro.
     * @param scene - The scene parameter is the THREE.Scene object where you want to add the headlight
     * objects.
     * @param direction - The direction parameter is a number (either 1 or -1) that determines the direction in which the
     * headlights are pointing. It is used to calculate the position of the headlight targets.
     */
    renderHeadLights(scene, direction) {
        const headlight1Position = new THREE.Vector3(this._position.x + 24, this._position.y + 1.65, this._position.z - 1.46);
        this._headLight1Target = new THREE.Object3D();
        this._headLight1Target.position.set(headlight1Position.x + (10 * direction), headlight1Position.y, headlight1Position.z);
        scene.add(this._headLight1Target);

        const headlight2Position = new THREE.Vector3(this._position.x + 24, this._position.y + 1.65, this._position.z + 1.46);
        this._headLight2Target = new THREE.Object3D();
        this._headLight2Target.position.set(headlight2Position.x + (10 * direction), headlight2Position.y, headlight2Position.z);
        scene.add(this._headLight2Target);
        
        this._headLight1 = new THREE.SpotLight(0xfcf174);
        this._headLight1.position.copy(headlight1Position);
        this._headLight1.power = 200;
        this._headLight1.target = this._headLight1Target;
        scene.add(this._headLight1);

        this._headLight2 = new THREE.SpotLight(0xfcf174);
        this._headLight2.position.copy(headlight2Position);
        this._headLight2.power = 200;
        this._headLight2.target = this._headLight2Target;
        scene.add(this._headLight2);


        // const cubeSize = 16;
		// const cubeGeo = new THREE.BoxGeometry( cubeSize, cubeSize, cubeSize );
		// const cubeMat = new THREE.MeshPhongMaterial( { color: '#8AC' } );
		// const mesh = new THREE.Mesh( cubeGeo, cubeMat );
        // mesh.position.set(headlight1Position.x + 10, headlight1Position.y, headlight1Position.z);
		// scene.add( mesh );
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
