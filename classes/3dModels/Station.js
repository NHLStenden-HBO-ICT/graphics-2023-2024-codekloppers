import * as THREE from "three";
import Model3D from '/classes/3dModels/Model3D';

export class Station extends Model3D {
    #stationName;
    #metroArrvingTimes;
    filePath = "/assets/3d/ubahnStation.glb";

    // function to get arrving time of metro
    getMetroArrvingTime(Metro) {
        //TODO: heeft nog een body nodig
    }
}