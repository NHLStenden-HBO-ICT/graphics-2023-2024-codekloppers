import * as THREE from "three";
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';


export class SceneController {
    scene;
    camera;
    renderer;
    controls;

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 1000);
        this.setRenderer();
        this.setControls();
        this.setAmbientLight();
    }

    setRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, gammaOutput: true, premultipliedAlpha: false });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.needsUpdate=true;

        // this.renderer.outputColorSpace = THREE.sRGBEncoding;
        this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
        const canvas = document.getElementById('sceneCanvas');
        canvas.appendChild(this.renderer.domElement);
    }

    setControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.camera.position.set(0, 20, 100);
        this.controls.update();
    }

    setAmbientLight() {
        const light = new THREE.AmbientLight(0x404040, 100);
        light.shadowMapWidth = 1024; // default is 512
        light.shadowMapHeight = 1024; // default is 512
        this.scene.add( light );
    }

    hideLoader() {
        document.getElementById("loader").style.display = "none";
        document.getElementById("sceneCanvas").style.display = "block";
    }
}