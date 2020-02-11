class Shader {

    constructor() {
        this.PHONG_SHADING = "phong-shading";
        this.GOURAUD_SHADING = "gouraud-shading";

        this.PHONG_MODEL = "phong-model";
        this.BLINN_MODEL = "blinn-model";

        this.shading = this.PHONG_SHADING;
        this.model = this.PHONG_MODEL;
    }

    getShading() {
        if(this.shading === this.PHONG_SHADING) return ["phong-fragment-shader.frag", "phong-vertex-shader.vert"];
        else if (this.shading === this.GOURAUD_SHADING) return ["gouraud-fragment-shader.frag", "gouraud-vertex-shader.vert"];
        else throw Error("Incorrect shading");
    }

    setShading(shading) {
        this.shading = shading;
        document.getElementById(shading).checked = true;
        console.info("Set shading to: " + shading);
        
        program.changeShaders();
    }

    isBlinnModel() {
        if(this.model === this.BLINN_MODEL) return true;
        else if (this.model === this.PHONG_MODEL) return false;
        else throw Error("Incorrect model type");
    }

    setModel(model) {
        this.model = model;
        document.getElementById(model).checked = true;
        console.info("Set model to: " + model);
    }
}

const shader = new Shader();