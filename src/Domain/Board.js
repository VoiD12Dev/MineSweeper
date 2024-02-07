import BoardCell from "./BoardCell";
import Mine from "./Mine";

export default class Board{
    /**
     * Builds a board based on the number of rows and columns passed as an argument and stores the mines.
     * Basically, it builds a matrix of columns and rows containing cells.
     * @param {number} rows - The number of rows of the board
     * @param {number} columns - The number of columns of the board
     * @param {Mine} mines - The mines of the board
     */

    /*Este es el constructor de la clase. Inicializa la clase con el número de filas y columnas, las minas y el nivel. También construye el tablero y establece el conteo de banderas a 0.*/
    constructor(rows, columns, mines, level){
        this.mines = mines;
        this.level = level;
        this.columns = this.buildBoard(rows, columns);
        this.flaggedCount = 0;
    }

    /**
     * This method initializes the matrix of columns and rows of the board with cells
     * @param {number} The number of rows 
     * @param {number} The number columns 
     * @returns 
     */
    
    /*Esta función crea el tablero llamando a la función _buildColumns.*/
    buildBoard(rows, columns){
        return this._buildColumns(rows, columns);
    }

    //Esta función crea las columnas del tablero. Para cada columna, crea una fila y la agrega a la matriz del tablero.
    _buildColumns(rows, columns){
        const matrix = [];

        for(let i = 0; i < columns; i++){
            let row = this._buildRows(rows, i);

            matrix.push(row);
        }

        return matrix;
    }

    //Esta función crea las filas para una columna dada. Para cada fila, crea una nueva celda y la agrega a la columna.
    _buildRows = (rows, columnIndex) => {
        let column = [];

        for(let i = 0; i < rows; i++){
            column.push(new BoardCell(i, columnIndex, this.cellHasMine(i, columnIndex)));
        }

        return column;
    }

    /**
     * Returns true/false whether there's a mine in that row+column
     * @param {number} row 
     * @param {number} column 
     * @returns True/false whether there's a mine in that row+column
     */

    //Esta función verifica si una celda en una fila y columna dada tiene una mina.
    cellHasMine(row, column){
        return this.mines?.some(mine => mine.row === row && mine.column === column);
    }

    /**
     * Whether the cell present at [row[column]] can be defused or not (has a mine or not)
     * @param {number} row 
     * @param {number} column 
     * @returns True/false whether the cell present at [row[column]] can be defused or not (has a mine or not)
     */

    //Esta función verifica si una celda en una fila y columna dada puede ser desactivada, es decir, si no tiene una mina.
    canBeDefused = (row, column) => {
        return !this.cellHasMine(row, column);
    }

    /**
     * Gets a cell by row and column
     * @param {number} row 
     * @param {number} column 
     * @returns The cell present at row/column
     */

    // Esta función devuelve la celda en una fila y columna dada.
    getCellBy(row, column){
        let predicate = (y => y.row === row && y.column === column);
        let foundColumn  = this.columns.find(x => x.some(predicate));
        let cell = foundColumn?.find(predicate);

        return cell;
    }

    /**
     * 
     * @param {number} row 
     * @param {number} column 
     * @returns The surrounding cells on a coordinate.
     * 1 2 3
     * 4 5 6
     * 7 8 9
     * The surrounding cells for the 5 cell will be 1,2,3,4,6,7,8,9.
     */

    // Esta función devuelve las coordenadas de las celdas circundantes a una celda en una fila y columna dada.
    getSurroundingCellsRowsColumns(row, column){
        return [
            //left
            {row: row, column: column - 1},
            //right
            {row: row, column: column + 1},
            //topleft
            {row: row - 1, column: column - 1},
            //topright
            {row: row - 1, column: column + 1},
            //top
            {row: row - 1, column: column},
            //bottom
            {row: row + 1, column: column},
            //bottom left
            {row: row + 1, column: column - 1},
            //bottom right
            {row: row + 1, column: column + 1},
        ]
    }

     //Esta función devuelve las celdas circundantes a una celda en una fila y columna dada que no han sido desactivadas.
    _getSurroundingCellsUndefused(row, column){
        const surroundingCoordinates = this.getSurroundingCellsRowsColumns(row, column);

        return surroundingCoordinates.reduce((result, coordinate) => {
            let cell = this.getCellBy(coordinate.row, coordinate.column)

            if(cell && !cell.defused){
                result.push(cell);
            }

            return result;
        }, []);
    }

    /**
     * 
     * @param {number} row 
     * @param {number} column 
     * @returns Returns the number of surrounding mines for a coordinate
     */

    //Esta función cuenta el número de minas en las celdas circundantes a una celda en una fila y columna dada.
    countSurroundingMines(row, column){
        let surroundingCellsCoordinates = this.getSurroundingCellsRowsColumns(row, column);

        const minesList = surroundingCellsCoordinates
            .map(x => this.cellHasMine(x.row, x.column) ? 1 : 0);
        
        const mineCount = minesList
            .reduce((partialSum, a) => partialSum + a, 0)

        return mineCount;
    }

    //Esta función aplana la matriz de celdas en una sola lista de celdas.
    _flattenCells = () => {
        return [].concat(...this.columns);
    }

    //Esta función calcula el número de minas restantes en el tablero.
    _calculateRemainingMinesCount = () => {

        const cells = this._flattenCells();

        this.flaggedCount = cells.filter(x => x.flagged).length;
    }

    //Esta función calcula el número de minas restantes restando el número de celdas marcadas con una bandera (this.flaggedCount) del número total de minas (this.mines.length).
    getRemainigMinesCount = () => {
        return this.mines.length - this.flaggedCount;
    }

    /**
     * 
     * @param {number} row 
     * @param {number} column 
     * @returns Marks a cell as flagged and recalculates the number of remaining mines
     */

    //Esta función marca una celda en una fila y columna dada como marcada y recalcula el número de minas restantes.
    flag = (row, column) => {
        let cell = this.getCellBy(row, column);

        cell.flag();

        this._calculateRemainingMinesCount();

        return this;
    }

    /**
     * Defuses a cell. 
     * If there's a mine in it it throws an error.
     * If there are no mines surrounding the cell, will defuse all the surrounding mines recursively.
     * @param {number} row 
     * @param {number} column 
     * @returns The board after the cell is defused
     */

    //Esta función desactiva una celda en una fila y columna dada. Si la celda tiene una mina, lanza un error. Si no hay minas en las celdas circundantes, desactiva todas las minas circundantes de forma recursiva.
    defuse = (row, column) => {
        let cell = this.getCellBy(row, column);

        if(cell.hasMine){
            throw new Error(`cell at ${row}, ${column} can't be defused, it has a mine`);
        }

        cell.defuse(this.countSurroundingMines(row, column));

        this._calculateRemainingMinesCount();

        this._defuseSurroundingMines(cell);

        return this;
    }

    //Esta función desactiva las minas en las celdas circundantes a una celda dada si la celda no tiene minas circundantes.
    _defuseSurroundingMines = (cell) => {
        if(cell.getSurroundingMinesCount() === 0){
            let toDefuse = this._getSurroundingCellsUndefused(cell.row, cell.column);

            toDefuse.forEach(x => this.defuse(x.row, x.column));
        }
    }

    /**
     * If a cell with a mine is clicked, this method has to be called because the game is lost.
     * @param {number} row 
     * @param {number} column 
     * @returns The board with the exploded cell and the board marked as lost.
     */

    //Esta función se llama cuando se hace clic en una celda con una mina. Marca la celda como explotada y el tablero como perdido.
    exploded = (row, column) => {
        let cell = this.getCellBy(row, column);

        cell.explode();

        this.lost = true;

        return this;
    }
}