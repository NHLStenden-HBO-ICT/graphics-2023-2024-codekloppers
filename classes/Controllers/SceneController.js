import * as THREE from "three";
import {User} from "../User";
import { SoundController } from "./SoundController";
import {CheckCameraCollision} from "../Actions/CheckCameraCollision";

/**
 * SceneController class manages the 3D scene, camera, renderer, user, and collision detection.
 */
export class SceneController {
    #scene = new THREE.Scene(); // The three.js scene object
    #camera; // The three.js camera object
    #renderer; // The three.js renderer object
    #user; // The user object representing the player in the scene
    #boundingBoxes = []; // Array to store bounding boxes for collision detection
    #cameraSpawned; // Flag indicating whether the camera has been spawned in the scene
    #listener = new THREE.AudioListener(); // Audio listener for positional audio
    #soundController = new SoundController(this.listener); // Sound controller for managing audio
    #collision = new CheckCameraCollision(this); // Collision detection object for camera collisions

    /**
     * Constructor for the SceneController class.
     * @param {number} pixelRatio - The pixel ratio for the renderer (default is 0.5).
     * @param {boolean} antialiasing - Flag indicating whether antialiasing should be enabled (default is true).
     */
    constructor(pixelRatio = 0.5, antialiasing = true) {
        this.#setCamera(); // Set up the camera for the scene
        this.#user = new User(this); // Create the user object with the current scene controller
        this.#setRenderer(pixelRatio, antialiasing); // Set up the renderer for the scene
        this.#onWindowResize(); // Set up window resize event listener
    }

    /**
     * Private method to set up the renderer with specified parameters.
     * @param {number} [pixelRatio=0.5] - The pixel ratio for the renderer (default is 0.5).
     * @param {boolean} [antialiasing=true] - Flag indicating whether antialiasing should be enabled (default is true).
     */
    #setRenderer(pixelRatio = 0.5, antialiasing = true) {
        this.#renderer = new THREE.WebGLRenderer({
            antialias: antialiasing,
            gammaOutput: true,
            premultipliedAlpha: false
        });

        // Adjust renderer properties for performance and visual quality
        this.#renderer.setPixelRatio(pixelRatio); // Set pixel ratio for resolution
        this.#renderer.setSize(window.innerWidth, window.innerHeight); // Set renderer size to match window dimensions
        this.#renderer.autoClear = false; // Disable automatic clearing of the buffer for manual control
        this.#renderer.shadowMap.enabled = false; // Disable shadow mapping for improved performance
        this.#renderer.gammaFactor = 2.2; // Set gamma factor for proper color rendering

        // Append the renderer's DOM element to the scene canvas for rendering
        const canvas = document.getElementById('sceneCanvas');
        canvas.appendChild(this.#renderer.domElement);
    }


    getRenderer() {
        return this.#renderer;
    }

    getScene() {
        return this.#scene;
    }

    setScene(scene) {
        this.#scene = scene;
    }

    getCamera() {
        return this.#camera;
    }

    setCamera(camera) {
        this.#camera = camera;
    }

    getUser() {
        return this.#user;
    }

    getBoundingBoxes() {
        return this.#boundingBoxes;
    }

    getCameraSpawned() {
        return this.#cameraSpawned;
    }

    setCameraSpawned(cameraSpawned) {
        this.#cameraSpawned = cameraSpawned;
    }

    getSoundController() {
        return this.#soundController;
    }

    getCollision() {
        return this.#collision;
    }

    /**
     * Private method to handle window resize events and update camera aspect ratio and renderer size accordingly.
     */
    #onWindowResize() {
        window.addEventListener('resize', () => {
            this.#camera.aspect = window.innerWidth / window.innerHeight;
            this.#camera.updateProjectionMatrix();
            this.#renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    /**
     * Private method to set up the camera with specific parameters.
     */
    #setCamera() {
        this.#camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 300);
        this.#camera.position.set(0, 2, 5); // Set initial position of the camera
    }

    // Light for testing
    #setAmbientLight() {
        const light = new THREE.AmbientLight(0x404040, 100);
        this.#scene.add(light);
    }
}
