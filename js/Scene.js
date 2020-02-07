class Scene {

    constructor() {
        this.objects = [];
    }

    loadModel(filename) {
        return fetch("http://" + document.domain + ":" + location.port + "/" + filename)
        .then(resp => resp.json())
        .then(model => {
            model.normals = utils.calculateNormals(model.vertices, model.indices);
            console.log(model);
            this.objects.push(model);
            console.log(this.objects);
        })
    }

    addLocalModel(model) {
        this.objects.push(model);
    }
}

const scene = new Scene();