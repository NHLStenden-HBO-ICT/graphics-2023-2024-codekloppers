import * as THREE from "three";
import Model3D from '/classes/Model3D';

export class Metro extends Model3D {
    #id;
    filePath = "/assets/3d/ubahnTrain.glb";

    // function to open doors
    openDoors() {
        //TODO: heeft nog een body nodig
        console.log('openDoors');
        // console.log(this.filePath);
    }

    // function to close doors
    closeDoors() {
        console.log('closeDoors');
    }

    // function to accelerate metro
    accelerate() {

    }

    // function to decrease speed of metro
    brake() {

    }

    // get metro id
    getID() {

    }
}
