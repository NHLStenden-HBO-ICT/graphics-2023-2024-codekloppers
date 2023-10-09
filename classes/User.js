import * as THREE from "three";

export class User {
    cameraPosition;

    constructor() {
        this.cameraPosition = new THREE.Vector3();
    }

    // function to walk
    walk(camera) {
        // Voeg een event listener toe voor toetsenbordbediening
        document.addEventListener('keydown', (event) => {
            const keyCode = event.code;
            const moveVector = new THREE.Vector3(0, 0, -1); // Initieer de bewegingsvector in de richting van de camera

            // Roteer de bewegingsvector met de rotatie van de camera
            moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), camera.rotation.y);

            switch (keyCode) {
                case 'KeyW':
                    // Beweeg naar voren in de richting van de camera
                    this.cameraPosition.x += moveVector.x;
                    this.cameraPosition.z += moveVector.z;
                    break;
                case 'KeyS':
                    // Beweeg naar achteren in de richting tegengesteld aan de camera
                    this.cameraPosition.x -= moveVector.x;
                    this.cameraPosition.z -= moveVector.z;
                    break;
                case 'KeyA':
                    // Beweeg naar links, onafhankelijk van de kijkrichting
                    this.cameraPosition.x += Math.cos(camera.rotation.y) * 1; // Beweeg in de lokale x-richting
                    this.cameraPosition.z += Math.sin(camera.rotation.y) * 1; // Beweeg in de lokale z-richting
                    break;
                case 'KeyD':
                    // Beweeg naar rechts, onafhankelijk van de kijkrichting
                    this.cameraPosition.x -= Math.cos(camera.rotation.y) * 1; // Beweeg in de lokale x-richting
                    this.cameraPosition.z -= Math.sin(camera.rotation.y) * 1; // Beweeg in de lokale z-richting
                    break;
                case 'KeyQ':
                    // Roteer de camera naar links
                    camera.rotation.y += Math.PI / 180 * 3; // Draai 1 graad per toetsaanslag
                    break;
                case 'KeyE':
                    // Roteer de camera naar rechts
                    camera.rotation.y -= Math.PI / 180 * 3; // Draai 1 graad per toetsaanslag
                    break;
                case 'Space':
                    if (!isJumping) {
                        isJumping = true;
                        jumpVelocity = 0.2; // Begin snelheid van de sprong
                    }
                    break;
            }
        });
    }

    turn() {

    }
}