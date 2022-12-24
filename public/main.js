
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGL not supported');
}

const {mat2, mat2d, mat3, mat4, quat, quat2, vec2, vec3, vec4} = glMatrix;

// const colorData = [
//     1, 0, 0,    // V1.color
//     0, 1, 0,    // V2.color
//     0, 0, 1,    // V3.color
// ];

function spherePointCloud(pointCount) {
    let points = [];
    for (let i = 0; i < pointCount; i++) {
        const r = () => Math.random() - 0.5; // -.5 < x < 0.5
        const inputPoint = [r(), r(), r()];
        
        const outputPoint = vec3.normalize(vec3.create(), inputPoint);

        points.push(...outputPoint);
        
    }

    return points;
}

const vertexData = spherePointCloud(1e5);

/*
const vertexData = [

    // Front
    0.5, 0.5, 0.5,
    0.5, -.5, 0.5,
    -.5, 0.5, 0.5,
    -.5, 0.5, 0.5,
    0.5, -.5, 0.5,
    -.5, -.5, 0.5,

    // Left
    -.5, 0.5, 0.5,
    -.5, -.5, 0.5,
    -.5, 0.5, -.5,
    -.5, 0.5, -.5,
    -.5, -.5, 0.5,
    -.5, -.5, -.5,

    // Back
    -.5, 0.5, -.5,
    -.5, -.5, -.5,
    0.5, 0.5, -.5,
    0.5, 0.5, -.5,
    -.5, -.5, -.5,
    0.5, -.5, -.5,

    // Right
    0.5, 0.5, -.5,
    0.5, -.5, -.5,
    0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,
    0.5, -.5, 0.5,
    0.5, -.5, -.5,

    // Top
    0.5, 0.5, 0.5,
    0.5, 0.5, -.5,
    -.5, 0.5, 0.5,
    -.5, 0.5, 0.5,
    0.5, 0.5, -.5,
    -.5, 0.5, -.5,

    // Bottom
    0.5, -.5, 0.5,
    0.5, -.5, -.5,
    -.5, -.5, 0.5,
    -.5, -.5, 0.5,
    0.5, -.5, -.5,
    -.5, -.5, -.5,
];*/

function randomColor() {
    return [Math.random(), Math.random(), Math.random()];
}

/*
const colorData = [
    1, 0, 0,    // V1.color
    0, 1, 0,    // V2.color
    0, 0, 1,    // V3.color
];*/

// let colorData = [];
// for (let face = 0; face < 6; face++) {
//     let faceColor = randomColor();
//     for (let vertex = 0; vertex < 6; vertex++) {
//         colorData.push(...faceColor);
//     }
// }

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

// const colorBuffer = gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
precision mediump float;
attribute vec3 position;
varying vec3 vColor;

uniform mat4 matrix;

void main() {
    vColor = vec3(position.xy, 1);
    gl_Position = matrix * vec4(position, 1);
}
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
precision mediump float;
varying vec3 vColor;
void main() {
    gl_FragColor = vec4(vColor, 1);
}
`);
gl.compileShader(fragmentShader);
console.log(gl.getShaderInfoLog(fragmentShader));

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);


// const colorLocation = gl.getAttribLocation(program, `color`);
// gl.enableVertexAttribArray(colorLocation);
// gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
// gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);

const uniformLocations = {
    matrix: gl.getUniformLocation(program, 'matrix'),
};


const modelMatrix = mat4.create(); // Matrix for all of the objects in the space. edit this to transform them
const viewMatrix = mat4.create(); // Camera matrix. edit this to move objects based on controller movement 
const projectionMatrix = mat4.create(); // Just Performs the projection so things look 3D
mat4.perspective(projectionMatrix, 
    105 * Math.PI/180, // vertical field-of-view (angle, radians)
    canvas.width/canvas.height, // aspect W/H
    1e-4, // near cull distance
    1e4 // far cull distance
);

const mvMatrix = mat4.create(); // Model-View Matrix
const mvpMatrix = mat4.create(); // Model-View-Projection Matrix

mat4.translate(modelMatrix, modelMatrix, [0, 0, -2]); // moving objects




// Keyboard Input


var tx = 0.0; // float for camera x movement
var ty = 0.0; // float for camera y movement 
var tz = 0.0; // float for camera z movement

var wstatus = false;
var sstatus = false; 
var astatus = false;
var dstatus = false; 

const bodyElement = document.querySelector("body");

bodyElement.addEventListener("keydown", keyDown, false);
bodyElement.addEventListener("keyup", keyUp, false);
//setInterval(parseKeys, 30);

function keyDown(event) {
    switch (event.key) {

        case 'w':
            wstatus = true;
            break;
        case 'a':
            astatus = true;
            break;
        case 's':
            sstatus = true;
            break;
        case 'd':
            dstatus = true;
            break;

    }
}

function keyUp(event) {
    switch (event.key) {

        case 'w':
            wstatus = false;
            break;
        case 'a':
            astatus = false;
            break;
        case 's':
            sstatus = false;
            break;
        case 'd':
            dstatus = false;
            break;

    }
}

function parseKeys() {
    console.log(wstatus,astatus,sstatus,dstatus);

    if(wstatus && astatus && sstatus && dstatus) {
        return;
    }

    if (wstatus && dstatus) {} //do nothing
    else if (wstatus) {tz -= 0.05;}
    else if (sstatus) {tz += 0.05;}

    if (wstatus && dstatus) {} //do nothing
    else if (dstatus) {tx += 0.05;}
    else if (astatus) {tx -= 0.05;}
}

// Mouse Input
canvas.addEventListener("mousemove", updateMousePosition, false);
//window.addEventListener("mouseleave", mouseLeave, false);

function mouseMove(event) {
    updateMousePosition(event);
}

var prevX = 0;
var prevY = 0;
function updateMousePosition(event) {
  // Get the mouse position relative to the window
  var x = event.pageX;
  var y = event.pageY;

  console.log(event.pageX, event.pageY);

  // Calculate the relative mouse movement
  var dx = x - prevX;
  var dy = y - prevY;
  prevX = x;
  prevY = y;

  // Check the direction of mouse movement
  if (dx < 0) {
    // Mouse is moving left
    //console.log("Mouse is moving left");
  } else if (dx > 0) {
    // Mouse is moving right
  }
  if (dy < 0) {
    // Mouse is moving up
  } else if (dy > 0) {
    // Mouse is moving down
  }
}

function mouseLeave(event) {
    scrollTo(canvas.width / 2.0 , canvas.height / 2.0);
}



function animate(event) {
    requestAnimationFrame(animate);

    window.scrollTo(0,0);

    parseKeys()
    mat4.translate(viewMatrix, viewMatrix, [tx, ty, tz]); // moving camera
    mat4.invert(viewMatrix, viewMatrix);

    mat4.multiply(mvMatrix, viewMatrix, modelMatrix);
    mat4.multiply(mvpMatrix, projectionMatrix, mvMatrix);

    gl.uniformMatrix4fv(uniformLocations.matrix, false, mvpMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
}


animate()
//*/