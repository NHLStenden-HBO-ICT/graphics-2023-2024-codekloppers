import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader'

/**
 * A base class for 3D models in the scene.
 */
export default class Model3D {
    _filePath; // File path to the 3D model
    _position; // Position of the 3D model in the scene
    _rotation; // Rotation of the 3D model in the scene
    _objectScene; // The THREE.Group representing the 3D model in the scene
    _objectAnimations; // Array of animations associated with the 3D model

    /**
     * Constructor for the Model3D class.
     * @param {string} filePath - File path to the 3D model.
     */
    constructor(filePath = null) {
        this._filePath = filePath;

        // Prevent instantiation of the abstract class Model3D
        /*Ja, dit is helaas hoe dat werkt in Javascript*/
        if (this.constructor === Model3D) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }


    /**
     * Sets the object scene for the 3D model.
     * @param {THREE.Group} scene - The THREE.Group representing the 3D model in the scene.
     */
    setObjectScene(scene) {
        this._objectScene = scene;
    }

    /**
     * Sets the object animations for the 3D model.
     * @param {Array} animations - Array of animations associated with the 3D model.
     */
    setObjectAnimations(animations) {
        this._objectAnimations = animations;
    }

    /**
     * Loads a GLTF file using GLTFLoader and adds the loaded scene to the provided scene object.
     * @param {THREE.Scene} scene - The THREE.Scene where the loaded GLTF model will be added.
     */
    async render(scene) {
        const loader = new GLTFLoader();

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('assets/');
        dracoLoader.setDecoderConfig({ type: 'js' });
        loader.setDRACOLoader(dracoLoader);

        await loader.loadAsync(this._filePath).then((gltf) => { // Gebruik een arrow-functie om de juiste 'this' context te behouden
            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object
            gltf.scene.position.copy(this._position);
            scene.add(gltf.scene);
            this._objectScene = gltf.scene;
            this._objectAnimations = gltf.animations;
        });
    }

    /**
     * Clones a 3D model and adds it to the scene.
     * @param {THREE.Scene} scene - The THREE.Scene where the cloned model will be added.
     * @param {Model3D} newModel3d - The instance of the 3D model object to be cloned and added.
     * @returns The cloned 3D model object.
     */
    clone(scene, newModel3d) {

        let object = this._objectScene.clone();

        if (newModel3d._position !== undefined) {
            object.position.copy(newModel3d._position);
        }
        if (newModel3d._rotation !== undefined) {
            if (newModel3d._rotation[0] != null) {
                object.rotation.x = newModel3d._rotation[0];
            }
            if (newModel3d._rotation[1] != null) {
                object.rotation.y = newModel3d._rotation[1];
            }
            if (newModel3d._rotation[2] != null) {
                object.rotation.z = newModel3d._rotation[2];
            }
        }

        object.traverse(function (child) {
            if (child.isMesh) {
                child.material.side = THREE.DoubleSide; // Dubbelzijdig maken
                child.material.depthWrite = true;
            }
        });

        scene.add(object);
        newModel3d.setObjectScene(object);
        newModel3d.setObjectAnimations(this._objectAnimations);

        return newModel3d;
    }

    /**
     * Sets up a bounding box in the 3D scene with the specified geometry, position, rotation, and name.
     * @param {THREE.Scene} scene - The THREE.Scene where the bounding box will be added.
     * @param {THREE.Vector3} geometryVector - Dimensions of the bounding box (width, height, depth).
     * @param {THREE.Vector3} positionVector - Position of the bounding box in 3D space.
     * @param {number} [rotationX=0] - Rotation angle around the x-axis in radians.
     * @param {number} [rotationZ=0] - Rotation angle around the z-axis in radians.
     * @param {number} [rotationY=0] - Rotation angle around the y-axis in radians.
     * @param {string} name - Name of the bounding box for identification in the scene.
     * @returns The created bounding box object.
     */
    _setBoundingBox(scene, geometryVector, positionVector, rotationX = 0, rotationZ = 0, rotationY = 0, name) {
        const geometry = new THREE.BoxGeometry(geometryVector.x, geometryVector.y, geometryVector.z);
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.0}); //, transparent: true, opacity: 0.0
        const box = new THREE.Mesh(geometry, material);
        box.position.copy(positionVector);
        box.rotation.x = rotationX;
        box.rotation.z = rotationZ;
        box.rotation.y = rotationY;
        box.name = name;
        // Voeg de bounding box toe aan de scene
        scene.add(box);

        return box;
    }
}
