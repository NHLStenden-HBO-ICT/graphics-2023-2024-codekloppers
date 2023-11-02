import * as THREE from "three";
import {User} from "../User";
import { SoundController } from "./SoundController";
import {CheckCameraCollision} from "../Actions/CheckCameraCollision";

export class SceneController {
    #scene = new THREE.Scene();
    #camera;
    #renderer;
    #user;
    boundingBoxes = [];
    previousCameraPosition;
    cameraSpawned;
    listener = new THREE.AudioListener();
    soundController = new SoundController(this.listener)
    collision = new CheckCameraCollision(this);

    constructor(pixelRatio) {
        this.#setCamera();
        /*User needs to be defined after camera because User uses the camera attribute*/
        this.#user = new User(this);
        this.#setRenderer(pixelRatio);
        // this.#setAmbientLight();
        this.#onWindowResize()
    }

    #setRenderer(pixelRatio = 0.5) {
        this.#renderer = new THREE.WebGLRenderer({
            antialias: true,
            gammaOutput: true,
            premultipliedAlpha: false
        });

        // Verlaag de resolutie voor betere prestaties
        this.#renderer.setPixelRatio(pixelRatio);
        this.#renderer.setSize(window.innerWidth, window.innerHeight);
        this.#renderer.autoClear = false;
        this.#renderer.shadowMap.enabled = false;
        this.#renderer.gammaFactor = 2.2;

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

    #onWindowResize() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();

            this.#renderer.setSize( window.innerWidth, window.innerHeight );
        })
    }

    #setCamera() {
        this.#camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 300)
        this.#camera.position.set(0, 2, 5)
        this.previousCameraPosition = new THREE.Vector3();
    }

    #setAmbientLight() {
        const light = new THREE.AmbientLight(0x404040, 100);
        this.scene.add(light);
    }
}
