import * as THREE from "three";

export class User {
    _cameraPosition;
    _collision;
    _speed;
    _moveVector;

    constructor() {
        this.cameraPosition = new THREE.Vector3();
        this.speed = 0.8;
        this._moveVector = new THREE.Vector3(0, 0, -1); // Initieer de bewegingsvector in de richting van de camera
    }

    // function to walk
    walk(camera) {
        // Voeg een event listener toe voor toetsenbordbediening
        document.addEventListener('keydown', (event) => {
            this._moveVector = new THREE.Vector3(0, 0, -1); // Initieer de bewegingsvector in de richting van de camera
            const keyCode = event.code;

            // Roteer de bewegingsvector met de rotatie van de camera
            this._moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), camera.rotation.y);

            switch (keyCode) {
                case 'KeyW':
                    // Beweeg naar voren in de richting van de camera
                    this.cameraPosition.x += this._moveVector.x * this.speed;
                    this.cameraPosition.z += this._moveVector.z * this.speed;
                    break;
                case 'KeyS':
                    // Beweeg naar achteren in de richting tegengesteld aan de camera
                    this.cameraPosition.x -= this._moveVector.x * this.speed;
                    this.cameraPosition.z -= this._moveVector.z * this.speed;
                    break;
                case 'KeyA':
                    // Beweeg naar links, onafhankelijk van de kijkrichting
                    this.cameraPosition.x -= Math.cos(camera.rotation.y) * this.speed; // Beweeg in de lokale x-richting
                    this.cameraPosition.z -= Math.sin(camera.rotation.y) * this.speed; // Beweeg in de lokale z-richting
                    break;
                case 'KeyD':
                    // Beweeg naar rechts, onafhankelijk van de kijkrichting
                    this.cameraPosition.x += Math.cos(camera.rotation.y) * this.speed; // Beweeg in de lokale x-richting
                    this.cameraPosition.z += Math.sin(camera.rotation.y) * this.speed; // Beweeg in de lokale z-richting
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


  /* The code snippet `document.addEventListener("keyup", (event) => { this._moveVector.set(0, 0, 0);
  });` is adding an event listener for the "keyup" event. When a key is released, this event
  listener sets the `_moveVector` to (0, 0, 0), effectively stopping the movement in the direction
  of the camera. This allows the user to stop moving when they release the corresponding movement
  key. */
        document.addEventListener('keyup', () => {
            // Stop de camera direct bij keyup
            this._moveVector.set(0, 0, 0);

            // Stel de exacte positie van de camera in op cameraPosition
            this.cameraPosition.x = camera.position.x;
            this.cameraPosition.y = camera.position.y;
            this.cameraPosition.z = camera.position.z;
        });
    }

    turn() {

    }
}