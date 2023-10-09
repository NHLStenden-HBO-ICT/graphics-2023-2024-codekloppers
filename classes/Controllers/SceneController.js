import * as THREE from "three";
import {User} from "../User";
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';


export class SceneController {
    scene;
    camera;
    renderer;
    controls;
    user;
    boundingBoxes;
    previousCameraPosition;

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 300);
        this.camera.position.set(100, 2, 50);
        this.boundingBoxes = [];
        this.user = new User();
        this.setRenderer();
        // this.setControls();
        this.previousCameraPosition = new THREE.Vector3();
        this.setAmbientLight();

        // set bounding boxes for station alleen niet op de juiste plek?
        this.boundingBoxes.push(this.setBoundingBox(new THREE.Vector3(70, 1, 8), new THREE.Vector3(-15,-0.041,6.5), Math.PI / 2,0)); // backwall
        this.boundingBoxes.push(this.setBoundingBox(new THREE.Vector3(70, 1, 8), new THREE.Vector3(-15,-0.041,-13), Math.PI / 2,0)); // backwall

        this.boundingBoxes.push(this.setBoundingBox(new THREE.Vector3(60, 1, 6), new THREE.Vector3(20,0,0), Math.PI / 2, Math.PI / 2)); // left border
        this.boundingBoxes.push(this.setBoundingBox(new THREE.Vector3(60, 1, 6), new THREE.Vector3(-50,0,0), Math.PI / 2, Math.PI / 2)); // right border
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
        this.camera.rotation.set(0, Math.PI / + 2, 0);
        this.controls.update();
    }

    setAmbientLight() {
        const light = new THREE.AmbientLight(0x404040, 100);
        this.scene.add( light );
    }

    // Functie om de bounding box van een object te maken
    setBoundingBox(geometryVector, positionVector, rotationX,rotationZ) {
        const geometry = new THREE.BoxGeometry(geometryVector.x, geometryVector.y, geometryVector.z);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 , transparent: true , opacity: 0.0}); //
        const box = new THREE.Mesh(geometry, material);
        box.position.set(positionVector.x, positionVector.y, positionVector.z);
        box.rotation.x = rotationX;
        box.rotation.z = rotationZ;
        // Voeg de bounding box toe aan de scene
        this.scene.add(box);

        return box;
    }


/**
 * The function checks for collision between the camera and a list of bounding boxes, and adjusts the
 * user's speed accordingly.
 */
    checkCameraCollision() {
        this.camera.updateMatrixWorld();
        this.camera.updateMatrix();
        this.camera.updateProjectionMatrix;
        this.camera.updateWorldMatrix();

        const boxSize = new THREE.Vector3(1, 1, 1);
        const boxGeometry = new THREE.BoxGeometry(boxSize.x, boxSize.y, boxSize.z);
        const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0 });
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

        boxMesh.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);

        let isColliding = false;

        for (let i = 0; i < this.boundingBoxes.length; i++) {
            const boxBoundingBox = new THREE.Box3().setFromObject(this.boundingBoxes[i]);
            const boxBoundingCamera = new THREE.Box3().setFromObject(boxMesh);

            // console.log(boxBoundingBox);

            if (boxBoundingCamera.intersectsBox(boxBoundingBox)) {
                isColliding = true;
                break;
            }
        }

        if (isColliding) {
                // Reset de positie van de camera naar de vorige positie
                // this.camera.position.copy(this.previousCameraPosition.roundToZero());
                this.user.speed = -1; // Stel snelheid in op 0 om te voorkomen dat de camera door de muur gaat

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