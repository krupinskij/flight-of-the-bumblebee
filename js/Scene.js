class Scene {

    constructor() {
        this.objects = [];
    }

    loadModel(filename) {
        return fetch("http://" + document.domain + ":" + location.port + "/" + filename)
        .then(resp => resp.json())
        .then(model => {
            model.normals = utils.calculateNormals(model.vertices, model.indices);
            this.objects.push(model);
            console.info("Added: " + model.partname + " of " + model.alias)
        })
    }

    loadBumblebee() {
        const headPromise = scene.loadModel("model/bumblebee/head.json");
        const bellyPromise = scene.loadModel("model/bumblebee/belly.json");
        const leftEyePromise = scene.loadModel("model/bumblebee/left-eye.json");
        const rightEyePromise = scene.loadModel("model/bumblebee/right-eye.json");

        return Promise.all([headPromise, bellyPromise, leftEyePromise, rightEyePromise]);
    }

    loadGrass() {
        return scene.loadModel("model/grass/grass.json");
    }

    loadFlower() {
        const xPos = Math.random() * 80 - 40;
        const yPos = Math.random() * 80 - 40;

        const colors = [[0.8, 0.0, 0.0, 1.0], [1.0, 1.0, 1.0, 1.0], [1.0, 0.5, 1.0, 1.0], [1.0, 0.5, 0.2, 1.0], [0.5, 0.5, 1.0, 1.0]];
        const randomCol = Math.floor(Math.random() * 5)

        const petalPromise = fetch("http://" + document.domain + ":" + location.port + "/model/flower/petal.json")
        .then(resp => resp.json())
        .then(model => {
            model.vertices = model.vertices.map((v, i) => {
                if(i%3===0) return v + xPos;
                else if(i%3===2) return v + yPos;
                else return v;
            });
            model.normals = utils.calculateNormals(model.vertices, model.indices);
            model.color = colors[randomCol];
            this.objects.push(model)
            console.info("Added: " + model.partname + " of " + model.alias)
        })

        const centerPromise = fetch("http://" + document.domain + ":" + location.port + "/model/flower/center.json")
        .then(resp => resp.json())
        .then(model => {
            model.vertices = model.vertices.map((v, i) => {
                if(i%3===0) return v + xPos;
                else if(i%3===2) return v + yPos;
                else return v;
            });
            model.normals = utils.calculateNormals(model.vertices, model.indices);
            this.objects.push(model)
            console.info("Added: " + model.partname + " of " + model.alias)
        })

        const stemPromise = fetch("http://" + document.domain + ":" + location.port + "/model/flower/stem.json")
        .then(resp => resp.json())
        .then(model => {
            model.vertices = model.vertices.map((v, i) => {
                if(i%3===0) return v + xPos;
                else if(i%3===2) return v + yPos;
                else return v;
            });
            model.normals = utils.calculateNormals(model.vertices, model.indices);
            this.objects.push(model)
            console.info("Added: " + model.partname + " of " + model.alias)
        })

        return Promise.all([petalPromise, centerPromise, stemPromise]);
    }

    loadDandelion() {
        const xPos = Math.random() * 80 - 40;
        const yPos = Math.random() * 80 - 40;

        const centerPromise = fetch("http://" + document.domain + ":" + location.port + "/model/dandelion/center.json")
        .then(resp => resp.json())
        .then(model => {
            model.vertices = model.vertices.map((v, i) => {
                if(i%3===0) return v + xPos;
                else if(i%3===2) return v + yPos;
                else return v;
            });
            model.normals = utils.calculateNormals(model.vertices, model.indices);
            this.objects.push(model)
            console.info("Added: " + model.partname + " of " + model.alias)
        })

        const stemPromise = fetch("http://" + document.domain + ":" + location.port + "/model/dandelion/stem.json")
        .then(resp => resp.json())
        .then(model => {
            model.vertices = model.vertices.map((v, i) => {
                if(i%3===0) return v + xPos;
                else if(i%3===2) return v + yPos;
                else return v;
            });
            model.normals = utils.calculateNormals(model.vertices, model.indices);
            this.objects.push(model)
            console.info("Added: " + model.partname + " of " + model.alias)
        })

        return Promise.all([centerPromise, stemPromise]);
    }

    addLocalModel(model) {
        this.objects.push(model);
    }
}

const scene = new Scene();