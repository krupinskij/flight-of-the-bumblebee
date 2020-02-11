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
    program.gl.canvas.width = window.outerWidth;
    program.gl.canvas.height = window.outerHeight;
})