import * as THREE from "three";

export class Routes {
    static routes = {
        'U5': [
            {'vector': new THREE.Vector3(0, 0, 0), 'rotation': [0, 0, 0], 'name': 'Alexanderplatz '},
            {'vector': new THREE.Vector3(-200, 0, 0), 'rotation': [0, 0, 0], 'name': 'Rotes Rathaus'},
            {'vector': new THREE.Vector3(-600, 0, 0), 'rotation': [0, 0, 0], 'name': 'Museumsinsel'},
        ],
        'U6': [
            {'vector': new THREE.Vector3(0, 0, 100), 'rotation': [0, 0, 0], 'name': 'leeg'},
            {'vector': new THREE.Vector3(400, 0, 100), 'rotation': [0, 0, 0], 'name': 'leeg'},
            {'vector': new THREE.Vector3(800, 0, 100), 'rotation': [0, 0, 0], 'name': 'leeg'},
        ],
    }
}
