/**
 * Created by: Yan@yan.my * Date: 9/24/12 3:57 PM
 */

var LIFE = function (parent) {
    var my = parent.calc = parent.calc || {},
        matrix = [];

    my.getMatrix = function () {
        return matrix;
    };

    my.setMatrix = function (m) {
        matrix = m;
        return this;
    };

    // Creates empty matrix filled with zeros of required size
    my.initMatrix = function (width, height) {
        var mat = [];
        var i;
        for (i = 0; i < height; i += 1) {
            var a = [];
            for (var j = 0; j < width; j += 1) {
                a[j] = 0;
            }
            mat[i] = a;
        }
        matrix = mat;
        return this;
    };

    //Basic rules of Game of Life rules implemented here.
    my.cellTick = function (cell, neighbors) {
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

    //How many neighbors does this cell have?
    my.countNeighbors = function (cell, row) {
        var m = matrix;
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

    //calculate next matrix based on current one
    my.matrixTick = function () {
        matrix = matrix.map(function (row, rowIndex) {
            return row.map(function (cell, cellIndex) {
                return this.cellTick(cell, this.countNeighbors(cellIndex, rowIndex));
            }, this);
        }, this);
        return this
    };


    my.clearMatrix = function () {
        matrix = matrix.map(function (row) {
            return row.map(function () {
                return 0;
            });
        });
        return this
    };

    my.addPattern = function (pattern) {
        if (!$.isArray(pattern)) {
            throw "Non array given to addPattern";
        }
        this.clearMatrix();
        //Calculate how much we need to shift pattern to position it in the center of the matrix.
        var colShift = Math.round((matrix[0].length - pattern[0].length) / 2);
        var rowShift = Math.round((matrix.length - pattern.length) / 2);

        pattern.reduce(function (a, b, row) {
            b.reduce(function (a, b, col) {
                matrix[row + rowShift][col + colShift] = pattern[row][col];
            }, 0);
        }, 0);
        return this;
    };


    my.changeCell = function (id) {
        var row, cell;
        row = id.split(".")[0];
        cell = id.split(".")[1];
        matrix[row][cell] = (matrix[row][cell] === 1 ? 0 : 1);
        return this;
    };


    return parent;
}(LIFE || {});