import * as THREE from "three";
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';


export class SceneController {
    scene;
    camera;
    renderer;
    controls;

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.setRenderer();
        this.setControls();
    }

    setRenderer() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    }

    setControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.camera.position.set(0, 20, 100);
        this.controls.update();
    }

}