class WebGLApp {

    constructor() {
        this.shaders = ["phong/shader-fs", "phong/shader-vs"]
    }

    run() {
        program.gl = utils.getGLContext("canvas-element-id");
        
        const bumblebeePromise = scene.loadModel("model/bumblebee.json");
        const grassPromise = scene.loadModel("model/grass.json");

        Promise.all([bumblebeePromise, grassPromise])
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
            program.angle +=0.05;
            break;
        case 39:
            program.angle -=0.05;
            break;
         case 38:
             program.moveX -= Math.sin(program.angle) * 0.1;
             program.moveZ -= Math.cos(program.angle) * 0.1;
             break;
         case 40:
             program.moveX += Math.sin(program.angle) * 0.1;
             program.moveZ += Math.cos(program.angle) * 0.1;
             break;
    }   
})