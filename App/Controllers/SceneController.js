import * as THREE from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader";
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

class SceneController extends Controller {

    camera;
    scene;
    loader;
    backgroundColor;
    objects;
    renderCalls;
    renderer;

    constructor() {
        super();
        this.loader = new GLTFLoader();
        this.backgroundColor = 0x000000;
        this.objectName = 0;
        this.objects = {};
        this.renderCalls = [];
    }

    startScene() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 800);
        this.camera.position.set(20, 1, 1);

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(this.backgroundColor);

        document.body.appendChild(this.renderer.domElement);

        this.#setOrbitControls()
    }

    render() {
        requestAnimationFrame(render);
        this.renderCalls.forEach((callback) => {
            callback();
        });
    }

    #setOrbitControls(domElement) {
        let controls = new OrbitControls(this.camera, domElement);

        controls.rotateSpeed = 0.3;
        controls.zoomSpeed = 0.9;

        controls.minDistance = 3;
        controls.maxDistance = 20;

        controls.minPolarAngle = 0; // radians
        controls.maxPolarAngle = Math.PI / 2; // radians

        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        this.renderCalls.push(function () {
            controls.update()
        });
    }

    static loadModels() {
        // loadObject('Models/animation_test4.glb', 7, -1, -7, 0);
        loadObject('Models/ubahnTrain.glb', 0, 0, 0, 0);
        // loadObject('Models/ubahnStation.glb', 0,1,6.6,0);
        loadObject('Models/rail.glb', 0, 0, 0, 0);
    }
}