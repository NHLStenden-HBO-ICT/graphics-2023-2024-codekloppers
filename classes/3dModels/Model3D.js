import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader'

export default class Model3D {
    _filePath;
    _position;
    _rotation;
    _objectScene;
    _objectAnimations;

    constructor(filePath = null) {
        this.filePath = filePath;

        /*Ja, dit is helaas hoe dat werkt in Javascript*/
        if (this.constructor === Model3D) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }


    /**
     * The function `setObjectScene` sets the object scene for a JavaScript object.
     * @param scene - The `scene` parameter is an object that represents a scene in a game or a 3D
     * environment. It could contain information such as the objects, lighting, camera settings, and other
     * properties related to the scene.
     */
    setObjectScene(scene) {
        this._objectScene = scene;
    }

    /**
     * The function sets the object animations for a JavaScript object.
     * @param animations - The `animations` parameter is an object that contains the animations for an
     * object. It could be a collection of different animations, each with its own properties and settings.
     */
    setObjectAnimations(animations) {
        this._objectAnimations = animations;
    }

    /**
     * The function loads a GLTF file using the GLTFLoader and adds the loaded scene to the provided scene
     * object.
     * @param scene - The scene parameter is the THREE.Scene object where you want to add the loaded GLTF
     * model.
     */
    async render(scene) {
        const loader = new GLTFLoader();

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('assets/');
        dracoLoader.setDecoderConfig({ type: 'js' });
        loader.setDRACOLoader(dracoLoader);

        await loader.loadAsync(this.filePath).then((gltf) => { // Gebruik een arrow-functie om de juiste 'this' context te behouden
            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object
            gltf.scene.position.copy(this._position);
            scene.add(gltf.scene);
            this._objectScene = gltf.scene;
            this._objectAnimations = gltf.animations;
        });

        // cube.position.set(this._position.x + 3.9, this._position.y, this._position.z)
        // cube.position.set(this._position.x + 9.4, this._position.y, this._position.z)
        // cube.position.set(this._position.x + 14.9, this._position.y, this._position.z)
        // cube.position.set(this._position.x + 20.4, this._position.y, this._position.z)

        
        // const geometry = new THREE.BoxGeometry( 2, 1, 8 );
        const geometry = new THREE.BoxGeometry( 0.1, 1, 8 );
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const cube = new THREE.Mesh( geometry, material );
        cube.position.set(this._position.x + -3.9, this._position.y, this._position.z)
        scene.add(cube);
    }

    /**
     * The `clone` function clones a 3D model and adds it to the scene
     * @param scene - The scene parameter is the three.js scene object where you want to add the cloned
     * model.
     * @param newModel3d - The newModel3d parameter is an instance of a 3D model object that you want
     * to clone and add to the scene.
     * @returns the newModel3d object.
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

    setBoundingBox(scene, geometryVector, positionVector, rotationX, rotationZ) {
        const geometry = new THREE.BoxGeometry(geometryVector.x, geometryVector.y, geometryVector.z);
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.0}); //
        const box = new THREE.Mesh(geometry, material);
        box.position.copy(positionVector);
        box.rotation.x = rotationX;
        box.rotation.z = rotationZ;
        // Voeg de bounding box toe aan de scene
        scene.add(box);

        return box;
    }
}
