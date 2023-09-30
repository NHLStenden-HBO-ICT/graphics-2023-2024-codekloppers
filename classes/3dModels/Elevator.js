import * as THREE from "three";
import Model3D from '/classes/3dModels/Model3D';

export class Elevator extends Model3D {
    currentFloor;
    filePath = "/assets/3d/ubahn.glb";

    constructor(position, object) {
        super();
        this.position = position;
        this._object = object;
    }

    // function to open doors
    openDoors() {
        //TODO: heeft nog een body nodig
    }

    // function to close doors
    closeDoors() {
        //TODO: heeft nog een body nodig
    }

    // function to move elevator up
    moveUp() {

    }

    // function to move elevator down
    moveDown() {

    }
}