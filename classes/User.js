import * as THREE from "three";
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import {Vector3} from "three";

export class User {
    _moveVector;
    sceneController;
    controls;

    moveForward = false;
    moveBackward = false;
    moveLeft = false;
    moveRight = false;
    canJump = false;

    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
    prevTime = performance.now();
    velocity = new THREE.Vector3();
    direction = new THREE.Vector3();
    vertex = new THREE.Vector3();
    color = new THREE.Color();

    constructor(sceneController) {
        this.cameraPosition = new THREE.Vector3();
        this._moveVector = new THREE.Vector3(0, 0, -1); // Initieer de bewegingsvector in de richting van de camera
        this.sceneController = sceneController;
        this.getPointerControls();
        this.setWalkEventListeners();
    }

    getPointerControls() {
        // Maak PointerLockControls aan
       this.controls = new PointerLockControls(this.sceneController.camera, document.body);
       this.sceneController.scene.add(this.controls.getObject());
        // Voeg een event listener toe om pointer lock te activeren bij een muisklik
        document.addEventListener('click', () => {
            this.controls.lock();
        });

   }

   walk() {
       const time = performance.now();

       if ( this.controls.isLocked === true ) {
           const delta = ( time - this.prevTime ) / 1000;

           this.velocity.x -= this.velocity.x * 10.0 * delta;
           this.velocity.z -= this.velocity.z * 10.0 * delta;

           this.direction.z = Number( this.moveForward ) - Number( this.moveBackward );
           this.direction.x = Number( this.moveRight ) - Number( this.moveLeft );
           this.direction.normalize(); // this ensures consistent movements in all directions

           if ( this.moveForward || this.moveBackward ) this.velocity.z -= this.direction.z * 400.0 * delta;
           if ( this.moveLeft || this.moveRight ) this.velocity.x -= this.direction.x * 400.0 * delta;


           this.controls.moveRight( - this.velocity.x * delta );
           this.controls.moveForward( - this.velocity.z * delta );
       }

       this.prevTime = time;
   }

    // function to walk
    setWalkEventListeners() {
    document.addEventListener('keydown', (event) => {
        switch ( event.code ) {
            case 'ArrowUp':
            case 'KeyW':
                this.moveForward = true;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                this.moveLeft = true;
                break;

            case 'ArrowDown':
            case 'KeyS':
                this.moveBackward = true;
                break;

            case 'ArrowRight':
            case 'KeyD':
                this.moveRight = true;
                break;

        }
    });

        document.addEventListener('keyup', (event) => {
            switch ( event.code ) {

                case 'ArrowUp':
                case 'KeyW':
                    this.moveForward = false;
                    break;

                case 'ArrowLeft':
                case 'KeyA':
                    this.moveLeft = false;
                    break;

                case 'ArrowDown':
                case 'KeyS':
                    this.moveBackward = false;
                    break;

                case 'ArrowRight':
                case 'KeyD':
                    this.moveRight = false;
                    break;

            }
        });


  /* The code snippet `document.addEventListener("keyup", (event) => { this._moveVector.set(0, 0, 0);
  });` is adding an event listener for the "keyup" event. When a key is released, this event
  listener sets the `_moveVector` to (0, 0, 0), effectively stopping the movement in the direction
  of the camera. This allows the user to stop moving when they release the corresponding movement
  key. */
        // document.addEventListener('keyup', () => {
        //     // Stop de camera direct bij keyup
        //     this._moveVector.set(0, 0, 0);
        
        //     // Stel de exacte positie van de camera in op cameraPosition
        //     this.cameraPosition.x = sceneController.camera.position.x;
        //     this.cameraPosition.y = sceneController.camera.position.y;
        //     this.cameraPosition.z = sceneController.camera.position.z;
        // });
    }
}