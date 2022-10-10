import React, {Component} from 'react';

import './Node.css';

export default class Node extends Component {
  render() {
    const {
      col,
      isFinish,
      isStart,
      isWall,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      onDragStart,
      onDragLeave,
      onDragEnd,
      eventDrag,
      isErase,
      row,
    } = this.props;
    const extraClassName = isFinish
      ? 'node-finish'
      : isStart
      ? 'node-start'
      : isWall
      ? 'node-wall'
      : '';
    const onDraggingClass = eventDrag ? 'node-darker' : '';
    const onEraseClass = isErase ? "coursor-change" : '';
    const draggable = isStart || isFinish ? true : false;
    const draggClass = draggable ? 'node-draggable' : '';
    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName} ${draggClass} ${onDraggingClass} ${onEraseClass}`}
        onMouseDown={() => draggable ? false : onMouseDown(row, col)}
        onMouseEnter={() => draggable ? false : onMouseEnter(row, col)}
        onMouseUp={() => draggable ? false : onMouseUp()}
        onDragStart={() => onDragStart(row, col)}
        onDragLeave={() => onDragLeave(row,col)}
        onDragEnd={() => onDragEnd(row, col)}
        draggable={draggable}
        ></div>
    );
  }
}
