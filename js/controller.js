// SHADING

document.getElementById("phong-shading").checked = true;

document.getElementById("phong-shading").addEventListener('change', event => {
    if (event.target.checked) {
        shader.setShading(shader.PHONG_SHADING);
    }
})

document.getElementById("gouraud-shading").addEventListener('change', event => {
    if (event.target.checked) {
        shader.setShading(shader.GOURAUD_SHADING);
    }
})

// SHADING MODEL

document.getElementById("phong-model").checked = true;

document.getElementById("phong-model").addEventListener('change', event => {
    if (event.target.checked) {
        shader.setModel(shader.PHONG_MODEL);
    }
})

document.getElementById("blinn-model").addEventListener('change', event => {
    if (event.target.checked) {
        shader.setModel(shader.BLINN_MODEL);
    }
})

// SHADING SHININESS

document.getElementById("shading-shininess").addEventListener('change', event => {
    const shininess = +event.target.value;
    shader.setShiniess(shininess);
    document.getElementById("shading-shininess-value").innerText = shininess;
})

// CAMERA TYPES

document.getElementById("following-camera").checked = true;

document.getElementById("following-camera").addEventListener('change', event => {
    if (event.target.checked) {
        camera.setType(camera.CAMERA_FOLLOWING);
    }
})

document.getElementById("tracking-camera").addEventListener('change', event => {
    if (event.target.checked) {
        camera.setType(camera.CAMERA_TRACKING);
    }
})

document.getElementById("static-camera").addEventListener('change', event => {
    if (event.target.checked) {
        camera.setType(camera.CAMERA_STATIC);
    }
})

// BUMBLEBEE REFLECTOR

document.getElementById("bumbebee-reflector").addEventListener('change', event => {
    if (event.target.checked) {
        bumblebee.reflector = true;
    } else {
        bumblebee.reflector = false;
    }
})

document.getElementById("bumbebee-reflector-vertically").addEventListener('change', event => {
    const vert = +event.target.value;
    bumblebee.reflectorX = vert;
    document.getElementById("reflector-vertically-value").innerText = vert;
})

document.getElementById("bumbebee-reflector-horizontally").addEventListener('change', event => {
    const hor = +event.target.value;
    bumblebee.reflectorZ = hor;
    document.getElementById("reflector-horizontally-value").innerText = hor;
})

// REFLECTOR SHININESS

document.getElementById("reflector-shininess").addEventListener('change', event => {
    const shininess = +event.target.value;
    bumblebee.setReflectorShiniess(shininess);
    document.getElementById("reflector-shininess-value").innerText = shininess;
})

// BUMBLEBEE TURNING

document.getElementById("bumbebee-turning").addEventListener('change', event => {
    if (event.target.checked) {
        bumblebee.turning = true;
    } else {
        bumblebee.turning = false;
    }
})

// WEATHER FOG

document.getElementById("weather-fog").addEventListener('change', event => {
    if (event.target.checked) {
        weather.fogOn();
    } else {
        weather.fogOff();
    }
})

document.getElementById("weather-fog-near").addEventListener('change', event => {
    const near = +event.target.value
    weather.setFogNearDest(near);
    document.getElementById("fog-near-value").innerText = near;
})

document.getElementById("weather-fog-far").addEventListener('change', event => {
    const far = +event.target.value
    weather.setFogFarDest(far);
    document.getElementById("fog-far-value").innerText = far;
})

// WEATHER NIGHT

document.getElementById("weather-night").addEventListener('change', event => {
    if (event.target.checked) {
        weather.nightOn();
    } else {
        weather.nightOff();
    }
})

// KEYS

document.addEventListener('keydown', event => {
    switch (event.keyCode) {

        case 81: // key 'Q'
            camera.setType(camera.CAMERA_FOLLOWING);
            break;
        case 87: // key 'W'
            camera.setType(camera.CAMERA_TRACKING);
            break;
        case 69: // key 'E'
            camera.setType(camera.CAMERA_STATIC);
            break;


        case 65: // key 'A'
            shader.setShading(shader.PHONG_SHADING);
            break;
        case 83: // key 'S'
            shader.setShading(shader.GOURAUD_SHADING);
            break;

        case 88: // key 'Z'
            shader.setModel(shader.BLINN_MODEL);
            break;
        case 90: // key 'X'
            shader.setModel(shader.PHONG_MODEL);
            break;

        case 37: // ArrowLeft
            bumblebee.setAngle(bumblebee.getAngle() + 0.05);
            break;
        case 39: // ArrowRight
            bumblebee.setAngle(bumblebee.getAngle() - 0.05);
            break;

        case 38: // ArrowUp
            bumblebee.toX(-0.5);
            bumblebee.toZ(-0.5);
            break;
        case 40: // ArrowDown
            bumblebee.toX(0.5);
            bumblebee.toZ(0.5);
            break;

        case 57: // digit '9'
            bumblebee.toY(-0.1);
            break;
        case 48: // digit '0'
            bumblebee.toY(0.1);
            break;


        case 79: // letter 'O'
            weather.fogOn();
            break;
        case 80: // letter 'P'
            weather.fogOff();
            break;

        case 75: // letter 'K'
            weather.nightOff();
            break;
        case 76: // letter 'L'
            weather.nightOn();
            break;

        case 78: // letter 'N'
            bumblebee.setDistance(bumblebee.getDistance() - 1);
            break;
        case 77: // letter 'M'
            bumblebee.setDistance(bumblebee.getDistance() + 1);
            break;

        case 49: // digit '1'
            getActivePanel(0);
            break;
        case 50: // digit '2'
            getActivePanel(1);
            break;
        case 51: // digit '3'
            getActivePanel(2);
            break;
        case 52: // digit '4'
            getActivePanel(3);
            break;
        case 53: // digit '5'
            getActivePanel();
            break;

    }
})

const panels = document.querySelectorAll('.panel');

function getActivePanel(ind) {
    for (let i = 0; i < panels.length; i++) {
        if (i === ind) panels[i].classList.add('panel--active');
        else panels[i].classList.remove('panel--active')
    }
}