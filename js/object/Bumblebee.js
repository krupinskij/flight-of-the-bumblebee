class Bumblebee {

    constructor() {
        this.angle = 0;

        this.moveX = 0;
        this.moveY = 0;
        this.moveZ = 0;

        this.turning = true;
        this.bellyAngle = 0;

        this.reflector = false;
        this.reflectorX = 0;
        this.reflectorZ = 0;
        this.reflectorShininess = 200.0;

        this.distance = 30;
        this.position = [0.0, 0.0, 0.0];
        this.observer = [0.0, 30.0, 15.0];
        this.upVector = [0.0, 0.0, 1.0];
    }

    toX(d) {
        bumblebee.moveX += Math.sin(bumblebee.angle) * d;
    }

    toY(d) {
        bumblebee.moveY += d;
    }

    toZ(d) {
        bumblebee.moveZ += Math.cos(bumblebee.angle) * d;
    }


    getObserver() {
        return [
            bumblebee.moveX + Math.sin(bumblebee.angle) * bumblebee.distance / 2,
            bumblebee.distance,
            bumblebee.moveZ + Math.cos(bumblebee.angle) * bumblebee.distance / 2
        ]
    }

    getUpVector() {
        return [
            Math.sin(bumblebee.angle),
            0,
            Math.cos(bumblebee.angle)
        ]
    }

    getMove() {
        return [bumblebee.moveX, bumblebee.moveY, bumblebee.moveZ];
    }

    getAngle() { return bumblebee.angle; }
    
    setAngle(angle) { bumblebee.angle = angle; }

    getPosition() {
        return bumblebee.position;
    }

    setPosition(position) {
        bumblebee.position = position;
    }

    getSpotPostion() {
        return [
            bumblebee.position[0] - bumblebee.reflectorX * Math.sin(bumblebee.angle) + bumblebee.reflectorZ * Math.cos(-bumblebee.angle),
            bumblebee.position[1] + 10,
            bumblebee.position[2] - bumblebee.reflectorX * Math.cos(bumblebee.angle) + bumblebee.reflectorZ * Math.sin(-bumblebee.angle)
        ]
    }

    isReflector() {
        return bumblebee.reflector;
    }

    getReflectorShininess() {
        return bumblebee.reflectorShininess;
    }

    setReflectorShiniess(shininess) {
        bumblebee.reflectorShininess = shininess;
    }

    isTurning() {
        return bumblebee.turning;
    }

    getBellyAngle() {
        return bumblebee.bellyAngle;
    }

    getDistance() {
        return bumblebee.distance;
    }

    setDistance(distance) {
        bumblebee.distance = distance;
    } 
}

const bumblebee = new Bumblebee();