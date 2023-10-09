import * as THREE from "three";
import { User } from "../User";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class SceneController {
    scene;
    camera;
    renderer;
    controls;
    user;
    boundingBoxes;
    previousCameraPosition;
    cameraSpawned;

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 300);
        this.camera.position.set(100, 2, 50);
        this.previousCameraPosition = new THREE.Vector3();
        this.boundingBoxes = [];
        this.user = new User();
        this.setRenderer();
        this.setAmbientLight();
    }

    setRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, gammaOutput: true, premultipliedAlpha: false });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        const canvas = document.getElementById('sceneCanvas');
        canvas.appendChild(this.renderer.domElement);
    }

    setControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.camera.rotation.set(0, Math.PI / +2, 0);
        this.controls.update();
    }

    setAmbientLight() {
        const light = new THREE.AmbientLight(0x404040, 100);
        this.scene.add(light);
    }

    /**
     * The function checks for collision between the camera and a list of bounding boxes and adjusts the user's speed accordingly.
     */
    checkCameraCollision() {

        // console.log(this.camera.position == 1);
        if (!this.cameraSpawned) {
            // If the user is not spawned yet, do nothing
            return;
        }

        this.camera.updateMatrixWorld();
        this.camera.updateMatrix();
        this.camera.updateProjectionMatrix();
        this.camera.updateWorldMatrix();

        const boxSize = new THREE.Vector3(1, 1, 1);
        const boxGeometry = new THREE.BoxGeometry(boxSize.x, boxSize.y, boxSize.z);
        const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0 });
        const cameraMesh = new THREE.Mesh(boxGeometry, boxMaterial);

        cameraMesh.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);

        let isColliding = false;

        for (let i = 0; i < this.boundingBoxes.length; i++) {
            const boxBoundingBox = new THREE.Box3().setFromObject(this.boundingBoxes[i]);
            const boxBoundingCamera = new THREE.Box3().setFromObject(cameraMesh);

            if (boxBoundingBox.intersectsBox(boxBoundingCamera)) {
                isColliding = true;
                break;
            }
        }

        if (isColliding) {
            // Reset de positie van de camera naar de vorige positie
            this.camera.position.copy(this.previousCameraPosition);
            this.user.speed = 0; // Stel snelheid in op 0 om te voorkomen dat de camera door de muur gaat
        } else {
            // Als er geen collision is, update de vorige positie van de camera
            this.previousCameraPosition.copy(this.camera.position);
            this.user.speed = 0.8;
        }
    }

    hideLoader() {
        document.getElementById("loader").style.display = "none";
        document.getElementById("sceneCanvas").style.display = "block";
    }
}
