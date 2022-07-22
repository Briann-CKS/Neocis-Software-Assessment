// Javascript for Part 1 of Software Assessment

/* ------------------------- Variable declaration -------------------------- */
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const form = document.getElementById("uploadForm"); // submit button
const clearButton = document.getElementById("btn1"); // clear button
const file = document.getElementById("textFile"); // file upload
const canvasWidth= canvas.width;
const canvasHeight = canvas.height;

let headerInfo = [];
let arr = [];
let initialPoint = null; // location of mouse when first pressed
let endPoint = null; // location of mouse when released

// Shift values for the origin to be at the center of the canvas
const transform = {
  x: canvasWidth / 2,
  y: canvasHeight / 2
}

// Move origin to the center of the canvas
ctx.translate(transform.x, transform.y);

/* ------------------------- Function declaration -------------------------- */

// Creating a coordinate function to create coordinate objects
const Coordinate = function(x, y, z = 0) {
  this.x = 75 * x;
  this.y = -75 * y; // solves the -ve y direction
  this.z = 75 * z;
}

// Calculate distance between two points
function getDistance(x1, y1, x2, y2){
  return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
}

// Convert contents from the text file into arrays of list
function csvToArray(str, delimiter = ",") {
  const headers = str.slice(0, str.indexOf("\n")).trim().split(delimiter);
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");
  for (let i = 0; i < rows.length; i++){
    arr.push(rows[i].trim().split(delimiter));
  }
  headerInfo.push(parseFloat(headers[0]));
  headerInfo.push(parseFloat(headers[1]));
  console.log(headerInfo);
  for (let i = 0; i < arr.length; i++){
    for (let j = 0; j < arr[i].length; j ++)
    {
      arr[i][j] = parseFloat(arr[i][j]);
    }
  }
  drawVertices(headerInfo, arr);
}

// Draw all the vertices
function drawVertices (headerInfo, arr)
{
  if (headerInfo[0] === 0 || arr.length === 0)
  {
    alert("Your file is not read successfully");
    return;
  }
  for (let i = 0; i < headerInfo[0]; i++)
  {
    ctx.beginPath();
    ctx.fillStyle = "blue";
    let point = new Coordinate(arr[i][1], arr[i][2]);
    ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
    ctx.fill();
  }
  drawFaces(headerInfo, arr);
}

// Connect vertices of the same face to form a side
function drawFaces (headerInfo, arr){
  for (let i = 0; i < headerInfo[1]; i++)
  {
    let points = [];
    for (let j = 0; j < arr[headerInfo[0]+i].length; j++)
    {
      points.push(getCoordinate(arr[headerInfo[0]+i][j], headerInfo, arr));
    }
    if (points == [])
    {
      alert("Error reading your file");
      return;
    }
    for (let i = 0; i < points.length - 1; i++)
    {
      drawLine(points[i].x, points[i].y, points[i+1].x, points[i+1].y)
    }
    drawLine(points[points.length - 1].x, points[points.length - 1].y, points[0].x, points[0].y);
  }
}

// Look for the correct id and return its corresponding vertex
function getCoordinate(id, headerInfo, arr){
  for (let i = 0; i < headerInfo[0]; i++)
  {
    if (arr[i][0] === id)
    {
      let point = new Coordinate(arr[i][1], arr[i][2]);
      return point;
    }
  }
}

// Draw straight lines to connect from one vertex to another
function drawLine (x1, y1, x2, y2)
{
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

// function rotateImage() { updateImage(); }
// function updateImage(){}

/* ---------------------------- Event Listeners ---------------------------- */

// Event listener when submit button is clicked
form.addEventListener("submit", function(e){
  e.preventDefault();
  arr = [];
  headerInfo = [];
  ctx.clearRect(-200, -200, 400, 400);
  const input = file.files[0];
  const reader = new FileReader();
  reader.onload = function(event){
    const text = event.target.result;
    csvToArray(text);
  };
  reader.readAsText(input);
});

// Event listener when clear button is clicked
clearButton.addEventListener("click", function(event){
  location.reload();
});

// Event listener when mouse is pressed
canvas.addEventListener("mousedown", function(event){
  initialPoint = {
    x: event.offsetX,
    y: event.offsetY
  }

  // Event listener when mouse is held and dragged
  canvas.addEventListener("mousemove", function(e){
    let dragDistanceX = e.offsetX - initialPoint.x;
    let dragDistanceY = e.offsetY - initialPoint.y;
    // rotateImage();
  });
});

// Event listener when mouse is released
canvas.addEventListener("mouseup", function(event){
  console.log("Mouse is lifted");
  endPoint = {
    x: event.offsetX,
    y: event.offsetY
  }
});

// Event listener when mouse is clicked
canvas.addEventListener("click", getMousePos);
function getMousePos(event) {
  console.log("Mouse is clicked");
    var rect = canvas.getBoundingClientRect();
    let mousePos = {
        x: event.clientX - rect.left - transform.x,
        y: -1 * (event.clientY - rect.top - transform.y)
    }
    console.log(mousePos);
}
