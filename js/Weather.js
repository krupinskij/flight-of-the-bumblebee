var weather = {
    fogNear : 0.0,
    fogFar : 1000.0,

    lightness : 1.0,

    isFog: false,
    isNight: false,

    setFogNear : n => {
        weather.fogNear = n;
    },

    setFogFar : f => {
        weather.fogFar = f;
    },

    fogOn: () => {
        weather.fogNear = 30;
        weather.fogFar = 100;
        weather.isFog = true;
    },

    fogOff: () => {
        weather.fogNear = 0;
        weather.fogFar = 1000;
        weather.isFog = false;
    },

    dayOn: () => {
        weather.lightness = 1.0;
        weather.isNight = false;
    },

    nightOn: () => {
        weather.lightness = 0.1;
        weather.isNight = true;
    },

    getSkyColor: () => {
        if(weather.isNight) return [0.0, 0.0, 0.0, 1.0];
        else if(weather.isFog) return [1.0, 1.0, 1.0, 1.0];
        else return [0.4, 0.7, 1.0, 1.0];
    },

    getFogColor: () => {
        if(weather.isNight) return [0.0, 0.0, 0.0, 1.0];
        else return [1.0, 1.0, 1.0, 1.0];
    },

    getLightness: () => {
        if(weather.isNight) return 0.1;
        else return 1.0;
    }
}