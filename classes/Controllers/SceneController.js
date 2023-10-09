import * as THREE from "three";
import {User} from "../User";
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';


export class SceneController {
    scene;
    camera;
    renderer;
    controls;
    user;

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(110, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.rotation.set(0, Math.PI / + 2, 0);
        this.camera.position.set(100, 1.5, 50);

        this.user = new User();
        this.setRenderer();
        // this.setControls();
        // this.setAmbientLight();
    }

    setRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, gammaOutput: true, premultipliedAlpha: false });
        // this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // this.renderer.needsUpdate=true;
        // this.renderer.outputColorSpace = THREE.sRGBEncoding;
        // this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
        const canvas = document.getElementById('sceneCanvas');
        canvas.appendChild(this.renderer.domElement);
    }

    setControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.controls.update();
    }

    setAmbientLight() {
        const light = new THREE.AmbientLight(0x404040, 100);
        this.scene.add( light );
    }

    hideLoader() {
        document.getElementById("loader").style.display = "none";
        document.getElementById("sceneCanvas").style.display = "block";
    }
}