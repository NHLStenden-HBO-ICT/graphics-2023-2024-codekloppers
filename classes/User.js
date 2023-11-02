import * as THREE from "three";
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import {Vector3} from "three";

/**
 * User class representing the user in the 3D environment.
 * @class
 */
export class User {
    _moveVector; // Private variable for movement vector
    sceneController; // Reference to the scene controller
    controls; // PointerLockControls instance for user movement
    speed = 400.0;

    #walkingDisabled = false; // Private variable to disable walking
    moveForward = false; // Boolean indicating forward movement
    moveBackward = false; // Boolean indicating backward movement
    moveLeft = false; // Boolean indicating left movement
    moveRight = false; // Boolean indicating right movement
    canJump = false; // Boolean indicating if user can jump

    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10); // Raycaster for collision detection
    prevTime = performance.now(); // Previous time for delta calculation
    velocity = new THREE.Vector3(); // Velocity vector for user movement
    direction = new THREE.Vector3(); // Direction vector for user movement
    vertex = new THREE.Vector3(); // Vertex vector for raycasting
    color = new THREE.Color(); // Color object

    /**
     * Constructor for User class.
     * @constructor
     * @param {object} sceneController - The scene controller object.
     */
    constructor(sceneController) {
        this.cameraPosition = new THREE.Vector3(); // Initialize camera position vector
        this._moveVector = new THREE.Vector3(0, 0, -1); // Initialize movement vector in the direction of the camera
        this.sceneController = sceneController; // Set the scene controller reference
        this.getPointerControls(); // Initialize pointer controls for user movement
        this.setWalkEventListeners(); // Set event listeners for user movement
    }

    /**
     * Initializes PointerLockControls for user movement and adds event listener for pointer lock activation on mouse click.
     */
    getPointerControls() {
        this.controls = new PointerLockControls(this.sceneController.getCamera(), document.body); // Create PointerLockControls instance
        this.sceneController.getScene().add(this.controls.getObject()); // Add controls object to the scene
        document.addEventListener('click', () => {
            this.controls.lock(); // Add event listener to activate pointer lock on mouse click
        });
    }

    /**
     * Gets the current position of the user's camera.
     * @returns {THREE.Vector3} - The current position of the user's camera.
     */
    getPosition() {
        return this.controls.camera.position;
    }

    /**
     * Sets the position of the user's camera.
     * @param {THREE.Vector3} position - The new position to set for the user's camera.
     */
    setPosition(position) {
        this.controls.camera.position.copy(position);
    }

    /**
     * Disables user walking.
     */
    disableWalking() {
        this.#walkingDisabled = true;
    }

    /**
     * Enables user walking.
     */
    enableWalking() {
        this.#walkingDisabled = false;
    }

    /**
     * Handles user walking logic based on keyboard input and updates user position.
     * Movement is controlled by user input and delta time between frames.
     */
    walk() {
        if (!this.#walkingDisabled) {
            // console.log(this.sceneController.getCamera().position)
            const time = performance.now(); // Get the current time
            if (this.controls.isLocked === true) { // Check if the pointer lock is active
                const delta = (time - this.prevTime) / 10000; // Calculate the time difference between frames

                // Apply damping to the velocity (slows down the user's movement)
                this.velocity.x -= this.velocity.x * 10.0 * delta;
                this.velocity.z -= this.velocity.z * 10.0 * delta;

                // Determine movement direction based on user input (W, A, S, D keys)
                this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
                this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
                this.direction.normalize(); // Ensure consistent movements in all directions

                // Apply acceleration to the velocity based on movement direction
                if (this.moveForward || this.moveBackward) this.velocity.z -= this.direction.z * 400.0 * delta;
                if (this.moveLeft || this.moveRight) this.velocity.x -= this.direction.x * 400.0 * delta;

                // Update user's position by moving right and forward according to the velocity
                this.controls.moveRight(-this.velocity.x * delta);
                this.controls.moveForward(-this.velocity.z * delta);
            }
            this.prevTime = time; // Update the previous time for the next frame calculation
        }
    }

    /**
     * Sets event listeners for user movement based on keyboard input.
     */
    setWalkEventListeners() {
        document.addEventListener('keydown', (event) => {
            // Check the pressed key code
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.moveForward = true; // Set forward movement flag to true
                    this.sceneController.setCameraSpawned(true); // Notify scene controller that the camera has spawned
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.moveLeft = true; // Set leftward movement flag to true
                    this.sceneController.setCameraSpawned(true); // Notify scene controller that the camera has spawned
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.moveBackward = true; // Set backward movement flag to true
                    this.sceneController.setCameraSpawned(true); // Notify scene controller that the camera has spawned
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.moveRight = true; // Set rightward movement flag to true
                    this.sceneController.setCameraSpawned(true); // Notify scene controller that the camera has spawned
                    break;
                case 'ctrlKey':
                    this.speed = 600.0;
                break
            }
        });

    /**
     * Event listener for handling key release events.
     * Resets movement flags and velocity vector when movement keys are released.
     */
    document.addEventListener('keyup', (event) => {
        // Check the released key code
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.moveForward = false; // Stop forward movement
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.moveLeft = false; // Stop leftward movement
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.moveBackward = false; // Stop backward movement
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.moveRight = false; // Stop rightward movement
                break;

            case 'ctrlKey':
                this.speed = 400.0;
            break
        }
        this.velocity.set(0, 0, 0); // Set velocity vector to zero, stopping movement in all directions
    });

    }
}
