import Model3D from '/classes/3dModels/Model3D';

export class Tunnel extends Model3D {
    angle;
    length;
    filePath = "/assets/3d/tunnel.glb";

    constructor(position) {
        super();
        this.position = position
    }
}