import Model3D from '/classes/3dModels/Model3D';
import {gsap} from "gsap";
import * as THREE from "three";
import {v4 as uuid} from 'uuid';

/**
 * Class representing a Metro model in the 3D scene, extending Model3D.
 */
export class Metro extends Model3D {
    #id; // Unique identifier for the Metro instance
    _filePath = "/assets/3d/ubahn.glb"; // File path to the 3D model file
    #soundController; // Sound controller for managing audio effects
    #mixer; // Animation mixer for controlling animations
    #user; // User object interacting with the Metro
    #sideDoorLocations = [-3.9, -9.4, -14.9, -20.4, 3.9, 9.4, 14.9, 20.4]; // X-coordinates of side doors
    #doorsOpen = true; // Boolean flag indicating whether the doors are open
    #lastStationPosition; // Last station's position where the Metro stopped
    #isOccupiedByUser = false; // Boolean flag indicating whether the Metro is occupied by the user
    #isRightCarriage; // Boolean flag indicating whether the Metro is the right carriage
    #soundEffects = {
        'stationSound': '/assets/sound_effects/stationSound.mp3', // Sound effect for station arrival
        'driving': '/assets/sound_effects/ubahnDriving.mp3', // Sound effect for Metro movement
    }
    #animationTimeline = gsap.timeline({repeat: -1, delay: 0, yoyo: true}); // Animation timeline for Metro movement
    #lastTime = 0;
    #forward = true;


    /**
     * Constructor for Metro class.
     * @param {Object} position - Initial position of the Metro.
     * @param {Object} rotation - Initial rotation of the Metro.
     * @param {Object} soundController - Sound controller object.
     * @param {Object} user - User object interacting with the Metro.
     * @param {boolean} isRightCarriage - Boolean flag indicating whether the Metro is the right carriage.
     */
    constructor(position, rotation, soundController, user, isRightCarriage) {
        super();
        this.#id = uuid(); // Generate a unique ID for the Metro instance
        this._position = position;
        this._rotation = rotation;
        this.#soundController = soundController;
        this.#mixer = new THREE.AnimationMixer(); // Create a new animation mixer
        this.#user = user;
        this.#lastStationPosition = this._position;
        this.#isRightCarriage = isRightCarriage;
        this.#applyListeners(); // Apply event listeners for user interactions
    }

    /**
     * Apply event listeners for user interactions with the Metro.
     */
    #applyListeners() {
        document.addEventListener('keydown', (event) => {
            switch (event.code) {
                case 'KeyI':
                    this.enterWhenAllowed(); // Handle user entering the Metro
                    break;
                case 'KeyU':
                    this.leaveWhenAllowed(); // Handle user leaving the Metro
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

    /**
     * Drive the Metro along the specified route of stations.
     * @param {Array} stations - Array of station coordinates defining the route.
     */
    driveRoute(stations) {
        console.log(stations);



        let endPosition = this.#getDestinationCoordinates(stations[1], this.#isRightCarriage);
        let endPosition2 = this.#getDestinationCoordinates(stations[2], this.#isRightCarriage);

        
        
        this.#animationTimeline
            .add(this.#driveToStation(endPosition, stations[1], stations))
            .add(this.#driveToStation(endPosition2, stations[2], stations));


        this.#animationTimeline.play(); // Start the Metro animation timeline













        // Drive to each station in the forward direction
        // for (let i = 1; i < stations.length; i++) {

        //     console.log("in first for" + i);
        // }
            // this.#driveToStation(this.#getDestinationCoordinates(stations[1], this.#isRightCarriage));

        // Reverse the stations array and drive back to each station
        // stations = stations.reverse();
        // for (let i = 1; i < stations.length; i++) {
        //     this.#driveToStation(this.#getDestinationCoordinates(stations[i], this.#isRightCarriage));

        //     console.log("in second for" + i);
        // }

        // console.log(this.#animationTimeline);
        // /* Don't remove this! Because Javascript is pass by reference and not pass by value,
        //  the value being set here actually affects how the trains move */
        // stations = stations.reverse();
    }


    /**
     * Drive the Metro to the specified end position.
     * @param {Object} endPosition - End position coordinates.
     */
    #driveToStation(endPosition, endStation, stations) {
        let duration = Math.abs(10);



        let timeline = gsap.timeline();
        
        timeline.to(this._objectScene.position, {
            x: endPosition.x,
            y: endPosition.y,
            z: endPosition.z,
            delay: 6, // 13
            duration: duration,
            ease: "power1.inOut",
            // onStart: () => {
            //     console.log('departing on ' + this._objectScene.position.x);
            //     // this.#doorsOpen = false;
            //     // this._objectScene.add(this.#soundController.loadPositionalSound(this.#soundEffects.driving, 2, 1, duration));
            //     // this.#disallowUserActions();
            // },
            onUpdate: () => {
                // Update user position if inside the Metro during movement
                // if (this.#isOccupiedByUser) {
                //     this.#user.setPosition(new THREE.Vector3(this._objectScene.position.x + 8, 2, this._objectScene.position.z));
                // }

                this.#setDirection();

                stations.forEach(element => {
                    // if((this.#forward && this._objectScene.position.x < this.#getDestinationCoordinates(element, false).x - 10) && (!this.#forward && this._objectScene.position.x > this.#getDestinationCoordinates(element, false).x + 10)) {
                    //     this.#onStart();
                    // }

                    if (this.#getDestinationCoordinates(element, false) == this.#getDestinationCoordinates(endStation, false)) {
                        if(this._objectScene.position.x == this.#getDestinationCoordinates(element, false).x) {
                            this.#onStart();
                        }
                    }
                });
            },
            onComplete: () => {
                console.log('arrival on ' + this._objectScene.position.x);
                // this.#lastStationPosition = endPosition;
            },
            onRepeat: () => {
                console.log('repeating on ' + this._objectScene.position.x);
            },
            onReverseComplete: () => {
                console.log('reverse arrival on ' + this._objectScene.position.x);
            },
            onInterrupt: () => {
                console.log('interrupted on ' + this._objectScene.position.x);
            },
        });

        return timeline;




        // Execute onStart callback before the delay, every time the Metro is on the station
        // this.#animationTimeline.to({}, {
        //     onStart: () => {
        //         this.#onInStation(); // Handle Metro arriving at a station
        //     }
        // });

        // Animate Metro movement to the end position
    }

    #setDirection() {
        var newTime = this.#animationTimeline.time();
        if ((this.#forward && newTime < this.#lastTime) || (!this.#forward && newTime > this.#lastTime)) {
            this.#forward = !this.#forward;
        }
        this.#lastTime = newTime;
    }
    
    #onStart() {
        console.log('departed on ' + this._objectScene.position.x);
    }    

    /**
    * Handle Metro arrival at a station.
    */
    #onInStation() {
        console.log('on station');
        this.#doorsOpen = true;
        this.#animateDoors();
        this.#allowUserActions();
        this._objectScene.add(this.#soundController.loadPositionalSound(this.#soundEffects.stationSound, 0.5));
    }


    /**
     * Calculate the destination coordinates for the Metro based on the next station's position and carriage type.
     * @param {Object} positionNextStation - Coordinates of the next station.
     * @param {boolean} isRightCarriage - Boolean flag indicating whether the Metro is the right carriage.
     * @returns {Object} - Destination coordinates for the Metro.
     */
    #getDestinationCoordinates(positionNextStation, isRightCarriage) {
        let endPosition;
        if (isRightCarriage) {
            // Calculate destination coordinates for the right carriage
            endPosition = new THREE.Vector3(
                positionNextStation.vector.x - 5,
                positionNextStation.vector.y - 1,
                positionNextStation.vector.z
            );
            return endPosition;
        }

        // Calculate destination coordinates for the left carriage
        endPosition = new THREE.Vector3(
            positionNextStation.vector.x - 5,
            positionNextStation.vector.y - 1,
            positionNextStation.vector.z - 6.8
        );

        return endPosition;
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
     * Method to get the animation mixer of the Metro.
     * @returns {Object} - Animation mixer object.
     */
    getMixer() {
        return this.#mixer;
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

    /**
     * Continuously checks if the user is near the Metro's doors and enables corresponding interaction buttons.
     * Also handles user actions like entering and leaving the Metro when allowed.
     */
    async #allowUserActions() {
        const enterButton = document.getElementById("enterButton"); // Button for user to enter the Metro

        let lastRoundNearDoor = false;

        while (this.#doorsOpen) {
            let isNearDoor = false;
            // Check if the user is near any of the Metro's doors
            this.#sideDoorLocations.forEach(element => {
                if (this.#user.getPosition().x > this.#lastStationPosition.x + element - 1 &&
                    this.#user.getPosition().x < this.#lastStationPosition.x + element + 1 &&
                    this.#user.getPosition().z > this.#lastStationPosition.z - 4 &&
                    this.#user.getPosition().z < this.#lastStationPosition.z + 4 &&
                    this.#user.getPosition().y < 4) {
                    isNearDoor = true;
                }
            });

            if (isNearDoor) {
                // Show enter button and enable entering when clicked if user is near the door
                enterButton.addEventListener("click", () => this.enter());
                enterButton.classList.remove("hidden");
                lastRoundNearDoor = true;
            } else {
                // Hide enter button if the user is not near the door
                if (!enterButton.classList.contains("hidden") && lastRoundNearDoor == true) {
                    enterButton.classList.add("hidden");
                }
                lastRoundNearDoor = false;
            }

            if (this.#isOccupiedByUser) {
                // Show leave button and enable leaving when clicked if user is inside the Metro
                document.getElementById("leaveButton").addEventListener("click", () => this.leave());
                document.getElementById("leaveButton").classList.remove("hidden");
            }

            // Wait for 100 milliseconds before the next check
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    }

    /**
     * Disables user interaction buttons and removes corresponding event listeners when the Metro doors are closed.
     */
    #disallowUserActions() {
        // Hide enter and leave buttons and remove event listeners
        document.getElementById("enterButton").classList.add("hidden");
        document.getElementById("enterButton").removeEventListener("click", () => this.enter());
        document.getElementById("leaveButton").classList.add("hidden");
        document.getElementById("leaveButton").removeEventListener("click", () => this.leave());
    }

    /**
     * Checks if the user is near the Metro doors and allows entering when the doors are open.
     */
    enterWhenAllowed() {
        // Check if the user is near the Metro doors and the doors are open, then allow entering
        this.#sideDoorLocations.forEach(element => {
            if (this.#doorsOpen &&
                this.#user.getPosition().x > this.#lastStationPosition.x + element - 1 &&
                this.#user.getPosition().x < this.#lastStationPosition.x + element + 1 &&
                this.#user.getPosition().z > this.#lastStationPosition.z - 4 &&
                this.#user.getPosition().z < this.#lastStationPosition.z + 4 &&
                this.#user.getPosition().y < 4) {
                this.enter();
            }
        });
    }

    /**
     * Checks if the user is inside the Metro and allows leaving when the doors are open.
     */
    leaveWhenAllowed() {
        // Allow leaving if the user is inside the Metro and the doors are open
        if (this.#doorsOpen && this.#isOccupiedByUser) {
            this.leave();
        }
    }

    /**
     * Handles the user entering the Metro.
     */
    enter() {
        // Set user's position inside the Metro, disable walking, and update occupied status
        this.#user.setPosition(new THREE.Vector3(this.#lastStationPosition.x + 8, 2, this.#lastStationPosition.z));
        this.#user.disableWalking();
        this.#isOccupiedByUser = true;

        // Set a cookie to remember user's Metro occupancy status
        document.cookie = "true";

        // Hide enter button, remove its click event listener, show leave button, and add its click event listener
        document.getElementById("enterButton").classList.add("hidden");
        document.getElementById("enterButton").removeEventListener("click", () => this.enter());
        document.getElementById("leaveButton").addEventListener("click", () => this.leave());
        document.getElementById("leaveButton").classList.remove("hidden");
    }

    /**
     * Handles the user leaving the Metro.
     */
    leave() {
        // Enable user walking, set user's position outside the Metro, and update occupied status
        this.#user.enableWalking();
        this.#user.setPosition(new THREE.Vector3(this.#lastStationPosition.x + 9.4, 2, this.#lastStationPosition.z + (this.#isRightCarriage ? 3 : -3)));
        this.#isOccupiedByUser = false;

        // Set a cookie to remember user's Metro occupancy status
        document.cookie = "false";

        // Hide leave button and remove its click event listener
        document.getElementById("leaveButton").classList.add("hidden");
        document.getElementById("leaveButton").removeEventListener("click", () => this.leave());
    }
}
