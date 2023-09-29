import Model3D from '/classes/3dModels/Model3D';
import {v4 as uuid} from 'uuid';

export class Metro extends Model3D {
    #id;
    filePath = "/assets/3d/ubahn.glb";

    constructor(position) {
        super();
        this.#id = uuid();
        this.position = position
    }

    // function to open doors
    openDoors() {
        //TODO: heeft nog een body nodig
        console.log('openDoors');
        // console.log(this.filePath);
    }

    // function to close doors
    closeDoors() {
        console.log('closeDoors');
    }

    // function to accelerate metro
    accelerate() {

    }

    // function to decrease speed of metro
    brake() {

    }

    // get metro id
    getID() {
        return this.#id;
    }

    /**
     * The `renderFull` function asynchronously renders a scene and then clones it, because the a metro contains 2 metro models (2 metro cars)
     * @param scene - The `scene` parameter is an object that represents the scene to be rendered.
     */
    async renderFull(scene) {
        await this.render(scene).then(() => {
            this.clone(scene, undefined, undefined, 3.1415926536);
        });
    }

    /**
     * The function `cloneFull` asynchronously clones a scene and then clones it again, because the a metro contains 2 metro models (2 metro cars)
     * @param scene - The scene parameter represents the scene object where the cloning operation will take
     * place. It could be a 3D scene or any other type of scene in the context of your application.
     * @param position - The position parameter is the desired position of the cloned object in the scene.
     * It specifies the coordinates (x, y, z) where the object should be placed.
     * determines the amount of rotation around the z-axis for the cloned object.
     */
    async cloneFull(scene, position) {
        await this.clone(scene, position).then(() => {
            this.clone(scene, position, undefined, 3.1415926536);
        });
    }
}
