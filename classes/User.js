import * as THREE from "three";
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

export class User {
    _cameraPosition;
    _speed;
    _moveVector;
    sceneController;
    controls;

    constructor(sceneController) {
        this.cameraPosition = new THREE.Vector3();
        this.speed = 0.8;
        this._moveVector = new THREE.Vector3(0, 0, -1); // Initieer de bewegingsvector in de richting van de camera
        this.sceneController = sceneController;
        this.getPointerControlls();
    }

    getPointerControlls() {
        // Maak PointerLockControls aan
       this.controls = new PointerLockControls(this.camera, document.body);
       this.sceneController.scene.add(this.controls.getObject());

        // Voeg een event listener toe om pointer lock te activeren bij een muisklik
        document.addEventListener('click', () => {
            this.controls.lock();
        });
   }
    
    // function to walk
    walk(sceneController) {
        
        // Voeg event listeners toe voor toetsenbordbediening
    document.addEventListener('keydown', (event) => {
        switch (event.code) {
            case 'KeyW':
                // const camera = this.camera;
                this.controls.moveForward(1);
                console.log(this.controls);
                break;
            case 'KeyS':
                this.controls.moveForward(-1);
                // moveCamera(moveBackwardVector);
                break;
            case 'KeyA':
                this.controls.moveRight(-1);
                // moveCamera(moveLeftVector);
                break;
            case 'KeyD':
                this.controls.moveRight(1);
                // moveCamera(moveRightVector);
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
            this.cameraPosition.x = sceneController.camera.position.x;
            this.cameraPosition.y = sceneController.camera.position.y;
            this.cameraPosition.z = sceneController.camera.position.z;
        });
    }

    turn() {

    }
}