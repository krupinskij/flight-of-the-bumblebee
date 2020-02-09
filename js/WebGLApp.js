class WebGLApp {

    constructor() {
        this.shaders = ["phong/shader-fs", "phong/shader-vs"]
    }

    run() {
        program.gl = utils.getGLContext("canvas-element-id");
        
        const headPromise = scene.loadModel("model/bumblebee/head.json");
        const bellyPromise = scene.loadModel("model/bumblebee/belly.json");
        const leftEyePromise = scene.loadModel("model/bumblebee/left-eye.json");
        const rightEyePromise = scene.loadModel("model/bumblebee/right-eye.json");

        const grassPromise = scene.loadModel("model/grass.json");

        const stem1Promise = scene.loadModel("model/flower1/stem.json");
        const center1Promise = scene.loadModel("model/flower1/center.json");
        const petal1Promise = scene.loadModel("model/flower1/petal.json");

        const stem2Promise = scene.loadModel("model/flower2/stem.json");
        const center2Promise = scene.loadModel("model/flower2/center.json");
        const petal2Promise = scene.loadModel("model/flower2/petal.json");

        const stem3Promise = scene.loadModel("model/flower3/stem.json");
        const center3Promise = scene.loadModel("model/flower3/center.json");
        const petal3Promise = scene.loadModel("model/flower3/petal.json");

        const stem4Promise = scene.loadModel("model/flower4/stem.json");
        const center4Promise = scene.loadModel("model/flower4/center.json");
        const petal4Promise = scene.loadModel("model/flower4/petal.json");

        const stem5Promise = scene.loadModel("model/flower5/stem.json");
        const center5Promise = scene.loadModel("model/flower5/center.json");
        const petal5Promise = scene.loadModel("model/flower5/petal.json");

        const stemDPromise = scene.loadModel("model/dandelion/stem.json");
        const centerDPromise = scene.loadModel("model/dandelion/center.json");

        Promise.all([
            headPromise, bellyPromise, leftEyePromise, rightEyePromise, 
            grassPromise, 
            stem1Promise, center1Promise, petal1Promise,
            stem2Promise, center2Promise, petal2Promise,
            stem3Promise, center3Promise, petal3Promise,
            stem4Promise, center4Promise, petal4Promise,
            stem5Promise, center5Promise, petal5Promise,
            stemDPromise, centerDPromise
        ])
        .then(() => {
            program.init();
            program.initLights();
            program.renderLoop();
        })
    }
}

const webGLApp = new WebGLApp();
webGLApp.run();

document.addEventListener('keydown', event => {
    switch(event.keyCode) {
        case 49: 
            webGLApp.shaders = ["phong/shader-fs", "phong/shader-vs"];
            program.changeShaders();
            break;
        case 50:
            webGLApp.shaders = ["gouraud/shader-fs", "gouraud/shader-vs"];
            program.changeShaders();
            break;
        case 37:
            bumblebee.angle +=0.05;
            bumblebee.upDateObserver();
            break;
        case 39:
            bumblebee.angle -=0.05;
            bumblebee.upDateObserver();
            break;
         case 38:
            bumblebee.moveX -= Math.sin(bumblebee.angle) * 0.5;
            bumblebee.moveZ -= Math.cos(bumblebee.angle) * 0.5;
            bumblebee.upDateObserver();
             break;
         case 40:
            bumblebee.moveX += Math.sin(bumblebee.angle) * 0.5;
            bumblebee.moveZ += Math.cos(bumblebee.angle) * 0.5;
            bumblebee.upDateObserver();
             break;

        case 81:
            camera.setType(camera.CAMERA_FOLLOWING);
            break;
        case 87:
            camera.setType(camera.CAMERA_TRACKING);
            break;
        case 69:
            camera.setType(camera.CAMERA_STATIC);
            break;
    }   
})