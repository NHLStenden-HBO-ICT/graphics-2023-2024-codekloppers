import * as THREE from "three";
import {gsap} from "gsap";

export class CheckCameraCollision {
    #sceneController;
    #boxSize;
    #boxGeometry;
    #boxMaterial;
    #cameraMesh;
    #isColliding = false;
    #previousCameraPosition;
    #walkingDownStairs = false;
    #hasNotStartedAnimation = true;

    constructor(sceneController) {
        this.#sceneController = sceneController;
        this.#previousCameraPosition = new THREE.Vector3();

        // Add cameraMesh to the scene
        this.#setBoxes();
        this.#sceneController.getScene().add(this.#cameraMesh);
    }

    // Check camera collision and handle it
    checkCameraCollision() {
        if (!this.#sceneController.getCameraSpawned()) {
            // If the user is not spawned yet, do nothing
            return;
        }

        // Update matrices for the camera
        this.#updateMatrices();
        // Set the bounding boxes and the camera mesh
        this.#setBoxes();
        this.#setCameraMesh();
        // Check for collision
        this.#checkIsColliding();
        // Handle collision
        this.#handleIsColliding();
    }

    #updateMatrices() {
        // Update matrices of the camera for accurate collision detection
        this.#sceneController.getCamera().updateMatrixWorld();
        this.#sceneController.getCamera().updateMatrix();
        this.#sceneController.getCamera().updateProjectionMatrix();
        this.#sceneController.getCamera().updateWorldMatrix();
    }

    // Initialize the size and material of the bounding boxes
    #setBoxes() {
        this.#boxSize = new THREE.Vector3(1, 1, 1);
        this.#boxGeometry = new THREE.BoxGeometry(this.#boxSize.x, this.#boxSize.y, this.#boxSize.z);
        this.#boxMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.0});
        // Create a camera mesh for collision detection
        this.#cameraMesh = new THREE.Mesh(this.#boxGeometry, this.#boxMaterial);
    }

    // Set the position of the camera mesh to the position of the camera
    #setCameraMesh() {
        this.#cameraMesh.position.set(
            this.#sceneController.getCamera().position.x,
            this.#sceneController.getCamera().position.y,
            this.#sceneController.getCamera().position.z
        );
    }

    // Reset the isColliding variable and check for collision
    #checkIsColliding() {
        this.#isColliding = false;

        // Loop through all bounding boxes and check for collision
        for (let i = 0; i < this.#sceneController.getBoundingBoxes().length; i++) {
            const boxBoundingBox = new THREE.Box3().setFromObject(this.#sceneController.getBoundingBoxes()[i]);
            const boxBoundingCamera = new THREE.Box3().setFromObject(this.#cameraMesh);

            if (boxBoundingBox.intersectsBox(boxBoundingCamera)) {
                // If there is collision, check if it's a stair and adjust the variable
                if (this.#checkIfWalkingUpStairs(i)) {
                    // If it's a stair, adjust the camera and keep isColliding to false
                } else if (document.cookie === "true") {
                    // user is in train, keep isColliding to false
                }
                else {
                    // If it's not a stair, set isColliding to true
                    this.#isColliding = true;
                }
            }
        }
    }

    // Check if the user is walking up or down the stairs
    #checkIfWalkingUpStairs(i) {
        // Check if it's a stair
        if (this.#sceneController.getBoundingBoxes()[i]["name"] === "leftStair" ||
            this.#sceneController.getBoundingBoxes()[i]["name"] === "rightStair") {
            this.handleStairMovement(i);
            // return true;
        } else {
            // If it's not a stair, indicate that the user is not walking down
            this.#walkingDownStairs = false;
        }
        return false;
    }

    // Handle stair movement based on user input
    handleStairMovement() {
        // Check if the camera is downstairs and if the user is going up
        if (this.#sceneController.getCamera().position.y === 8) {
            this.#walkingDownStairs = true;
        } else if (this.#sceneController.getCamera().position.y === 2) {
            this.#walkingDownStairs = false;
        }

        if (this.#sceneController.getUser().getMoveForward()) {
            // If the user is moving forward
            this.handleStairDirection();
        }
    }

    // Handle stair direction (up or down) based on user position
    handleStairDirection() {
        if (this.#walkingDownStairs) {
            // If the user is going down
            this.handleStairDown();
        } else {
            // If the user is going up
            this.handleStairUpward();
        }
    }

    // Handle user going down the stairs
    handleStairDown() {
        if (this.#hasNotStartedAnimation) {
            gsap.to(this.#sceneController.getCamera().position, {
                x: this.#sceneController.getCamera().position.x + 11,
                y: 2,
                z: this.#sceneController.getCamera().position.z,
                // duration: 2,
                // delay: 0,
                // ease: "power1.inOut",
                onStart: () => {
                    this.#sceneController.getCamera().lookAt(
                        this.#sceneController.getCamera().position.x + 17,
                        2,
                        this.#sceneController.getCamera().position.z
                    );
                },
                onComplete: () => {
                    this.#hasNotStartedAnimation = true;
                }
            }).play();

            this.#hasNotStartedAnimation = false;
        }
    }

    // Handle user going up the stairs (upward movement)
    handleStairUpward() {
        if (this.#hasNotStartedAnimation) {
            gsap.to(this.#sceneController.getCamera().position, {
                x: this.#sceneController.getCamera().position.x - 11,
                y: 8,
                z: this.#sceneController.getCamera().position.z,
                onComplete: () => {
                    this.#hasNotStartedAnimation = true;
                }
            }).play();

            this.#hasNotStartedAnimation = false;
        }
    }

    // Handle collision
    #handleIsColliding() {
        if (this.#isColliding) {
            // Reset the camera position to the previous position
            this.#sceneController.getCamera().position.copy(this.#previousCameraPosition.clone());
        } else {
            // If there is no collision, update the previous position of the camera
            this.#previousCameraPosition.copy(this.#sceneController.getCamera().position);
        }
    }
}