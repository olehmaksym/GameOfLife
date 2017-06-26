let canvas = document.getElementById("playArea");
let ctx = canvas.getContext("2d");
canvas.addEventListener('click', mouseClick,  false);

let cellSize = 15, 
    col = 50,
    row = 30,  
    noc = row * col,
    width = col * cellSize, 
    height = row *cellSize;

canvas.width = width;
canvas.height = height;

ctx.fillStyle = "#00ffb5"; // color cells 

//===============================================
// Draw mesh
function drawMesh() {
  ctx.beginPath();
  for (var yl = 1; yl < col; yl++) {
    ctx.moveTo(cellSize * yl , 0);
    ctx.lineTo(cellSize * yl , height);
  }
  for (var xl = 1; xl < row; xl++) {
    ctx.moveTo(0 , cellSize * xl);
    ctx.lineTo(width , cellSize * xl);
  }
  ctx.lineWidth = 1;
  ctx.strokeStyle="#888";
  ctx.stroke();
}
drawMesh();

//===============================================
// Fill up allCell array
let allCell = []; // array of all cells
{
  let cellIndex = 0;
  // count cell-name
  for (let y = 0; y < row; y++) {
    for (let x = 0; x < col; x++) {
      let name = 'x' + (cellSize * x) + 'y' + (cellSize * y); 
      allCell.push({
        name : name,
        x : cellSize * x,
        y : cellSize * y,
        index : cellIndex,
        isLife : false,
        neighbor : '',
        liveNeighbor : '',
      });
      cellIndex++;
    }   
  }
}

//===============================================
// Search  neighbor cell
{
  function get4Coor(index,n1,n2,n3){
    allCell[index].neighbor = [n1,n2,n3];
  }
  function get6Coor(index,n1,n2,n3,n4,n5) {
    allCell[index].neighbor = [n1,n2,n3,n4,n5];
  }
  for (let n = 0; n < allCell.length; n++) {
    let x = allCell[n].x,
        y = allCell[n].y,
        i = allCell[n].index,
        i1 = i - col - 1,
        i2 = i - col,
        i3 = i - col + 1,
        i4 = i + 1,
        i5 = i + col + 1,
        i6 = i + col,
        i7 = i + col - 1,
        i8 = i - 1;
  
    if (x === 0 && y === 0) get4Coor(i,i4,i5,i6);
    else if (x === width - cellSize && y === 0) get4Coor(i,i6,i7,i8);
    else if (x === width - cellSize && y === height-cellSize) get4Coor(i,i1,i2,i8);
    else if (x === 0 && y === height-cellSize) get4Coor(i,i2,i3,i4);

    else if (y === 0) get6Coor(i,i4,i5,i6,i7,i8);
    else if (x === width - cellSize) get6Coor(i,i1,i2,i6,i7,i8);
    else if (y === height - cellSize) get6Coor(i,i1,i2,i3,i4,i8);
    else if (x === 0) get6Coor(i,i2,i3,i4,i5,i6);

    else allCell[n].neighbor = [i1,i2,i3,i4,i5,i6,i7,i8];
  }
}

//===============================================
// Check cell bloc
function createCell(index) {
  allCell[index].isLife = true;
  ctx.fillRect(allCell[index].x,allCell[index].y,cellSize,cellSize);
}
function deleteCell(index) {
  allCell[index].isLife = false;
  ctx.clearRect(allCell[index].x,allCell[index].y,cellSize,cellSize);
}
// check cell function
function checkCell(x,y) {
  x = x - x % cellSize;
  y = y - y % cellSize;
  let cell = 'x' + x + 'y' + y;
  for (let i = 0; i < allCell.length; i++) {
    if (allCell[i].name === cell) {
      allCell[i].isLife === true ? deleteCell(allCell[i].index) : createCell(allCell[i].index);
    }
  }
  drawMesh();
}

//===============================================
// click function
function mouseClick(event) {
  let x = event.pageX - 10;
  let y = event.pageY - 10;
  checkCell(x, y);
} 

//===============================================
// Count live neighbor
function countLiveNeighbor() {
  for (let i = 0; i < allCell.length; i++) {
    allCell[i].liveNeighbor = 0;
    for (let j = 0; j < allCell[i].neighbor.length; j++) {

      if (allCell[allCell[i].neighbor[j]].isLife === true) {
        allCell[i].liveNeighbor++;
      }
    }
  }
}

//rules
  let gen = 0;

function nextGeneration() {
  countLiveNeighbor();
  for (let i = 0; i < allCell.length; i++) {
    if (allCell[i].isLife === true && (allCell[i].liveNeighbor < 2 || allCell[i].liveNeighbor > 3)) {
      deleteCell(i);
    }
    else if (allCell[i].isLife === false && allCell[i].liveNeighbor === 3) {
      createCell(i);
    }
  }
  drawMesh();
  gen++;
  console.log(`Gen ${gen}`);
  document.getElementById('gen').innerHTML = gen;
}

let timerId;

function butPause() {
  clearTimeout(timerId);
  console.log('Pause');
}
function butStart() {
  timerId = setInterval(nextGeneration,400);
}

function nextGen() {
  nextGeneration();
  console.log('next Gen');
}