const display = document.getElementById("canvas");
const displayWidth = display.width = window.innerWidth * 2;
const displayHeight = display.height = window.innerHeight * 2;

const context = display.getContext("2d");

requestAnimationFrame(frame);

function frame() {
    requestAnimationFrame(frame);
    context.clearRect(0, 0, displayWidth, displayHeight);
}