buster.testCase("A module life", {
    "exists":function () {
        assert(Life);
    },
    "has matrix":function () {
        assert(Life.matrix);
    },
    "has speed":function () {
        assert(Life.speed);
    }
});

buster.testCase("A function initMatrix", {
    setUp:function () {
        this.stub(Life, "drawGrid");
        this.width = 25;
        this.height = 20;
        this.matrix = Life.initMatrix(this.width, this.height);
    },
    "returns an array":function () {
        assert($.isArray(Life.matrix));
    },
    "array size is === matrix height":function () {
        assert.equals(Life.matrix.length, this.height);
    },
    "has each row.length of width":function () {
        assert(Life.matrix.every(function (row) {
            if (row.length === this.width) {
                return true;
            }
        }, this));
    },
    "has each value equal to 0":function () {
        assert(Life.matrix.every(function (row) {
            if (row.every(function (value) {
                if (value === 0) {
                    return true;
                }
            })) {
                return true;
            }
        }));
    },
    "calls drawGrid()":function () {
        assert.calledOnce(Life.drawGrid);
    }
});

buster.testCase("A function cellTick", {
    setUp:function () {
        this.liveCell = 1;
        this.deadCell = 0;
    },
    "Cell dies in case <2 neighbors":function () {
        assert.equals(Life.cellTick(this.liveCell, 1), 0);
        assert.equals(Life.cellTick(this.deadCell, 1), 0);
    },
    "Cell does not change in case 2 neighbors":function () {
        assert.equals(Life.cellTick(this.liveCell, 2), 1);
        assert.equals(Life.cellTick(this.deadCell, 2), 0);
    },
    "Cell is born in case ===3 neighbors":function () {
        assert.equals(Life.cellTick(this.liveCell, 3), 1);
        assert.equals(Life.cellTick(this.deadCell, 3), 1);
    },
    "Cell dies in case >3 neighbors":function () {
        assert.equals(Life.cellTick(this.liveCell, 4), 0);
        assert.equals(Life.cellTick(this.deadCell, 4), 0);
    }
});

buster.testCase("A function count neighbors", {
    setUp:function () {
        Life.matrix = [
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1]
        ];
    },
    "exist":function () {
        assert(Life.countNeighbors);
    },
    "counts all 8 neighbors":function () {
        assert.equals(Life.countNeighbors(1, 1), 8)
    },
    "counts all 8 neighbors in corner":function () {
        assert.equals(Life.countNeighbors(0, 0), 8)
    },
    "counts all 8 neighbors near wall":function () {
        assert.equals(Life.countNeighbors(0, 1), 8)
    },
    "do not counts zeroes":function () {
        Life.matrix = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        assert.equals(Life.countNeighbors(2, 2), 0)
    }
});

buster.testCase("A function matrixTick", {
    setUp:function () {
        this.stub(Life, "updateGrid");
        this.matrix1a = [
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0]
        ];
        this.matrix2a = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 1, 1, 1, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ];
        this.matrix1b = [
            [0, 0, 0, 0, 0, 0],
            [0, 1, 1, 0, 0, 0],
            [0, 1, 1, 0, 0, 0],
            [0, 0, 0, 1, 1, 0],
            [0, 0, 0, 1, 1, 0],
            [0, 0, 0, 0, 0, 0]
        ];
        this.matrix2b = [
            [0, 0, 0, 0, 0, 0],
            [0, 1, 1, 0, 0, 0],
            [0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0],
            [0, 0, 0, 1, 1, 0],
            [0, 0, 0, 0, 0, 0]
        ];
    },
    "alternates test matrixes 1a & 2a":function () {
        Life.matrix = this.matrix1a;
        Life.matrixTick();
        assert.equals(Life.matrix, this.matrix2a);

        Life.matrix = this.matrix2a;
        Life.matrixTick();
        assert.equals(Life.matrix, this.matrix1a);
    },
    "alternates test matrixes 1b & 2b":function () {
        Life.matrix = this.matrix1b;
        Life.matrixTick();
        assert.equals(Life.matrix, this.matrix2b);
        Life.matrix = this.matrix2b;
        Life.matrixTick();
        assert.equals(Life.matrix, this.matrix1b);
    },
    "calls updateGrid()":function () {
        Life.matrix = this.matrix1a;
        Life.matrixTick();
        assert.called(Life.updateGrid);
    }
});

buster.testCase("A function drawGrid makes table:", {
    setUp:function () {
        Life.matrix = [
            [1, 0, 0],
            [0, 1, 1],
            [0, 1, 0],
            [1, 1, 0]
        ];
        Life.drawGrid();
    },
    "with class life":function () {
        assert.equals(Life.table.getAttribute("class"), "life");
    },
    "with right amount of rows":function () {
        assert.equals(Life.table.rows.length, Life.matrix.length);
    },
    "with right amount of columns in each row":function () {
        assert(Array.prototype.slice.call(Life.table.rows).every(function (row) {
            if (row.cells.length === Life.matrix[0].length) {
                return true;
            }
        }));
    },
    "with Life.changeCell() function hooked to onClick event of every cell":function () {
        assert(Array.prototype.slice.call(Life.table.rows).every(function (row, rowIndex) {
            return Array.prototype.slice.call(row.cells).every(function (cell, cellIndex) {
                if (cell.getAttribute("onClick") === "Life.changeCell(this.id);") {
                    return true;
                } else {
                    console.log(cell.getAttribute("onClick"));
                }
            });
        }));
    },
    "with correct coordinates ID in each cell":function () {
        assert(Array.prototype.slice.call(Life.table.rows).every(function (row, rowIndex) {
            return Array.prototype.slice.call(row.cells).every(function (cell, cellIndex) {
                if (cell.getAttribute("id").toString() === (rowIndex.toString() + '.' + cellIndex.toString())) {
                    return true;
                }
            });
        }));
    }
});

buster.testCase("A function updateGrid:", {
    setUp:function () {
        Life.matrix = [
            [0, 1],
            [1, 0]
        ];
        Life.drawGrid();
        Life.updateGrid();
    },
    "applies 'class' to each table cell according to the matrix given":function () {
        assert(Life.table.rows[0].cells[0].getAttribute("class"), "dead");
        assert(Life.table.rows[0].cells[1].getAttribute("class"), "live");
        assert(Life.table.rows[1].cells[0].getAttribute("class"), "live");
        assert(Life.table.rows[1].cells[1].getAttribute("class"), "dead");
    },
    "throws exception when matrix and table are of different size":function () {
        assert.exception(function () {
            Life.matrix = [
                [0, 1, 0],
                [0, 1, 0],
                [1, 0, 1]
            ];
            Life.updateGrid();
        });
    }
});


buster.testCase("A function changeCell:", {
    setUp:function () {
        this.stub(Life, "updateGrid");
        Life.matrix = [
            [0, 1]
        ];
        Life.drawGrid();
        Life.changeCell("0.0");
        Life.changeCell("0.1");
    },
    "changes cell inside matrix":function () {
        assert(Life.matrix[0][0] === 1);
        assert(Life.matrix[0][1] === 0);
    },
    "calls updateGrid()":function () {
        assert.called(Life.updateGrid);
    }
});

buster.testCase("A function clearMatrix:", {
    setUp:function () {
        this.stub(Life, "updateGrid");
        Life.matrix = [
            [1, 1],
            [1, 1]
        ];
    },

    "makes every cell == to zero":function () {
        assert(Array.prototype.slice.call(Life.matrix).every(function (row) {
            return Array.prototype.slice.call(row).every(function (cell) {
                if (cell === 1) {
                    return true;
                }
            });
        }));
        Life.clearMatrix();
        assert(Array.prototype.slice.call(Life.matrix).every(function (row) {
            return Array.prototype.slice.call(row).every(function (cell) {
                if (cell === 0) {
                    return true;
                }
            });
        }));
    },
    "calls updateGrid()":function () {
        Life.clearMatrix();
        assert.called(Life.updateGrid);
    }
});


buster.testCase("A function addPattern:", {
    setUp:function () {
        this.stub(Life, "updateGrid");

        Life.pattern = [
            [1, 0],
            [0, 1]
        ];
        Life.matrix = [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1]
        ];
    },
    "calls updateGrid()":function () {
        Life.addPattern(Life.pattern);
        assert.called(Life.updateGrid);
    },
    "calls clearMatrix()":function () {
        this.stub(Life, "clearMatrix");
        Life.addPattern(Life.pattern);
        assert.called(Life.clearMatrix);
    },
    "Throws exception if non array given as a parameter":function () {
        assert.exception(function () {
            Life.addPattern('d');
        });
        assert.exception(function () {
            Life.addPattern(1);
        });
    },
    " adds as many live cells to matrix as necessary":function () {
        Life.addPattern(Life.pattern);
        assert.equals(Life.matrix.reduce(function (a, b) {
            return a + b.reduce(function (a,b) {return a+b;});
        },0),2);
    }
});

