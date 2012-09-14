var Life = Life || {};
Life.matrix = [];

Life.speed = 1000; //How long to wait between iterations in milliseconds

//Fill matrix with zeros
Life.initMatrix = function (width, height) {
    var mat = [];
    var i;
    for (i = 0; i < height; i += 1) {
        var a = [];
        for (var j = 0; j < width; j += 1) {
            a[j] = 0;
        }
        mat[i] = a;
    }
    Life.matrix = mat;
    Life.drawGrid();
};


//Basic Life rules implemented here.
Life.cellTick = function (cell, neighbors) {
    if (neighbors < 2) {
        return 0;
    }
    if (neighbors == 2) {
        return cell;
    }
    if (neighbors == 3) {
        return 1;
    }
    if (neighbors > 3) {
        return 0;
    }
};

//calculate next matrix based on current one
Life.matrixTick = function () {
    Life.matrix = Life.matrix.map(function (row, rowIndex) {
        return row.map(function (cell, cellIndex) {
            return Life.cellTick(cell, Life.countNeighbors(cellIndex, rowIndex));
        });
    });
    Life.updateGrid();
};

//How many neighbors does this cell have?
Life.countNeighbors = function (cell, row) {
    var m = Life.matrix;
    var prevRow, prevCell, nextRow, nextCell, neighbors = [];

    //this is to wrap the field to make it of "infinity" size. Eg if cell is moving over the right side of the matrix it will reapper on the left side.
    //We are also making sure no out of bounds errors thrown by matrix array.
    if (row - 1 >= 0) {
        prevRow = row - 1;
    } else {
        prevRow = m.length - 1;
    }
    if (row + 1 < m.length) {
        nextRow = row + 1;
    } else {
        nextRow = 0;
    }
    if (cell - 1 >= 0) {
        prevCell = cell - 1;
    } else {
        prevCell = m[row].length - 1;
    }
    if (cell + 1 < m[row].length) {
        nextCell = cell + 1;
    } else {
        nextCell = 0;
    }

    //Listing manually all 8 possible neighbors
    neighbors.push(m[prevRow][prevCell]);
    neighbors.push(m[prevRow][cell]);
    neighbors.push(m[prevRow][nextCell]);
    neighbors.push(m[row][prevCell]);
    neighbors.push(m[row][nextCell]);
    neighbors.push(m[nextRow][prevCell]);
    neighbors.push(m[nextRow][cell]);
    neighbors.push(m[nextRow][nextCell]);

    //count values in the neighbour cells to get a neighbor count.
    return neighbors.reduce(function (a, b) {
        if (!a) {
            a = 0;
        }
        if (!b) {
            b = 0;
        }
        return a + b;
    });
};

//Draw table/container to show the matrix
Life.drawGrid = function () {
    var matrix = Life.matrix;
    var table = document.createElement("table");
    table.setAttribute("class", "life");
    var i;
    for (i = 0; i < matrix.length; i += 1) {
        var row = table.insertRow(-1);
        for (var j = 0; j < matrix[0].length; j += 1) {
            var cell = row.insertCell(-1);
            cell.setAttribute("id", i.toString() + '.' + j.toString());
            cell.setAttribute("onClick", "Life.changeCell(this.id);");
        }
    }
    Life.table = table;
    Life.updateGrid();
};

//update classes of cells to display new state of matrix
Life.updateGrid = function () {
    var table = Life.table;
    var matrix = Life.matrix;
    if (table.rows.length !== matrix.length || table.rows[0].cells.length !== matrix[0].length) {
        throw "size of table and matrix are different";
    }
    var r;
    for (r = 0; r < matrix.length; r += 1) {
        var c;
        for (c = 0; c < matrix[r].length; c += 1) {
            table.rows[r].cells[c].setAttribute("class", (matrix[r][c] ? "live" : "dead"));
        }
    }
};

Life.changeCell = function (id) {
    var row, cell;
    row = id.split(".")[0];
    cell = id.split(".")[1];
    Life.matrix[row][cell] = (Life.matrix[row][cell] === 1 ? 0 : 1);
    Life.updateGrid();
};

Life.play = function () {
    $("#play").hide();
    $("#pause").show();
    clearTimeout(Life.timeout);
    Life.matrixTick();
    Life.timeout = setTimeout(function () {
        Life.play();
    }, Life.speed);
};

Life.clearMatrix = function () {
    Life.pause();
    Life.matrix = Life.matrix.map(function (row) {
        return row.map(function () {
            return 0;
        });
    });
    Life.updateGrid();
};
Life.addPattern = function (pattern) {
    if (!$.isArray(pattern)) {
        throw "Non array given to addPattern";
    }
    Life.clearMatrix();
    //Calculate how much we need to shift pattern to position it in the center of the matrix.
    var colShift = Math.round((Life.matrix[0].length - pattern[0].length) / 2);
    var rowShift = Math.round((Life.matrix.length - pattern.length) / 2);

    pattern.reduce(function (a, b, row) {
        b.reduce(function (a, b, col) {
            Life.matrix[row + rowShift][col + colShift] = pattern[row][col];
        }, 0);
    }, 0);

    Life.updateGrid();
};
Life.pause = function () {
    clearTimeout(Life.timeout);
    $("#pause").hide();
    $("#play").show();
}