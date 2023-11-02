import * as THREE from "three";

export class CheckCameraCollision {

    sceneController;
    boxSize;
    boxGeometry;
    boxMaterial;
    cameraMesh;
    isColliding = false;

    constructor(sceneController) {
        this.sceneController = sceneController;
    }
    
    checkCameraCollision(){
        if (!this.sceneController.cameraSpawned) {
            // If the user is not spawned yet, do nothing
            return;
        }

        this.#updateMatrixes()
        this.#setBoxes();
        this.#setCameraMesh();
        this.#checkIsColliding();
        this.#handleIsColliding()
    }
    
    #updateMatrixes() {
        this.sceneController.getCamera().updateMatrixWorld();
        this.sceneController.getCamera().updateMatrix();
        this.sceneController.getCamera().updateProjectionMatrix();
        this.sceneController.getCamera().updateWorldMatrix();
    }

    #setBoxes() {
        this.boxSize = new THREE.Vector3(1, 1, 1);
        this.boxGeometry = new THREE.BoxGeometry(this.boxSize.x, this.boxSize.y, this.boxSize.z);
        this.boxMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.0});
        this.cameraMesh = new THREE.Mesh(this.boxGeometry, this.boxMaterial);
    }

    #setCameraMesh() {
        this.cameraMesh.position.set(
            this.sceneController.getCamera().position.x,
            this.sceneController.getCamera().position.y,
            this.sceneController.getCamera().position.z
        );
    }

    #checkIsColliding() {
        for (let i = 0; i < this.sceneController.boundingBoxes.length; i++) {
            const boxBoundingBox = new THREE.Box3().setFromObject(this.sceneController.boundingBoxes[i]);
            const boxBoundingCamera = new THREE.Box3().setFromObject(this.cameraMesh);

            if (boxBoundingBox.intersectsBox(boxBoundingCamera)) {
               if(this.#checkIfWalkingUpStairs(i)) {
                   this.isColliding = false
                   break;
               }
               this.isColliding = true;
            }
        }
    }

    #checkIfWalkingUpStairs(i) {
        if(this.sceneController.boundingBoxes[i]["name"] === "leftStair" ||
            this.sceneController.boundingBoxes[i]["name"] === "rightStair")
        {
            if(this.sceneController.getUser().moveForward) {
                this.sceneController.getCamera().position.y += 0.1;
            }
            return true;
        }
        return false
    }

    #handleIsColliding() {
        if (this.isColliding) {
            // Reset de positie van de camera naar de vorige positie
            this.sceneController.getCamera().position.copy(this.sceneController.previousCameraPosition);
            this.sceneController.getUser().speed = 0; // Stel snelheid in op 0 om te voorkomen dat de camera door de muur gaat
        } else {
            // Als er geen collision is, update de vorige positie van de camera
            this.sceneController.previousCameraPosition.copy(this.sceneController.getCamera().position);
            this.sceneController.getUser().speed = 0.8;
        }
    }
}
