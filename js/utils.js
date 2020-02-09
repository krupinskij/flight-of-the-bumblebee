class Utils {

	getGLContext = function (id) {

		var canvas = document.getElementById(id);
		var context = null;

		if (canvas == null) {
			alert('there is no canvas on this page');
			return null;
		}
		else {
			program.c_width = canvas.width;
			program.c_height = canvas.height;
		}

		var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];

		for (let i = 0; i < names.length; i++) {
			try {
				context = canvas.getContext(names[i]);
			}
			catch (e) { }

			if (context) { break; }
		}

		if (context == null) {
			alert("Could not initialise WebGL");
			return null;
		}
		else {
			return context;
		}
	}


	getShader = function (gl, id) {
		const script = document.getElementById(id);
		if (!script) {
			return null;
		}

		let str = "";
		let k = script.firstChild;
		while (k) {
			if (k.nodeType == 3) {
				str += k.textContent;
			}
			k = k.nextSibling;
		}

		let shader;
		if (script.type == "x-shader/x-fragment") {
			shader = gl.createShader(gl.FRAGMENT_SHADER);
		} else if (script.type == "x-shader/x-vertex") {
			shader = gl.createShader(gl.VERTEX_SHADER);
		} else {
			return null;
		}

		gl.shaderSource(shader, str);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			alert(gl.getShaderInfoLog(shader));
			return null;
		}
		return shader;
	}

	calculateNormals = function(vs, ind) {
		let x = 0;
		let y = 1;
		let z = 2;

		let ns = [];
		for (let i = 0; i < vs.length; i++) {
			ns[i] = 0.0;
		}

		for (let i = 0; i < ind.length; i = i + 3) {
			let v1 = [];
			let v2 = [];
			let normal = [];

			v1[x] = vs[3 * ind[i + 1] + x] - vs[3 * ind[i] + x];
			v1[y] = vs[3 * ind[i + 1] + y] - vs[3 * ind[i] + y];
			v1[z] = vs[3 * ind[i + 1] + z] - vs[3 * ind[i] + z];

			v2[x] = vs[3 * ind[i + 2] + x] - vs[3 * ind[i + 1] + x];
			v2[y] = vs[3 * ind[i + 2] + y] - vs[3 * ind[i + 1] + y];
			v2[z] = vs[3 * ind[i + 2] + z] - vs[3 * ind[i + 1] + z];

			normal[x] = v1[y] * v2[z] - v1[z] * v2[y];
			normal[y] = v1[z] * v2[x] - v1[x] * v2[z];
			normal[z] = v1[x] * v2[y] - v1[y] * v2[x];

			for (let j = 0; j < 3; j++) {
				ns[3 * ind[i + j] + x] = ns[3 * ind[i + j] + x] + normal[x];
				ns[3 * ind[i + j] + y] = ns[3 * ind[i + j] + y] + normal[y];
				ns[3 * ind[i + j] + z] = ns[3 * ind[i + j] + z] + normal[z];
			}
		}

		for (let i = 0; i < vs.length; i = i + 3) { //the increment here is because each vertex occurs with an offset of 3 in the array (due to x, y, z contiguous values)

			let nn = [];
			nn[x] = ns[i + x];
			nn[y] = ns[i + y];
			nn[z] = ns[i + z];

			let len = Math.sqrt((nn[x] * nn[x]) + (nn[y] * nn[y]) + (nn[z] * nn[z]));
			if (len == 0) len = 0.00001;

			nn[x] = nn[x] / len;
			nn[y] = nn[y] / len;
			nn[z] = nn[z] / len;

			ns[i + x] = nn[x];
			ns[i + y] = nn[y];
			ns[i + z] = nn[z];
		}

		return ns;

	}
}

const utils = new Utils();