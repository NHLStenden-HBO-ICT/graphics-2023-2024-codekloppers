import Model3D from '/classes/3dModels/Model3D';
import {gsap} from "gsap";
import * as THREE from "three";
import {v4 as uuid} from 'uuid';

export class Metro extends Model3D {
    #id;
    _filePath = "/assets/3d/ubahn.glb";
    #soundController;
    #mixer;
    #user;
    #sideDoorLocations = [-3.9, -9.4, -14.9, -20.4, 3.9, 9.4, 14.9, 20.4];
    #doorsOpen = true;
    #lastStationPosition;
    #isOccupiedByUser = false;
    #isRightCarriage;
    #soundEffects = {
        'stationSound': '/assets/sound_effects/stationSound.mp3',
        'driving': '/assets/sound_effects/ubahnDriving.mp3',
    }

    #animationTimeline = gsap.timeline({repeat: Infinity, delay: 0, repeatDelay: 5});


    constructor(position, rotation, soundController, user, isRightCarriage) {
        super();
        this.#id = uuid();
        this._position = position;
        this._rotation = rotation;
        this.#soundController = soundController;
        this.#mixer = new THREE.AnimationMixer();
        this.#user = user;
        this.#lastStationPosition = this._position;
        this.#isRightCarriage = isRightCarriage;
        this.#applyListeners();
    }

    #applyListeners() {
        document.addEventListener('keydown', (event) => {
            switch ( event.code ) {
                case 'KeyI':
                    this.enterWhenAllowed();
                    break;
                case 'KeyU':
                    this.leaveWhenAllowed();
                    break;
            }
        });
    }

    // function to open doors
    #animateDoors() {
        const animations = this._objectAnimations;
        this.#mixer = new THREE.AnimationMixer(this._objectScene);
        this.#playAnimation(animations);
    }

    driveRoute(stations) {

        for (let i = 1; i < stations.length; i++) {
            this.#driveToStation(this.#getDestinationCoordinates(stations[i], this.#isRightCarriage));
        }

        stations = stations.reverse()
        for (let i = 1; i < stations.length; i++) {
            this.#driveToStation(this.#getDestinationCoordinates(stations[i], this.#isRightCarriage));
        }
        /*Don't remove this! Because Javascript is pass by reference and not pass by value,
         the value being set here actually effects how the trains move*/
        stations = stations.reverse();
        this.#animationTimeline.play();
    }


    // function to #driveToStation metro
    #driveToStation(endPosition) {
        let duration = Math.abs(10);

        // Is executed before the delay
        this.#animationTimeline.to({}, {
            onStart: () => {
                this.#doorsOpen = true;
                this.#animateDoors();
                this.#allowUserActions();
                this._objectScene.add(this.#soundController.loadPositionalSound(this.#soundEffects.stationSound, 0.5));
            }
        });

        // TODO: Hier zit een grote bug in. Als de trein voor de 2e keer op een station aankomt wordt onStart nooit uitgevoerd.
        this.#animationTimeline.to(this._objectScene.position, {
            x: endPosition.x,
            y: endPosition.y,
            z: endPosition.z,
            delay: 13,
            duration: duration,
            ease: "power1.inOut",
            /*When train leaves station*/
            onStart: () => {
                console.log('vertrekt')
                this.#doorsOpen = false;
                this._objectScene.add(this.#soundController.loadPositionalSound(this.#soundEffects.driving, 2,1, duration));
                this.#disallowUserActions();
            },
            /*Anytime the train moves*/
            onUpdate: () => {
                if(this.#isOccupiedByUser) {
                    this.#user.setPosition(new THREE.Vector3(this._objectScene.position.x + 8, 2, this._objectScene.position.z));
                }
            },
            /*Triggers when train arrives at station*/
            onComplete: () => {
                console.log('arrival')
                this.#lastStationPosition = endPosition;
            },
        });

    }


    #getDestinationCoordinates(positionNextStation, isRightCarriage) {
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
     * The `#playAnimation` function plays a set of animations by creating actions for each animation and
     * then playing them.
     * @param animations - The `animations` parameter is an array of animation clips that you want to play.
     * Each animation clip represents a specific animation that can be applied to an object in a scene.
     */
    #playAnimation(animations) {
        for (let i = 0; i < animations.length; i++) {
            let action = this.#mixer.clipAction(animations[i], this._objectScene);
            action.paused = false; // Hervat de animatie

            // Zorg ervoor dat de animatie in de juiste richting wordt afgespeeld (voorwaarts)
            action.timeScale = 3;
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

    async #allowUserActions() {
        const enterButton = document.getElementById("enterButton");

        let lastRoundNearDoor = false;

        while(this.#doorsOpen) {
            let isNearDoor = false;
            this.#sideDoorLocations.forEach(element => {
                if( this.#user.getPosition().x > this.#lastStationPosition.x + element - 1
                    && this.#user.getPosition().x < this.#lastStationPosition.x + element + 1
                    && this.#user.getPosition().z > this.#lastStationPosition.z - 4
                    && this.#user.getPosition().z < this.#lastStationPosition.z + 4
                    && this.#user.getPosition().y < 4) {
                    isNearDoor = true;
                }
            });

            if(isNearDoor) {
                enterButton.addEventListener("click", () => this.enter());
                enterButton.classList.remove("hidden");
                lastRoundNearDoor = true;
            } else {
                if(!enterButton.classList.contains("hidden") && lastRoundNearDoor == true) {
                    enterButton.classList.add("hidden");
                }
                lastRoundNearDoor = false;
            }

            if(this.#isOccupiedByUser) {
                document.getElementById("leaveButton").addEventListener("click", () => this.leave());
                document.getElementById("leaveButton").classList.remove("hidden");
            }

            await new Promise((resolve) => setTimeout(resolve, 100)); // Wacht 100 ms
        }
    }

    #disallowUserActions() {
        document.getElementById("enterButton").classList.add("hidden");
        document.getElementById("enterButton").removeEventListener("click", () => this.enter());
        document.getElementById("leaveButton").classList.add("hidden");
        document.getElementById("leaveButton").removeEventListener("click", () => this.leave());
    }

    enterWhenAllowed() {
        this.#sideDoorLocations.forEach(element => {
            if( this.#doorsOpen
                && this.#user.getPosition().x > this.#lastStationPosition.x + element - 1
                && this.#user.getPosition().x < this.#lastStationPosition.x + element + 1
                && this.#user.getPosition().z > this.#lastStationPosition.z - 4
                && this.#user.getPosition().z < this.#lastStationPosition.z + 4
                && this.#user.getPosition().y < 4) {

                this.enter();
            }
        });
    }

    leaveWhenAllowed() {
        if(this.#doorsOpen && this.#isOccupiedByUser) {
            this.leave();
        }
    }

    enter() {
        this.#user.setPosition(new THREE.Vector3(this.#lastStationPosition.x + 8, 2, this.#lastStationPosition.z));
        this.#user.disableWalking();
        this.#isOccupiedByUser = true;

        document.getElementById("enterButton").classList.add("hidden");
        document.getElementById("enterButton").removeEventListener("click", () => this.enter());
        document.getElementById("leaveButton").addEventListener("click", () => this.leave());
        document.getElementById("leaveButton").classList.remove("hidden");
    }

    leave() {
        this.#user.enableWalking();
        this.#user.setPosition(new THREE.Vector3(this.#lastStationPosition.x + 9.4, 2, this.#lastStationPosition.z + (this.#isRightCarriage ? 3 : -3)));
        this.#isOccupiedByUser = false;

        document.getElementById("leaveButton").classList.add("hidden");
        document.getElementById("leaveButton").removeEventListener("click", () => this.leave());
    }
}
