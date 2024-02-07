import React, { useState, useEffect } from "react";
import ApiClient from "/src/Services/ApiClient.js";
import Board from "/src/Domain/Board.js";
import Mine from "/src/Domain/Mine.js";
import Tarjeta1 from "./Tarjeta1.jsx";
import Tarjeta2 from "./Tarjeta2.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "/src/css/index.css";
import BotonNivel from "./Boton.jsx";
import explicacion1 from "../assets/explicacion5.gif";
import explicacion2 from "../assets/explicacion6.gif";
import explicacion3 from "../assets/explicacion7.gif";
import explicacion4 from "../assets/explicacion4.png";
import minaExplota from "../assets/minaExplota.mp3";

const GameBoard = () => {
  const [board, setBoard] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [level, setLevel] = useState(0);
  const [markedCells, setMarkedCells] = useState({});

  useEffect(() => {
    resetGame();
  }, [level]);

  const resetGame = () => {
    const apiClient = new ApiClient("http://localhost:9988/");
    apiClient.getLevel(level).then((data) => {
      const mines = data.mines.map((mine) => new Mine(mine.row, mine.column));
      const board = new Board(data.rows, data.columns, mines, level);
      setBoard(board);
      setGameOver(false);
      setGameWon(false);
      setMarkedCells({});
    });
  };

  const handleClick = (row, column) => {
    if (gameOver || gameWon || !board) return;
    try {
      board.defuse(row, column);
      setBoard({ ...board });
      if (
        board.getRemainigMinesCount() ===
        Object.values(markedCells).filter((val) => val).length
      ) {
        setGameWon(true);
      }
    } catch (error) {
      board.exploded(row, column);
      setGameOver(true);
    }
  };

  // useEffect(() => {
  //   if (board && markedCells) {
  //     if (
  //       board.getRemainigMinesCount() ===
  //       Object.values(markedCells).filter((val) => val).length
  //     ) {
  //       setGameWon(true);
  //     }
  //   }
  // }, [board, markedCells]);



  // const handleClick = (row, column) => {
  //   if (gameOver || gameWon || !board || markedCells[`${column},${row}`]) return;
  //   try {
  //     board.defuse(row, column);
  //     setBoard({ ...board });
  //   } catch (error) {
  //     board.exploded(row, column);
  //     setGameOver(true);
  //   }
  // };

  const handleRightClick = (event, row, column) => {
    event.preventDefault();
    setMarkedCells((prev) => ({
      ...prev,
      [`${row},${column}`]: !prev[`${row},${column}`],
    }));
  };

  return (
    <div>
      <div className="game-board container">
        <div className="btn-group mt-5 botonDificultad" role="group">
          <BotonNivel
            level={0}
            className="btn-success"
            texto="Facil"
            setLevel={setLevel}
          />
          <BotonNivel
            level={1}
            className="btn-warning"
            texto="Normal"
            setLevel={setLevel}
          />
          <BotonNivel
            level={2}
            className="btn-danger"
            texto="Dificil"
            setLevel={setLevel}
          />
        </div>

        {gameWon && <div className="alert alert-success mt-3">¡Has ganado!</div>}

        {board && (
          <div className="mine-counter m-2">
            Minas en el tablero: {board.getRemainigMinesCount()}
          </div>
        )}

        <div className={`board-container board-level-${level}`}>
          {board &&
            board.columns.map((row, rowIndex) => (
              <div key={rowIndex} className="row">
                {row.map((cell, columnIndex) => (
                  <div
                    key={columnIndex}
                    className={`cell col ${cell.defused ? "defused" : ""} ${
                      cell.hasMine ? "mine" : ""
                    } ${cell.exploded ? "exploded" : ""} ${
                      markedCells[`${rowIndex},${columnIndex}`] ? "marked" : ""
                    } ${gameOver && cell.hasMine ? "show-mine" : ""}`}
                    onClick={() => handleClick(columnIndex, rowIndex)}
                    onContextMenu={(event) =>
                      handleRightClick(event, rowIndex, columnIndex)
                    }
                  >
                    {cell.defused && cell.getSurroundingMinesCount()}
                  </div>
                ))}
              </div>
            ))}
        </div>

        {/* {board && board.mines.map((mine, index) => (
        <div key={index} className='mine'>
          <p>Mina en posición: {mine.row}, {mine.column}</p>
        </div>
      ))} */}

        {(gameOver || gameWon) && (
          <button className="btn btn-info mt-3" onClick={resetGame}>
            Reiniciar
          </button>
        )}

        {gameOver && (
          <div className="alert alert-danger m-2">
            ¡Has perdido!
            <audio src={minaExplota} autoPlay />
          </div>
        )}
      </div>

      <div
        className="d-flex justify-content-center align-items-center expJuego"
        id="comoJugar"
      >
        <div className="spinner-grow text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="spinner-grow text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="spinner-grow text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h3>¿Como Jugar?</h3>
        <div className="spinner-grow text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="spinner-grow text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="spinner-grow text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>

      {/* <div className="textoIntroductorio d-flex justify-content-center align-items-center mb-3">
        <div className="card col-9">
          <div className="card-body">
            <p>
              El juego del Buscaminas se presenta en forma de tablero lleno de
              fichas en blanco. El objetivo es descubrir cuáles de ellas
              contienen minas para despejar todas las demás de forma segura.
              Para ello, contaremos con la ayuda de números que indican qué
              posiciones son más sospechosas de esconder una bomba. El primer
              paso para empezar a jugar al Buscaminas es pulsar un cuadrado
              cualquiera del tablero. Una vez hecho esto, algunas fichas
              aparecerán vacías y otras con números. Cada número indica la
              cantidad de minas que hay en los cuadrados adyacentes (teniendo en
              cuenta que cada ficha tiene cuatro lados y cuatro esquinas, cada
              una de ellas tiene ocho cuadrados adyacentes).
            </p>
          </div>
        </div>
      </div> */}

      {/* <div className="d-flex justify-content-center align-items-center">
      <div id="carouselExampleIndicators" className="carousel carousel-dark col-8">
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
      </div>
      <div className="carousel-inner">
      <div className="carousel-item active">
          <svg className="bd-placeholder-img bd-placeholder-img-lg d-block w-100" width="800" height="400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: First slide" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#ffffff"></rect></svg>
          <div className="carousel-caption d-none d-md-block">
          <div className="d-flex justify-content-center align-items-center">
        <Tarjeta1
          texto="El primer paso para empezar a jugar al Buscaminas es pulsar un cuadrado cualquiera del tablero. Una vez hecho esto, algunas fichas aparecerán vacías y otras con números. Cada número indica la cantidad de minas que hay en los cuadrados adyacentes (teniendo en cuenta que cada ficha tiene cuatro lados y cuatro esquinas, cada una de ellas tiene ocho cuadrados adyacentes)."
          imagen={explicacion1}
          alternativo="imagenExplicacion1"
        />
      </div>
          </div>
        </div>
        <div className="carousel-item">
          <svg className="bd-placeholder-img bd-placeholder-img-lg d-block w-100" width="800" height="400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Second slide" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#ffffff"></rect><text x="50%" y="50%" fill="#444" dy=".3em">Second slide</text></svg>
        </div>
        <div className="carousel-item">
          <svg className="bd-placeholder-img bd-placeholder-img-lg d-block w-100" width="800" height="400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Third slide" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#ffffff"></rect><text x="50%" y="50%" fill="#333" dy=".3em">Third slide</text></svg>
        </div>
        <div className="carousel-item">
          <svg className="bd-placeholder-img bd-placeholder-img-lg d-block w-100" width="800" height="400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Fourth slide" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#ffffff"></rect><text x="50%" y="50%" fill="#333" dy=".3em">Fourth slide</text></svg>
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
      </div> */}

      <div className="d-flex justify-content-center align-items-center">
        <Tarjeta1
          texto="El primer paso para empezar a jugar al Buscaminas es pulsar un cuadrado cualquiera del tablero. Una vez hecho esto, algunas fichas aparecerán vacías y otras con números. Cada número indica la cantidad de minas que hay en los cuadrados adyacentes (teniendo en cuenta que cada ficha tiene cuatro lados y cuatro esquinas, cada una de ellas tiene ocho cuadrados adyacentes)."
          imagen={explicacion1}
          alternativo="imagenExplicacion1"
        />
      </div>

      <div className="d-flex justify-content-center align-items-center">
        <Tarjeta2
          texto="Así, si el número es un uno, significa que una pieza adyacente esconde una bomba. Si es un dos, informa de que dos piezas adyacentes son peligrosas. Y así sucesivamente. De este modo, es posible ir despejando aquellas casillas en las que sabemos que no hay minas."
          imagen={explicacion2}
          alternativo="imagenExplicacion2"
        />
      </div>

      <div className="d-flex justify-content-center align-items-center">
        <Tarjeta1
          texto="Si sospechamos que una casilla tiene una mina, podemos señalarla con una bandera (recurso clave para jugar al Buscaminas). Para hacer esto, basta con hacer clic con el botón derecho del ratón. La ficha se bloqueará para evitar que la marques por error."
          imagen={explicacion3}
          alternativo="imagenExplicacion3"
        />
      </div>

      <div className="d-flex justify-content-center align-items-center">
        <Tarjeta2
          texto="Si marcas por error una ficha que esconde una mina, esta explota y el juego termina. En este caso, tienes la opción de comenzar un juego nuevo o volver a empezar el mismo. Si por el contrario logras ubicar todas las bombas y despejar todas las casillas inofensivas, serás el ganador de la partida."
          imagen="./src/assets/explicacion4.png"
          alternativo={explicacion4}
        />
      </div>
    </div>
  );
};

export default GameBoard;
