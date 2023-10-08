import * as THREE from "three";

export class User {
    cameraPosition;

    constructor() {
        this.cameraPosition = new THREE.Vector3();
    }

    // function to walk
    walk(camera) {
        //TODO: heeft nog een body nodig
        // Voeg een event listener toe voor lopen en draaien
        document.addEventListener('keydown', (event) => {
            const keyCode = event.code;
            switch (keyCode) {
                case 'KeyW':
                    this.cameraPosition.z -= 0.8;
                    break;
                case 'KeyS':
                    this.cameraPosition.z += 0.8;
                    break;
                case 'KeyA':
                    this.cameraPosition.x -= 0.8;
                    break;
                case 'KeyD':
                    this.cameraPosition.x += 0.8;
                    break;
                case 'KeyQ':
                    // Roteer de camera naar links
                    camera.rotation.y += Math.PI / 180 * 3; // Draai 3 graden
                    break;
                case 'KeyE':
                    // Roteer de camera naar rechts
                    camera.rotation.y -= Math.PI / 180 * 3; // Draai 3 graden
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