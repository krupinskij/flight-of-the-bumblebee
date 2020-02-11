class Weather {

    constructor() {
        this.fogNear = 100.0;
        this.fogFar = 125.0;
        this.fogNearDest = 25.0;
        this.fogFarDest = 75.0;

        this.lightness = 1.0;

        this.fog = false;
        this.enabledFog = false;
        this.night = false;
    }

    getFogNear() { return weather.fogNear; }

    getFogFar() { return weather.fogFar; }

    setFogNear(fogNear) { weather.fogNear = fogNear;}

    setFogFar(fogFar) { weather.fogFar = fogFar; }

    getFogNearDest() { return weather.fogNearDest; }

    getFogFarDest() { return weather.fogFarDest; }

    setFogNearDest(fogNear) { weather.fogNearDest = fogNear; }

    setFogFarDest(fogFar) { weather.fogFarDest = fogFar; }

    fogOn() {
        weather.fog = true;
        weather.enabledFog = true;
        document.getElementById("weather-fog").checked = true;
    }

    fogOff() {
        weather.fog = false;
        document.getElementById("weather-fog").checked = false;
    }

    isFog() { return weather.fog; }
    isEnabledFog() { return weather.enabledFog; }
    disabledFog() { weather.enabledFog = false; }

    nightOn() {
        weather.night = true;
        document.getElementById("weather-night").checked = true;
    }

    nightOff() {
        weather.night = false;
        document.getElementById("weather-night").checked = false;
    }

    isNight() {
        return weather.night;
    }

    getSkyColor() {
        if(weather.isEnabledFog()) return weather.getFogColor();

        return [0.4 * weather.lightness, 0.7 * weather.lightness, 1.0 * weather.lightness, 1.0];
    }

    getFogColor(){
        const fogColor = Array(4).fill(weather.lightness);
        fogColor[3] = 1.0;
        return fogColor;
    }

    getLightness() {
        return weather.lightness;
    }

    setLightness(lightness) {
        weather.lightness = lightness;
    }
}

const weather = new Weather();