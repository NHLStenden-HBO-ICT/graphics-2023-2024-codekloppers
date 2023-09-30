import * as THREE from "three";
import Model3D from '/classes/3dModels/Model3D';

export class Station extends Model3D {
    #name;
    #metroArrvingTimes;
    filePath = "/assets/3d/station.glb";

    constructor(position, object) {
        super();
        this.position = position;
        this._object = object;
        // this.name = name;
    }

    // function to get arrving time of metro
    getMetroArrvingTime(Metro) {
        //TODO: heeft nog een body nodig
    }
}