function resize(canvas) {
    var displayWidth = canvas.clientWidth;
    var displayHeight = canvas.clientHeight;

    if (canvas.width != displayWidth ||
        canvas.height != displayHeight) {

        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}

window.addEventListener('resize', () => {
    resize(program.gl.canvas);
    
    program.gl.viewport(0, 0, program.c_width, program.c_height);

    console.log("nieee")
})