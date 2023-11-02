import * as THREE from "three";

export class CheckCameraCollision {
    #sceneController;
    #boxSize;
    #boxGeometry;
    #boxMaterial;
    #cameraMesh;
    #isColliding = false;
    #previousCameraPosition;
    #walkingDownStairs = false;

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
        this.#boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0 });
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
                } else {
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

                // Check if the camera is downstairs and if the user is going up
                if (this.#sceneController.getCamera().position.y == 8.43499999999999)
                {
                    // If the camera is at the top, indicate that the user is walking down
                    this.#walkingDownStairs = true;
                } else if (this.#sceneController.getCamera().position == 2) {
                    // If the camera is downstairs, indicate that the user is walking up
                    this.#walkingDownStairs = false;
                }

            if (this.#sceneController.getUser().moveForward) {
                // If the user is moving forward
                if(this.#walkingDownStairs) {
                    // If the user is going down
                    if(this.#sceneController.getCamera().position.y == 2) {
                        // If the user is all the way down, adjust the position
                        this.#sceneController.getCamera().position.x += 2;
                        this.#walkingDownStairs = false;
                    } else {
                        // If the user is not all the way down, gradually go down
                        this.#sceneController.getCamera().position.y -= 0.0508;
                    }
                }

                if(this.#sceneController.getCamera().position.y < 8.47999999999999 && !this.#walkingDownStairs) {
                    // If the user is going up

                    if(this.#sceneController.getCamera().position.y == 8.47999999999999){
                        // If the user is all the way up, adjust the position
                        this.#sceneController.getCamera().position.x -= 2;
                    } else {
                        // If the user is not all the way up, gradually go up
                        this.#sceneController.getCamera().position.y += 0.045;
                    }
                }
            }
            return true;
        } else {
            // If it's not a stair, indicate that the user is not walking down
            this.#walkingDownStairs = false;
        }
        return false;
    }

    // Handle collision
    #handleIsColliding() {
        if (this.#isColliding) {
            // Reset the camera position to the previous position
            this.#sceneController.getCamera().position.copy(this.#previousCameraPosition.clone());
            // this.sceneController.user.speed = 0; // Set speed to 0 to prevent the camera from going through the wall
        } else {
            // If there is no collision, update the previous position of the camera
            this.#previousCameraPosition.copy(this.#sceneController.getCamera().position);
            // this.sceneController.user.speed = 0.8;
        }
    }
}
