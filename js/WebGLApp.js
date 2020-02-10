class WebGLApp {

    constructor() {
        this.shaders = ["phong/shader-fs", "phong/shader-vs"]
    }

    run() {
        program.gl = utils.getGLContext("canvas-element-id");
        
        const bumblebeePromise = scene.loadBumblebee();

        const grassPromise = scene.loadGrass();

        for(let i = 0; i < 5; i++) {
            scene.loadFlower();
        }

        for(let i = 0; i < 2; i++) {
            scene.loadDandelion();
        }

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

        case 79:
            weather.fogOn();
            break;
        case 80:
            weather.fogOff();
            break;

        case 77:
            weather.dayOn();
            break;
        case 78:
            weather.nightOn();
            break;

        case 66:
            program.blinn = true;
            break;
        case 86:
            program.blinn = false;
            break;
    }   
})