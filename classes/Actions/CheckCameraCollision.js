import * as THREE from "three";

export class CheckCameraCollision {

    sceneController;
    boxSize;
    boxGeometry;
    boxMaterial;
    cameraMesh;
    isColliding = false;
    previousCameraPosition;

    constructor(sceneController) {
        this.sceneController = sceneController;
        this.previousCameraPosition = new THREE.Vector3();

        // Voeg cameraMesh toe aan de scene
        this.boxSize = new THREE.Vector3(1, 1, 1);
        this.boxGeometry = new THREE.BoxGeometry(this.boxSize.x, this.boxSize.y, this.boxSize.z);
        this.boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0 });
        this.cameraMesh = new THREE.Mesh(this.boxGeometry, this.boxMaterial);
        this.sceneController.scene.add(this.cameraMesh);
    }

    checkCameraCollision() {
        if (!this.sceneController.cameraSpawned) {
            // If the user is not spawned yet, do nothing
            return;
        }

        this.#updateMatrixes();
        this.#setBoxes();
        this.#setCameraMesh(); // Voeg deze regel toe
        this.#checkIsColliding();
        this.#handleIsColliding();
    }

    #updateMatrixes() {
        this.sceneController.camera.updateMatrixWorld();
        this.sceneController.camera.updateMatrix();
        this.sceneController.camera.updateProjectionMatrix();
        this.sceneController.camera.updateWorldMatrix();
    }

    #setBoxes() {
        this.boxSize = new THREE.Vector3(1, 1, 1);
        this.boxGeometry = new THREE.BoxGeometry(this.boxSize.x, this.boxSize.y, this.boxSize.z);
        this.boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0 });
        this.cameraMesh = new THREE.Mesh(this.boxGeometry, this.boxMaterial);
    }

    #setCameraMesh() {
        this.cameraMesh.position.set(
            this.sceneController.camera.position.x,
            this.sceneController.camera.position.y,
            this.sceneController.camera.position.z
        );
    }

    #checkIsColliding() {
        this.isColliding = false; // Stel in het begin in op false

        for (let i = 0; i < this.sceneController.boundingBoxes.length; i++) {
            const boxBoundingBox = new THREE.Box3().setFromObject(this.sceneController.boundingBoxes[i]);
            const boxBoundingCamera = new THREE.Box3().setFromObject(this.cameraMesh);

            if (boxBoundingBox.intersectsBox(boxBoundingCamera)) {
                if (this.#checkIfWalkingUpStairs(i)) {
                    // Als het een trap is, pas de camera aan en blijf isColliding op false
                } else {
                    this.isColliding = true; // Als het geen trap is, stel isColliding in op true
                }
            }
        }
    }


    #checkIfWalkingUpStairs(i) {
        if (this.sceneController.boundingBoxes[i]["name"] === "leftStair" ||
            this.sceneController.boundingBoxes[i]["name"] === "rightStair") {
            if (this.sceneController.user.moveForward) {
                this.sceneController.camera.position.y += 0.1;
            }
            return true;
        }
        return false
    }

    #handleIsColliding() {
        if (this.isColliding) {
            // Reset de positie van de camera naar de vorige positie
            this.sceneController.camera.position.copy(this.previousCameraPosition.clone());
            // this.sceneController.user.speed = 0; // Stel snelheid in op 0 om te voorkomen dat de camera door de muur gaat
        } else {
            // Als er geen collision is, update de vorige positie van de camera
            this.previousCameraPosition.copy(this.sceneController.camera.position);
            // this.sceneController.user.speed = 0.8;
        }
    }
}
