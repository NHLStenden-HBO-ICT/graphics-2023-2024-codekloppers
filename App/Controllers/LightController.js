import * as THREE from "three";

class LightController extends Controller
{
    constructor() {
        super();

    }

    addAmbientLight(scene, color, intensity, x, y , z) {
        let light = new THREE.AmbientLight(color, intensity, 30);
        light.position.set(x, y, z);

        scene.add(light);
    }
}