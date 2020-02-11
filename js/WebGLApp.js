class WebGLApp {

    constructor() {
        this.shaders = ["phong-fragment-shader.frag", "phong-vertex-shader.vert"];
    }

    run() {
        program.gl = utils.getGLContext("canvas-element-id");
        
        const bumblebeePromise = scene.loadBumblebee();
        const grassPromise = scene.loadGrass();

        for(let i = 0; i < 15; i++) {
            scene.loadFlower();
        }

        
        

        Promise.all([bumblebeePromise, grassPromise])
        .then(program.runProgram)
    }
}

const webGLApp = new WebGLApp();
webGLApp.run();

document.addEventListener('keydown', event => {
    switch(event.keyCode) {
        case 49: 
            webGLApp.shaders = ["phong-fragment-shader.frag", "phong-vertex-shader.vert"];
            program.changeShaders();
            break;
        case 50:
            webGLApp.shaders = ["gouraud-fragment-shader.frag", "gouraud-vertex-shader.vert"];
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

        case 90:
            bumblebee.distance -= 1;
            bumblebee.upDateObserver();
            break;
        case 88:
            bumblebee.distance += 1;
            bumblebee.upDateObserver();
            break;

    }
})