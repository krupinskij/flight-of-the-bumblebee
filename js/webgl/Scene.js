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
        const stripesPromise = scene.loadModel("model/bumblebee/stripes.json");
        const stingPromise = scene.loadModel("model/bumblebee/sting.json");
        const leftWingPromise = scene.loadModel("model/bumblebee/left-wing.json");
        const rightWingPromise = scene.loadModel("model/bumblebee/right-wing.json");

        return Promise.all([
            headPromise, 
            bellyPromise, 
            leftEyePromise, rightEyePromise, 
            stripesPromise, 
            stingPromise,
            leftWingPromise, rightWingPromise
        ]);
    }

    loadGrass() {
        return fetch("http://" + document.domain + ":" + location.port + "/model/grass/grass.json")
        .then(resp => resp.json())
        .then(model => {
            model.vertices = model.vertices.map((v, i) => {
                if(i%3===1) return v - 10.0;
                else return v;
            });
            model.normals = utils.calculateNormals(model.vertices, model.indices);
            this.objects.push(model)
            console.info("Added: " + model.partname + " of " + model.alias)
        })
    }

    loadFlower() {
        const xPos = Math.random() * 60 - 30;
        const yPos = Math.random() * 60 - 30;
        const zPos = Math.random() * 2 - 1;

        const colors = [[0.8, 0.0, 0.0, 1.0], [1.0, 1.0, 1.0, 1.0], [1.0, 0.5, 1.0, 1.0], [1.0, 0.5, 0.2, 1.0], [0.5, 0.5, 1.0, 1.0]];
        const randomCol = Math.floor(Math.random() * 5)

        const petalPromise = fetch("http://" + document.domain + ":" + location.port + "/model/flower/petal.json")
        .then(resp => resp.json())
        .then(model => {
            model.vertices = model.vertices.map((v, i) => {
                if(i%3===0) return v + xPos;
                else if(i%3===2) return v + yPos;
                else return v + zPos;
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
                else return v + zPos;
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
                else return v + zPos;
            });
            model.normals = utils.calculateNormals(model.vertices, model.indices);
            this.objects.push(model)
            console.info("Added: " + model.partname + " of " + model.alias)
        })

        return Promise.all([petalPromise, centerPromise, stemPromise]);
    }

    
}

const scene = new Scene();