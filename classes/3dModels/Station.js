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

        this.#sceneController.boundingBoxes.push(this.setBoundingBox(
            this.#sceneController.scene, // scene
            new THREE.Vector3(this._position.x + 60, this._position.y + 1, this._position.z + 6), // geometry
            new THREE.Vector3(this._position.x + 20, this._position.y + 0, this._position.z + 0), // position
            Math.PI / 2, Math.PI / 2 // rotation on x axis
            ,0
            ,0
            , 'leftBorder' //id
        )); // left border

        this.#sceneController.boundingBoxes.push(this.setBoundingBox(
            this.#sceneController.scene,
            new THREE.Vector3(this._position.x + 60, this._position.y + 2, this._position.z + 6),
            new THREE.Vector3(this._position.x + -50, this._position.y + 0, this._position.z + 0),
            Math.PI / 2, Math.PI / 2
            ,0
            ,0
            , 'rightBorder' // id
        )); // right border

        this.#sceneController.boundingBoxes.push(this.setBoundingBox
        (
            this.#sceneController.scene, // scene
            new THREE.Vector3(this._position.x + 68, this._position.y + 1, this._position.z + 8), // geometry
            new THREE.Vector3(this._position.x + -17, this._position.y - 0.041, this._position.z + 6.5), // position
            Math.PI / 2 // rotation on x axis
            ,0
            ,0
            , 'backWallLeft' // id
        )); // backwall LEFT

        this.#sceneController.boundingBoxes.push(this.setBoundingBox
        (
            this.#sceneController.scene, // scene
            new THREE.Vector3(this._position.x + 68, this._position.y + 1, this._position.z + 8), // geometry
            new THREE.Vector3(this._position.x + -17, this._position.y + 0.041, this._position.z - 13), // position
            Math.PI / 2 // rotation on x axis
            ,0
            ,0
            , 'backWallRight' // id
        )); // backwall RIGHT

    this.#sceneController.boundingBoxes.push(this.setBoundingBox
        (
            this.#sceneController.scene, // scene
            new THREE.Vector3(this._position.x + 80, this._position.y + 1, this._position.z + 18), // geometry
            new THREE.Vector3(this._position.x + -15, this._position.y - 0.041, this._position.z + 9.6), // position
            Math.PI / 2 // rotation on x axis
            ,0
            ,0
            , 'outerBackWallLeft' // id
        )); // outerBackWall Left

    this.#sceneController.boundingBoxes.push(this.setBoundingBox
        (
            this.#sceneController.scene, // scene
            new THREE.Vector3(this._position.x + 80, this._position.y + 1, this._position.z + 18), // geometry
            new THREE.Vector3(this._position.x + -15, this._position.y - 0.048, this._position.z - 16.3), // position
            Math.PI / 2 // rotation on x axis
            ,0
            ,0
            , 'outerBackWallRight'// id
        )); // outerBackWall RIGHT

    this.#sceneController.boundingBoxes.push(this.setBoundingBox
        (
            this.#sceneController.scene, // scene
            new THREE.Vector3(this._position.x + 11, this._position.y + 3, this._position.z + 0.5), // geometry
            new THREE.Vector3(this._position.x + 11, this._position.y + 4.2, this._position.z + 8), // position
            (Math.PI / 2), // rotation on x axis
            0, // rotation on z axis
            - 38.40 // rotation on y axis
            , 'leftStair'// id
        )); // LeftStair

        this.#sceneController.boundingBoxes.push(this.setBoundingBox
            (
                this.#sceneController.scene, // scene
                new THREE.Vector3(this._position.x + 11, this._position.y + 3, this._position.z + 0.5), // geometry
                new THREE.Vector3(this._position.x + 11, this._position.y + 4.2, this._position.z - 14), //  position
                (Math.PI / 2), // rotation on x axis
                0, // rotation on z axis
                - 38.40 // rotation on y axis
                , 'rightStair' // id
            )); // RightStair
    }
}