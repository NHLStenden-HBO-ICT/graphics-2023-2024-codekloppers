import * as THREE from "three";

export class Routes {
    static routes = {
        'U5': [
            {'vector': new THREE.Vector3(0, 0, 0), 'rotation': [0, 0, 0]},
            {'vector': new THREE.Vector3(-700, 0, 0), 'rotation': [0, 0, 0]},
            {'vector': new THREE.Vector3(-1200, 0, 0), 'rotation': [0, 0, 0]},
        ],
        'U6': [
            {'vector': new THREE.Vector3(0, 0, 100), 'rotation': [0, 0, 0]},
            {'vector': new THREE.Vector3(400, 0, 100), 'rotation': [0, 0, 0]},
            {'vector': new THREE.Vector3(800, 0, 100), 'rotation': [0, 0, 0]},
        ],
    }
}
