buster.testCase("A module life", {
    "exists":function () {
        assert(LIFE);
    },

    "has calc module":function () {
        assert(LIFE.calc);
    },
    "has draw module":function () {
        assert(LIFE.draw);
    }
});


buster.testCase("A function .calc.setMatrix", {
    setUp:function () {
        this.matrix = [
            [0, 0],
            [1, 1]
        ];
        LIFE.calc.setMatrix(this.matrix);
    },
    "returns same matrix in calc object object":function () {
        assert.equals(LIFE.calc.getMatrix(),this.matrix);
    }
});

buster.testCase("A function calc.initMatrix", {
    setUp:function () {
        this.width = 25;
        this.height = 20;
        this.matrix = LIFE.calc.initMatrix(this.width, this.height).getMatrix();
    },
    "returns an array":function () {
        assert($.isArray(this.matrix));
    },
    "array size is === matrix height":function () {
        assert.equals(this.matrix.length, this.height);
    },
    "has each row.length of width":function () {
        assert(this.matrix.every(function (row) {
            if (row.length === this.width) {
                return true;
            }
        }, this));
    },
    "has each value equal to 0":function () {
        assert(this.matrix.every(function (row) {
            if (row.every(function (value) {
                if (value === 0) {
                    return true;
                }
            })) {
                return true;
            }
        }));
    }
});


buster.testCase("A function calc.cellTick", {
    setUp:function () {
        this.liveCell = 1;
        this.deadCell = 0;
    },
    "Cell dies in case <2 neighbors":function () {
        assert.equals(LIFE.calc.cellTick(this.liveCell, 1), 0);
        assert.equals(LIFE.calc.cellTick(this.deadCell, 1), 0);
    },
    "Cell does not change in case 2 neighbors":function () {
        assert.equals(LIFE.calc.cellTick(this.liveCell, 2), 1);
        assert.equals(LIFE.calc.cellTick(this.deadCell, 2), 0);
    },
    "Cell is born in case ===3 neighbors":function () {
        assert.equals(LIFE.calc.cellTick(this.liveCell, 3), 1);
        assert.equals(LIFE.calc.cellTick(this.deadCell, 3), 1);
    },
    "Cell dies in case >3 neighbors":function () {
        assert.equals(LIFE.calc.cellTick(this.liveCell, 4), 0);
        assert.equals(LIFE.calc.cellTick(this.deadCell, 4), 0);
    }
});


buster.testCase("A function calc.countNeighbors", {
    setUp:function () {
        LIFE.calc.setMatrix([
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1]
        ]);
    },
    "counts all 8 neighbors":function () {
        assert.equals(LIFE.calc.countNeighbors(1, 1), 8)
    },
    "counts all 8 neighbors in corner":function () {
        assert.equals(LIFE.calc.countNeighbors(0, 0), 8)
    },
    "counts all 8 neighbors near wall":function () {
        assert.equals(LIFE.calc.countNeighbors(0, 1), 8)
    },
    "do not counts zeroes":function () {
        LIFE.calc.setMatrix([
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]);
        assert.equals(LIFE.calc.countNeighbors(2, 2), 0)
    }
});


buster.testCase("A function matrixTick", {
    setUp:function () {
        this.matrix1a = [
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0]
        ];
        this.matrix1b = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 1, 1, 1, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ];
        this.matrix2a = [
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
    "alternates test matrixes 1a => 1b and 2a => 2b":function () {
        assert.equals(LIFE.calc.setMatrix(this.matrix1a).matrixTick().getMatrix(), this.matrix1b);
        assert.equals(LIFE.calc.setMatrix(this.matrix2a).matrixTick().getMatrix(), this.matrix2b);
    },
    "alternates test matrixes to themselves after 2-nd itereation":function () {
        assert.equals(LIFE.calc.setMatrix(this.matrix1a).matrixTick().matrixTick().getMatrix(), this.matrix1a);
        assert.equals(LIFE.calc.setMatrix(this.matrix2a).matrixTick().matrixTick().getMatrix(), this.matrix2a);
    }
});

//
buster.testCase("A function draw.drawTable makes table:", {
    setUp:function () {
        this.width = 3;
        this.height = 4;

        LIFE.draw.drawTable(this.width,this.height);
    },
    "with class life":function () {
        assert.equals(LIFE.draw.getTable().getAttribute("class"), "life");
    },
    "with right amount of rows":function () {
        assert.equals(LIFE.draw.getTable().rows.length, this.height);
    },
    "with right amount of columns in each row":function () {
        assert(Array.prototype.slice.call(LIFE.draw.getTable().rows).every(function (row) {
            if (row.cells.length === this.width) {
                return true;
            }
        },this));
    },
    "with Life.changeCell() function hooked to onClick event of every cell":function () {
        assert(Array.prototype.slice.call(LIFE.draw.getTable().rows).every(function (row, rowIndex) {
            return Array.prototype.slice.call(row.cells).every(function (cell, cellIndex) {
                if (cell.getAttribute("onClick") === "LIFE.manualDraw(this.id);") {
                    return true;
                } else {
                    console.log(cell.getAttribute("onClick"));
                }
            });
        }));
    },
    "with correct coordinates ID in each cell":function () {
        assert(Array.prototype.slice.call(LIFE.draw.getTable().rows).every(function (row, rowIndex) {
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
        this.matrix = [
            [0, 1],
            [1, 0]
        ];
        LIFE.draw.drawTable(2,2).updateGrid(this.matrix);
    },
    "applies 'class' to each table cell according to the matrix given":function () {
        assert(LIFE.draw.getTable().rows[0].cells[0].getAttribute("class"), "dead");
        assert(LIFE.draw.getTable().rows[0].cells[1].getAttribute("class"), "live");
        assert(LIFE.draw.getTable().rows[1].cells[0].getAttribute("class"), "live");
        assert(LIFE.draw.getTable().rows[1].cells[1].getAttribute("class"), "dead");
    },
    "throws exception when matrix and table are of different size":function () {
        assert.exception(function () {
            LIFE.draw.drawTable(3,3).updateGrid(this.matrix);
            LIFE.draw.updateGrid();
        });
    }
});


buster.testCase("A function changeCell:", {
    setUp:function () {
        LIFE.calc.setMatrix([
            [0, 1]
        ]);
        LIFE.calc.changeCell("0.0");
        LIFE.calc.changeCell("0.1");
    },
    "changes cell inside matrix":function () {
        assert(LIFE.calc.getMatrix()[0][0] === 1);
        assert(LIFE.calc.getMatrix()[0][1] === 0);
    }
});



buster.testCase("A function clearMatrix:", {
    setUp:function () {
        this.matrix = [
            [1, 1],
            [1, 1]
        ];
    },
    "makes every cell == to zero":function () {
        assert(Array.prototype.slice.call(LIFE.calc.setMatrix(this.matrix).clearMatrix().getMatrix()).every(function (row) {
            return Array.prototype.slice.call(row).every(function (cell) {
                if (cell === 0) {
                    return true;
                }
            });
        }));
    }
});



buster.testCase("A function calc.addPattern:", {
    setUp:function () {
        this.pattern = [
            [1, 0],
            [0, 1]
        ];
        LIFE.calc.setMatrix([
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1]
        ]);
    },
    "Throws exception if non array given as a parameter":function () {
        assert.exception(function () {
            LIFE.calc.addPattern('d');
        });
        assert.exception(function () {
            LIFE.calc.addPattern('d');
        });
    },
    "adds as many live cells to matrix as necessary":function () {
        LIFE.calc.addPattern(this.pattern);
        assert.equals(LIFE.calc.getMatrix().reduce(function (a, b) {
            return a + b.reduce(function (a,b) {return a+b;});
        },0),2);
    }
});

