class Camera {

    constructor() {
        this.CAMERA_FOLLOWING = "following-camera";
        this.CAMERA_TRACKING = "tracking-camera";
        this.CAMERA_STATIC = "static-camera";

        this.type = this.CAMERA_FOLLOWING;
    }

    lookAt(matrix, cameraPosition, cameraTarget, cameraUpVector) {

        const cameraDirection = vec3.create();
        vec3.subtract(cameraPosition, cameraTarget, cameraDirection);
        vec3.normalize(cameraDirection);

        const cameraRight = vec3.create();
        vec3.cross(cameraDirection, cameraUpVector, cameraRight);
        vec3.normalize(cameraRight);

        const cameraV = vec3.create();
        vec3.cross(cameraDirection, cameraRight, cameraV);
        vec3.normalize(cameraV);

        matrix[0] = cameraRight[0];
        matrix[4] = cameraRight[1];
        matrix[8] = cameraRight[2];
        matrix[12] = -vec3.dot(cameraRight, cameraPosition);

        matrix[1] = cameraV[0];
        matrix[5] = cameraV[1];
        matrix[9] = cameraV[2];
        matrix[13] = -vec3.dot(cameraV, cameraPosition);

        matrix[2] = cameraDirection[0];
        matrix[6] = cameraDirection[1];
        matrix[10] = cameraDirection[2];
        matrix[14] = -vec3.dot(cameraDirection, cameraPosition);

        matrix[3] = 0.0;
        matrix[7] = 0.0;
        matrix[11] = 0.0;
        matrix[15] = 1.0;
    }

    setType(type) {
        this.type = type;
        document.getElementById(type).checked = true;
        console.info("Camera set to: " + type);

    }

}

const camera = new Camera();