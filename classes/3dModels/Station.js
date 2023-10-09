import * as THREE from "three";
import Model3D from '/classes/3dModels/Model3D';

export class Station extends Model3D {
    #name;
    #metroArrivingTimes;
    filePath = "/assets/3d/station.glb";

    constructor(position, rotation) {
        super();
        this._position = position;
        this._rotation = rotation;
        // this.name = name;
    }

    // function to get arrving time of metro
    getMetroArrivingTime(Metro) {
        //TODO: heeft nog een body nodig
    }

/**
 * The function sets a bounding box in a 3D scene using a green cube with specific dimensions and
 * position.
 * @param scene - The "scene" parameter is a reference to the Three.js scene object. The scene object
 * represents the 3D environment where all the objects will be rendered.
 */
}