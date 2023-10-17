import Model3D from '/classes/3dModels/Model3D';

export class Tunnel extends Model3D {
    filePath = "/assets/3d/tunnel.glb";

    constructor(position, rotation) {
        super();
        this._position = position;
        this._rotation = rotation;
    }
}