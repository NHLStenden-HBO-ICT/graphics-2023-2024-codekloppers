class SceneController extends Controller {

    constructor() {
        super();

    }


    static loadModels() {
        // loadObject('Models/animation_test4.glb', 7, -1, -7, 0);
        loadObject('Models/ubahnTrain.glb', 0, 0, 0, 0);
        // loadObject('Models/ubahnStation.glb', 0,1,6.6,0);
        loadObject('Models/rail.glb', 0, 0, 0, 0);
    }
}