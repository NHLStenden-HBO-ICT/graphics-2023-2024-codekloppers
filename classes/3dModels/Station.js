import * as THREE from "three";
import Model3D from '/classes/3dModels/Model3D';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';



/**
 * Class representing a Station in the 3D scene, extending Model3D.
 */
export class Station extends Model3D {
    #name; // Name of the station (currently unused)
    #sceneController; // Scene controller for managing the station's scene
    _filePath = "/assets/3d/station.glb"; // File path to the 3D model file for the station

    /**
     * Constructor for Station class.
     * @param {Object} sceneController - Scene controller object.
     * @param {Object} position - Initial position of the station.
     * @param {Object} rotation - Initial rotation of the station.
     */
    constructor(sceneController, position, rotation, name) {
        super();
        this._position = position; // Set initial position of the station
        this._rotation = rotation; // Set initial rotation of the station
        this.#name = name; // set name of station
        this.#sceneController = sceneController; // Set the scene controller for the station
        this.#setBoundaryBoxes(); // Set boundary boxes for collision detection
    }

    /**
     * Overwrites the render method from Model3D,
     */
    async render(scene) {
        await super.render(scene);
        this.renderSign(scene,this);
    }

/**
 * The `clone` function is an asynchronous method that clones a scene and a new 3D model, and then
 * renders a sign in the new scene.
 * @param scene - The `scene` parameter is the 3D scene where the model will be cloned and rendered.
 * @param newModel3d - The `newModel3d` parameter is the new instance of the 3D model that is being
 * cloned.
 */
    async clone(scene, newModel3d) {
        await super.clone(scene, newModel3d);
        this.renderSign(scene,newModel3d);
    }
    /**
     * Sets boundary boxes for collision detection around the station's objects.
     */
    #setBoundaryBoxes() {
        // Left border boundary box to detect collision with stations left side
        this.#sceneController.getBoundingBoxes().push(this._setBoundingBox(
            this.#sceneController.getScene(), // scene
            new THREE.Vector3(60, 1, 6), // geometry
            new THREE.Vector3(this._position.x + 20, this._position.y + 0, this._position.z + 0), // position
            Math.PI / 2, Math.PI / 2 // rotation on x axis
            ,0
            ,0
            , 'leftBorder' //id
        )); // left border

        // Right border boundary box to detect collision with stations right side
        this.#sceneController.getBoundingBoxes().push(this._setBoundingBox(
            this.#sceneController.getScene(),
            new THREE.Vector3(60, 2, 6),
            new THREE.Vector3(this._position.x + -50, this._position.y + 0, this._position.z + 0),
            Math.PI / 2, Math.PI / 2
            ,0
            ,0
            , 'rightBorder' // id
        )); // right border

        // Back wall boundary boxes to detect collision with stations back wall left
        this.#sceneController.getBoundingBoxes().push(this._setBoundingBox(
            this.#sceneController.getScene(), // scene
            new THREE.Vector3(68, 1, 8), // geometry
            new THREE.Vector3(this._position.x -17, this._position.y - 0.041, this._position.z + 6.5), // position
            Math.PI / 2 // rotation on x axis
            ,0
            ,0
            , 'backWallLeft' // id
        )); // backwall LEFT

        // Back wall boundary boxes to detect collision with stations back wall right
        this.#sceneController.getBoundingBoxes().push(this._setBoundingBox(
            this.#sceneController.getScene(), // scene
            new THREE.Vector3(68, 1,8), // geometry
            new THREE.Vector3(this._position.x - 17, this._position.y + 0.041, this._position.z - 13), // position -17
            Math.PI / 2 // rotation on x axis
            ,0
            ,0
            , 'backWallRight' // id
        )); // backwall RIGHT

        // // Back wall boundary boxes to detect collision with stations rail wall left
        this.#sceneController.getBoundingBoxes().push(this._setBoundingBox(
            this.#sceneController.getScene(), // scene
            new THREE.Vector3(68, 1, 8), // geometry
            new THREE.Vector3(this._position.x, this._position.y - 0.041, this._position.z + 1.9), // position
            Math.PI / 2 // rotation on x axis
            ,0
            ,0
            , 'railWallLeft' // id
        )); // railWall Left

        // Back wall boundary boxes to detect collision with stations rail wall right
        this.#sceneController.getBoundingBoxes().push(this._setBoundingBox(
            this.#sceneController.getScene(), // scene
            new THREE.Vector3(68, 1, 8), // geometry
            new THREE.Vector3(this._position.x, this._position.y - 0.041, this._position.z - 8.7), // position
            Math.PI / 2 // rotation on x axis
            ,0
            ,0
            , 'railWallRight' // id
        )); // railWall Right


        // corridorWallLeft boundary boxes to detect collision with corridorwallright
        this.#sceneController.getBoundingBoxes().push(this._setBoundingBox(
            this.#sceneController.getScene(), // scene
            new THREE.Vector3(20.5, 1, 8), // geometry
            new THREE.Vector3(this._position.x + 6.9, this._position.y + 8, this._position.z - 3.2), // position
            Math.PI / 2 // rotation on x axis
            ,Math.PI / 2  // rotation on Z axis
            ,0 // rotation on y axis
            , 'corridorWallRight' // id
        )); // corridor Wall Right

        // corridorWallLeft boundary boxes to detect collision with corridorwallleft
        this.#sceneController.getBoundingBoxes().push(this._setBoundingBox(
            this.#sceneController.getScene(), // scene
            new THREE.Vector3(50, 1, 8), // geometry
            new THREE.Vector3(this._position.x + 2.9, this._position.y + 8, this._position.z - 3.2), // position
            Math.PI / 2 // rotation on x axis
            ,Math.PI / 2  // rotation on Z axis
            ,0 // rotation on y axis
            , 'corridorWallLeft' // id
        )); // corridor Wall left

        // Outer back wall boundary boxes to detect collision with stations outer back walls (left and right)
        this.#sceneController.getBoundingBoxes().push(this._setBoundingBox(
            this.#sceneController.getScene(), // scene
            new THREE.Vector3(80, 1, 18), // geometry
            new THREE.Vector3(this._position.x - 15, this._position.y - 0.041, this._position.z + 9.6), // position
            Math.PI / 2 // rotation on x axis
            ,0 // rotation on z axis
            ,0
            , 'outerBackWallLeft' // id
        )); // outerBackWall Left

        this.#sceneController.getBoundingBoxes().push(this._setBoundingBox(
            this.#sceneController.getScene(), // scene
            new THREE.Vector3(80, 1, 18), // geometry
            new THREE.Vector3(this._position.x - 15, this._position.y - 0.048, this._position.z - 16.3), // position
            Math.PI / 2 // rotation on x axis
            ,0
            ,0
            , 'outerBackWallRight'// id
        )); // outerBackWall RIGHT

        // Left and right stairs boundary boxes to detect collision with stations stairs
        this.#sceneController.getBoundingBoxes().push(this._setBoundingBox (
            this.#sceneController.getScene(), // scene
            new THREE.Vector3(11, 3, 0.5), // geometry
            new THREE.Vector3(this._position.x + 11, this._position.y + 4.2, this._position.z + 8), // position
            (Math.PI / 2), // rotation on x axis
            0, // rotation on z axis
            - 38.40 // rotation on y axis
            , 'leftStair'// id
        )); // LeftStair

        this.#sceneController.getBoundingBoxes().push(this._setBoundingBox(
            this.#sceneController.getScene(), // scene
            new THREE.Vector3(11, 2, 0.5), // geometry
            new THREE.Vector3(this._position.x + 11, this._position.y + 4.2, this._position.z - 14), //  position
            (Math.PI / 2), // rotation on x axis
            0, // rotation on z axis
            - 38.40 // rotation on y axis
            , 'rightStair' // id
        )); // RightStair
    }

/**
 * The function `getName()` returns the value of the private variable `name`.
 * @returns The value of the private variable `name` is being returned.
 */
    getName() {
        return this.#name;
    }

    /* The `getPosition()` method is a getter function that returns the position of the station in the 3D
    scene. It retrieves the `_position` property of the station object and returns it. */
    getPosition() {
        return this._position;
    }

 /**
  * The function `renderSign` renders a sign with the station name at a specified position in a 3D
  * scene using a specified font.
  * @param scene - The "scene" parameter is the Three.js scene object where you want to render the
  * sign. It represents the virtual environment where all the objects are displayed.
  * @param station - The "station" parameter is an object that represents a station. It has properties
  * such as name, position, and possibly others depending on how it is defined in your code.
  */
    renderSign(scene, station) {

            const loader = new FontLoader();
            let stationName = station.getName();
            let x = station.getPosition().x;
            let y = station.getPosition().y;
            let z = station.getPosition().z;

            loader.load( 'assets/fonts/helvetiker_regular.typeface.json', function ( font ) {
            const geometry = new TextGeometry(stationName, {
                font: font,
                size: 0.2,
                height: 0.010,
            } );


            const textMaterialLeft = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const textMeshLeft = new THREE.Mesh(geometry, textMaterialLeft);
            textMeshLeft.position.set(x + 0.97, y + 2.17, z + 5.8); // Coördinaten x=-2, y=2, z=7
            textMeshLeft.rotation.y = 180* Math.PI / 180;


            const textMaterialRight = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const textMeshRight = new THREE.Mesh(geometry, textMaterialRight);
            textMeshRight.position.set(x - 32.6, y + 2.07, z - 12.6); // Coördinaten x=-2, y=2, z=7

            scene.add(textMeshRight);
            scene.add(textMeshLeft);
        });
    }
}