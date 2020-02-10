var fog = {
    near : 0.0,
    far : 1000.0,

    setNear : n => {
        fog.near = n;
    },

    setFar : f => {
        fog.far = f;
    },

    fogOn: () => {
        program.clearColor = [1.0, 1.0, 1.0, 1.0];
        fog.near = 30;
        fog.far = 100;
    },

    fogOff: () => {
        program.clearColor = [0.4,0.7,1.0,1.0];
        fog.near = 0;
        fog.far = 1000;
    }
}