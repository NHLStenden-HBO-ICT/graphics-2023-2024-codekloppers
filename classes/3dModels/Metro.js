import Model3D from '/classes/3dModels/Model3D';
import {gsap} from "gsap";
import * as THREE from "three";
import {v4 as uuid} from 'uuid';

export class Metro extends Model3D {
    #id;
    filePath = "/assets/3d/ubahn.glb";
    animations;
    soundController;
    mixer;
    user;
    #sideDoorLocations = [-3.9, -9.4, -14.9, -20.4, 3.9, 9.4, 14.9, 20.4];
    doorsOpen = false;
    soundEffects = {
        'closeDoors': '/assets/sound_effects/CloseUbahnDoors.mp3',
        'driving': '/assets/sound_effects/ubahnDriving.mp3',
    }

    animationTimeline = gsap.timeline({repeat: Infinity, delay: 0, repeatDelay: 5, yoyo: true});


    constructor(position, rotation, soundController, user) {
        super();
        this.#id = uuid();
        this._position = position;
        this._rotation = rotation;
        this.soundController = soundController;
        this.mixer = new THREE.AnimationMixer();
        this.user = user;
    }

    // function to open doors
    animateDoors() {
        const animations = this._objectAnimations;
        this.mixer = new THREE.AnimationMixer(this._objectScene);
        this.playAnimation(animations);
    }

    driveRoute(stations, isRightCarriage) {

        for (let i = 1; i < stations.length; i++) {
            this.driveToStation(this.getDestinationCoordinates(stations[i], isRightCarriage));
        }

        stations = stations.reverse()
        for (let i = 1; i < stations.length; i++) {
            this.driveToStation(this.getDestinationCoordinates(stations[i], isRightCarriage));
        }
        /*Don't remove this! Because Javascript is pass by reference and not pass by value,
         the value being set here actually effects how the trains move*/
        stations = stations.reverse();
        this.animationTimeline.play();
    }


    // function to driveToStation metro
    driveToStation(endPosition) {

        const objectScenes = [
            this._objectScene,
            // this._headLight1,
            // this._headLight1Target,
            // this._headLight2,
            // this._headLight2Target
        ];
        let duration = Math.abs(10);

        // TODO: Hier zit een grote bug in. Bij het eerste station wordt onStart nooit uitgevoerd, wat alles sloopt
        objectScenes.forEach(objectScene => {

            this.animationTimeline.to(objectScene.position, {
                x: endPosition.x,
                y: endPosition.y,
                z: endPosition.z,
                delay: 6,
                duration: duration,
                ease: "power1.inOut",
                onStart: () => {
                    console.log("Vertrokken");
                    this.doorsOpen = false;
                    this.animateDoors();
                    this._objectScene.add(this.soundController.loadPositionalSound(this.soundEffects.driving, duration));
                    this.disableDrivingPossibility();
                },
                onComplete: () => {
                    console.log("Aangekomen");
                    this.doorsOpen = true;
                    this._objectScene.add(this.soundController.loadPositionalSound(this.soundEffects.closeDoors));
                    this.enableDrivingPossibility({x: endPosition.x, y: endPosition.y, z: endPosition.z});
                },
            });
        });

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
     * Overwrites the render method from Model3D,
     */
    async render(scene) {
        await super.render(scene)

        /*Return the object so it's easier to use */
        return this;
    }


    /**
     * The `playAnimation` function plays a set of animations by creating actions for each animation and
     * then playing them.
     * @param animations - The `animations` parameter is an array of animation clips that you want to play.
     * Each animation clip represents a specific animation that can be applied to an object in a scene.
     */
    playAnimation(animations) {
        for (let i = 0; i < animations.length; i++) {
            let action = this.mixer.clipAction(animations[i], this._objectScene);
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

    async enableDrivingPossibility(metroPosition) {
        console.log(metroPosition);
        // console.log(this.user.getPosition());
        const enterButton = document.getElementById("enterButton");
        enterButton.addEventListener("click", this.enter);
        document.getElementById("leaveButton").addEventListener("click", this.leave);

        document.addEventListener('keydown', (event) => {
            switch ( event.code ) {
                case 'KeyI':
                    this.enter();
                    break;
                case 'KeyU':
                    this.leave();
                    break;
            }
        });

        while(this.doorsOpen) {
            this.#sideDoorLocations.forEach(element => {
                if( this.user.getPosition().x > metroPosition.x + element - 1
                    && this.user.getPosition().x < metroPosition.x + element + 1
                    && this.user.getPosition().z > metroPosition.z - 4
                    && this.user.getPosition().z < metroPosition.z + 4) {

                    enterButton.style.display = 'flex';
                } else {
                    this.disableDrivingPossibility();
                }
            });

            await new Promise((resolve) => setTimeout(resolve, 500)); // Wacht 500 ms
        }
    }

    disableDrivingPossibility() {
        const enterButton = document.getElementById("enterButton");
        enterButton.style.display = 'none';
        enterButton.removeEventListener("click", this.enter);
        document.getElementById("leaveButton").removeEventListener("click", this.leave);

        document.removeEventListener('keydown', (event) => {
            switch ( event.code ) {
                case 'KeyI':
                    this.enter();
                    break;
                case 'KeyU':
                    this.leave();
                    break;
            }
        });
    }

    enter() {

    }

    leave() {

    }
}
