class WebGLApp {

    constructor() {
        this.shaders = ["phong/shader-fs", "phong/shader-vs"]
    }

    run() {
        program.gl = utils.getGLContext("canvas-element-id");
        
        const rightEyePromise = scene.loadModel("model/right-eye.json");
        const headPromise = scene.loadModel("model/head.json");
        const bellyPromise = scene.loadModel("model/belly.json");
        const leftEyePromise = scene.loadModel("model/left-eye.json");
        const grassPromise = scene.loadModel("model/grass.json");

        Promise.all([rightEyePromise, headPromise, bellyPromise, leftEyePromise, grassPromise])
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
            break;
        case 39:
            bumblebee.angle -=0.05;
            break;
         case 38:
            bumblebee.moveX -= Math.sin(bumblebee.angle) * 0.1;
            bumblebee.moveZ -= Math.cos(bumblebee.angle) * 0.1;
             break;
         case 40:
            bumblebee.moveX += Math.sin(bumblebee.angle) * 0.1;
            bumblebee.moveZ += Math.cos(bumblebee.angle) * 0.1;
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