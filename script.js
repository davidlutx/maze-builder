let grid, rowC, colC, cellDim;

function makeMaze() {
    rowC = Number(document.getElementById("rows").value);
    colC = Number(document.getElementById("cols").value);
    let mazeBox = document.getElementById("maze");
    mazeBox.innerHTML = "";
    cellDim = 1000 / Math.max(rowC, colC);
    
    grid = Array(rowC).fill().map(() => Array(colC).fill(15));
    
    function knockWall(x, y, dir) {
        grid[y][x] &= ~(1 << dir);
        let [nx, ny] = [x + [1, 0, -1, 0][dir], y + [0, 1, 0, -1][dir]];
        if (nx >= 0 && nx < colC && ny >= 0 && ny < rowC) {
            grid[ny][nx] &= ~(1 << ((dir + 2) % 4));
        }
    }
    
    function digPath(x, y) {
        let dirs = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
        
        for (let dir of dirs) {
            let [nx, ny] = [x + [1, 0, -1, 0][dir], y + [0, 1, 0, -1][dir]];
            if (nx >= 0 && nx < colC && ny >= 0 && ny < rowC && grid[ny][nx] === 15) {
                knockWall(x, y, dir);
                digPath(nx, ny);
            }
        }
    }
    
    digPath(0, 0);
    render();
}

function render() {
    let mazeBox = document.getElementById("maze");
    for (let y = 0; y < rowC; y++) {
        for (let x = 0; x < colC; x++) {
            if (grid[y][x] & 1) putWall(x, y, 0);
            if (grid[y][x] & 2) putWall(x, y, 1);
            if (x === 0 && (grid[y][x] & 4)) putWall(x, y, 2);
            if (y === 0 && (grid[y][x] & 8)) putWall(x, y, 3);
        }
    }
    
    let en = document.createElement("div");
    en.className = "wall start";
    en.style.cssText = "width:10px;height:10px;left:0;top:0";
    mazeBox.appendChild(en);
    
    let exit = document.createElement("div");
    exit.className = "wall end";
    exit.style.cssText = `width:10px;height:10px;left:${(colC-1)*cellDim}px;top:${(rowC-1)*cellDim}px`;
    mazeBox.appendChild(exit);
}

function putWall(x, y, dir) {
    let wall = document.createElement("div");
    wall.className = "wall";
    let style = dir % 2 === 0
        ? `width:2px;height:${cellDim}px;left:${(x + (dir === 0 ? 1 : 0)) * cellDim}px;top:${y * cellDim}px`
        : `width:${cellDim}px;height:2px;left:${x * cellDim}px;top:${(y + (dir === 1 ? 1 : 0)) * cellDim}px`;
    wall.style.cssText = style;
    document.getElementById("maze").appendChild(wall);
}

function solveMaze() {
    let route = [];
    let seen = Array(rowC).fill().map(() => Array(colC).fill(false));
    
    function findPath(x, y) {
        if (x === colC - 1 && y === rowC - 1) return true;
        seen[y][x] = true;
        for (let dir of [0, 1, 2, 3]) {
            if (!(grid[y][x] & (1 << dir))) {
                let [nx, ny] = [x + [1, 0, -1, 0][dir], y + [0, 1, 0, -1][dir]];
                if (nx >= 0 && ny >= 0 && nx < colC && ny < rowC && !seen[ny][nx]) {
                    route.push([nx, ny]);
                    if (findPath(nx, ny)) return true;
                    route.pop();
                }
            }
        }
        return false;
    }
    
    route.push([0, 0]);
    findPath(0, 0);
    
    for (let [x, y] of route) {
        let ps = document.createElement("div");
        ps.className = "wall solution";
        ps.style.cssText = `width:${cellDim}px;height:${cellDim}px;left:${x*cellDim}px;top:${y*cellDim}px`;
        document.getElementById("maze").appendChild(ps);
    }
}

makeMaze();
