import React, {Component} from 'react';
import Node from '../Node';
import {dijkstra, getNodesInShortestPathOrder} from '../../algorithms/dijkstra';

import './PathfindingVisualizer.css';

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      newRow: [],
      newCol: [],
      saveGrid: [],
      saveNumber: [],
      isSaved: false,
      mouseIsPressed: false,
      eventDrag: false,
      draggingStart: false,
      draggingFinish: false,
      START_NODE_ROW: 10,
      START_NODE_COL: 5,
      FINISH_NODE_ROW: 10,
      FINISH_NODE_COL: 25,
    };
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({grid});
  }

  handleOnDragStart(row, col) {
    this.setState({ eventDrag: true })

    if (this.state.START_NODE_ROW === row && this.state.START_NODE_COL === col ) {
      const newGrid = getNewGridWithStart(this.state.grid, this.state.START_NODE_ROW, this.state.START_NODE_COL);
      this.setState({draggingStart: true, grid: newGrid});
    }
    else if (this.state.FINISH_NODE_ROW === row && this.state.FINISH_NODE_COL === col ) {
      const newGrid = getNewGridWithFinish(this.state.grid, this.state.FINISH_NODE_ROW, this.state.FINISH_NODE_COL);
      this.setState({draggingFinish: true, grid: newGrid});
    }
  }

  handleOnDropLeave(row, col) {
    if (this.state.draggingStart) {
      this.setState({
        START_NODE_ROW: row,
        START_NODE_COL: col
      })
    }
    else if (this.state.draggingFinish) {
      this.setState({
        FINISH_NODE_ROW: row,
        FINISH_NODE_COL: col
      })
    }
  }

  handleOnDragEnd(row, col) {
    if (this.state.draggingStart) {
      const newGrid = getNewGridWithStart(this.state.grid, this.state.START_NODE_ROW, this.state.START_NODE_COL);
      this.setState({grid: newGrid, draggingStart: false, eventDrag: false });
    }
    else if (this.state.draggingFinish) {
      const newGrid = getNewGridWithFinish(this.state.grid, this.state.FINISH_NODE_ROW, this.state.FINISH_NODE_COL);
      this.setState({grid: newGrid, draggingFinish: false, eventDrag: false });
    }
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp(row, col) {
    this.setState({mouseIsPressed: false});
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }



  handleRestor() {
    if (this.state.isSaved) {
      const gridRestore = []
      for(let row = 0; row < 20; row++ ) {
        const currentRow = []
        for (let col = 0; col < 30; col++) {
          currentRow.push(
            this.createNode(
              this.state.saveGrid[row][col].col,
              this.state.saveGrid[row][col].row,
              this.state.saveGrid[row][col].isWall
              ))
        }
        gridRestore.push(currentRow)
      }
      this.setState({ grid: gridRestore })
    }
    return;
  }

  handleSaveGrid() {
    this.state.saveNumber.push(this.state.saveNumber.length + 1)
    const actualGrid = this.state.grid
    this.setState({ saveGrid: actualGrid, isSaved: true });
    // this.handleRestor();
    setTimeout(() => {
        this.handleRestor();
      }, 10);
}

  handleRestart() {
    const grid = this.getInitialGrid();
    this.setState({grid});
  }

  visualizeDijkstra() {
    const {grid} = this.state;
    const startNode = grid[this.state.START_NODE_ROW][this.state.START_NODE_COL];
    const finishNode = grid[this.state.FINISH_NODE_ROW][this.state.FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  getInitialGrid() {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 30
        ; col++) {
        currentRow.push(this.createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };
  
  createNode(col, row, isWall, isStart, isFinish) {
    return {
      col,
      row,
      isStart: row === this.state.START_NODE_ROW && col === this.state.START_NODE_COL,
      isFinish: row === this.state.FINISH_NODE_ROW && col === this.state.FINISH_NODE_COL,
      distance: Infinity,
      isVisited: false,
      isWall: isWall ? true : false,
      previousNode: null,
    };
  };

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        <button onClick={() => this.visualizeDijkstra()}>
          Visualize Dijkstra's Algorithm
        </button>
        {this.state.isSaved && <button onClick={() => this.handleRestor()}>Ctrl + Z</button>}
        <button onClick={() => this.handleSaveGrid()}>Save: {this.state.saveNumber.length}</button>
        <button onClick={() => this.handleRestart()}>Restart</button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onDragStart={(row, col) => this.handleOnDragStart(row, col)}
                      onDragLeave={(row, col) => this.handleOnDropLeave(row, col)}
                      onDragEnd={(row, col) => this.handleOnDragEnd(row ,col)}
                      eventDrag={this.state.eventDrag}
                      // onDrop={(row ,col) => this.handleOnDrop(row, col)}
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getNewGridWithStart = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isStart: !node.isStart,
    isWall: node.isWall ? false : false,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithFinish = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isFinish: !node.isFinish,
    isWall: node.isWall ? false : false,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};


const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
