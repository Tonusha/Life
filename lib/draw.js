/**
 * Created by: Yan@yan.my * Date: 9/24/12 3:57 PM
 */

var LIFE = function (parent) {
    var my = parent.draw = parent.draw || {};
    var table = "";

    my.getTable = function () {
        return table;
    };
    //Draw table/container to show the matrix
    my.drawTable = function (width, height) {
        table = document.createElement("table");
        table.setAttribute("class", "life");
        var i;
        for (i = 0; i < height; i += 1) {
            var row = table.insertRow(-1);
            for (var j = 0; j < width; j += 1) {
                var cell = row.insertCell(-1);
                cell.setAttribute("id", i.toString() + '.' + j.toString());
                cell.setAttribute("onClick", "LIFE.manualDraw(this.id);");
            }
        }
        return this;
    };


//update classes of cells to display new state of matrix
    my.updateGrid = function (matrix) {
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
        return this;
    };


    return parent;
}(LIFE || {});