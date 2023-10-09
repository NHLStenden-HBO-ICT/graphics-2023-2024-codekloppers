import * as THREE from "three";
import Model3D from '/classes/3dModels/Model3D';
import {WebGLRenderList as boundingBoxes} from "three/src/renderers/webgl/WebGLRenderLists";

export class Station extends Model3D {
    #name;
    #metroArrivingTimes;
    #sceneController;
    filePath = "/assets/3d/station.glb";

    constructor(sceneController, position, rotation) {
        super();
        /*Vector object*/
        this._position = position;
        this._rotation = rotation;
        this.#sceneController = sceneController;
        // console.log(sceneController.boundingBoxes)
        this.#setBoundaryBoxes()
        // this.name = name;
    }

    // function to get arrving time of metro
    getMetroArrivingTime(Metro) {
        //TODO: heeft nog een body nodig
    }

    #setBoundaryBoxes() {
        // console.log(this.#sceneController.boundingBoxes)
        this.#sceneController.boundingBoxes.push(this.setBoundingBox
        (
            this.#sceneController.scene,
            new THREE.Vector3(this._position.x + 70, this._position.y + 1, this._position.z + 8),
            new THREE.Vector3(this._position.x + -15, this._position.y - 0.041, this._position.z + 6.5),
            Math.PI / 2, 0
        )); // backwall

        this.#sceneController.boundingBoxes.push(this.setBoundingBox(
            this.#sceneController.scene,
            new THREE.Vector3(this._position.x + 70, this._position.y + 1, this._position.z + 8),
            new THREE.Vector3(this._position.x + -15, this._position.y - 0.041, this._position.z - 13),
            Math.PI / 2, 0
        )); // backwall

        this.#sceneController.boundingBoxes.push(this.setBoundingBox(
            this.#sceneController.scene,
            new THREE.Vector3(this._position.x + 60, this._position.y + 1, this._position.z + 6),
            new THREE.Vector3(this._position.x + 20, this._position.y + 0, this._position.z + 0),
            Math.PI / 2, Math.PI / 2)
        ); // left border

        this.#sceneController.boundingBoxes.push(this.setBoundingBox(
            this.#sceneController.scene,
            new THREE.Vector3(this._position.x + 60, this._position.y + 1, this._position.z + 6),
            new THREE.Vector3(this._position.x + -50, this._position.y + 0, this._position.z + 0),
            Math.PI / 2, Math.PI / 2)
        ); // right border

    }
}