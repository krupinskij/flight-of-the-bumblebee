class Shader {

    constructor() {
        this.PHONG_SHADING = "phong-shading";
        this.GOURAUD_SHADING = "gouraud-shading";

        this.PHONG_MODEL = "phong-model";
        this.BLINN_MODEL = "blinn-model";

        this.shading = this.PHONG_SHADING;
        this.model = this.PHONG_MODEL;

        this.shininess = 200;
    }

    getShading() {
        if(shader.shading === shader.PHONG_SHADING) return ["phong-fragment-shader.frag", "phong-vertex-shader.vert"];
        else if (shader.shading === shader.GOURAUD_SHADING) return ["gouraud-fragment-shader.frag", "gouraud-vertex-shader.vert"];
        else throw Error("Incorrect shading");
    }

    setShading(shading) {
        shader.shading = shading;
        document.getElementById(shading).checked = true;
        console.info("Set shading to: " + shading);
        
        program.changeShaders();
    }

    isBlinnModel() {
        if(shader.model === shader.BLINN_MODEL) return true;
        else if (shader.model === shader.PHONG_MODEL) return false;
        else throw Error("Incorrect model type");
    }

    setModel(model) {
        shader.model = model;
        document.getElementById(model).checked = true;
        console.info("Set model to: " + model);
    }

    getShininess() {
        return shader.shininess;
    }

    setShiniess(shininess) {
        shader.shininess = shininess;
    }
}

const shader = new Shader();