const bumblebee = {
    
    angle : 0,
    moveX : 0,
    moveZ :  0,

    distance: 10,

    position : [0,0,0],
    observer : [0,10,10],
    upVector : [0,0,1],
    
    upDateObserver : () => {
        bumblebee.observer = [bumblebee.moveX + Math.sin(bumblebee.angle) * bumblebee.distance, bumblebee.distance, bumblebee.moveZ + Math.cos(bumblebee.angle)*bumblebee.distance]
        bumblebee.upVector = [Math.sin(bumblebee.angle) * 1, 0, Math.cos(bumblebee.angle)*1]
        
    }
}