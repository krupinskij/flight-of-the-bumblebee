const bumblebee = {
    
    angle : 0,
    moveX : 0,
    moveZ :  0,

    bellyAngle : 0,
    wingAngle : -0.2,
    wingAngleStep : 0.08,

    distance: 30,

    position : [0,0,0],
    observer : [0,30,15],
    upVector : [0,0,1],
    
    upDateObserver : () => {
        bumblebee.observer = [bumblebee.moveX + Math.sin(bumblebee.angle) * bumblebee.distance/2, bumblebee.distance, bumblebee.moveZ + Math.cos(bumblebee.angle)*bumblebee.distance/2]
        bumblebee.upVector = [Math.sin(bumblebee.angle) * 1, 0, Math.cos(bumblebee.angle)*1]
    }
}