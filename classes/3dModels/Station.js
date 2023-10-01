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
}