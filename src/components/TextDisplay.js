import React, { useState, useEffect } from 'react';
import PreviewOutput from './PreviewOutput';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  textDisplayContainer: {
    position: 'relative',
  },
  rectangleModal: {
    position: 'absolute',
  },
  button: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(1.5, 3),
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#4CAF50',
    color: 'white',
    '&:hover': {
      backgroundColor: '#45a049',
    },
    '&:active': {
      backgroundColor: '#3e8e41',
    },
  },
}));


const RectangleModal = ({ handleSave, handleCancel, position }) => (
  <div className="rectangle-modal" style={{ position: 'absolute', ...position }}>
    <button className={useStyles().button} onClick={handleSave}>Save</button>
    <button className={useStyles().button} onClick={handleCancel}>Cancel</button>
  </div>
);

const TextDisplay = ({ textData }) => {
  const [rectangles, setRectangles] = useState([]);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [showCancelButton, setShowCancelButton] = useState(false);
  const [mouseMoved, setMouseMoved] = useState(false);
  const [modalPosition, setModalPosition] = useState({});
  const [extractedData, setExtractedData] = useState([]);

  const handleMouseDown = (event) => {
    const svg = event.target.closest('svg');
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const cursorPoint = point.matrixTransform(svg.getScreenCTM().inverse());
    setRectangles(prevRectangles => [
      ...prevRectangles,
      {
        startX: cursorPoint.x,
        startY: cursorPoint.y,
        width: 0,
        height: 0,
      }
    ]);
    setShowSaveButton(false);
    setShowCancelButton(false);
    setMouseMoved(false);
  };

  const handleMouseMove = (event) => {
    if (event.buttons === 1 && rectangles.length > 0) {
      const svg = event.target.closest('svg');
      if (svg) {
        const point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        const cursorPoint = point.matrixTransform(svg.getScreenCTM().inverse());
        setRectangles(prevRectangles => {
          const lastRectangle = prevRectangles[prevRectangles.length - 1];
          return [
            ...prevRectangles.slice(0, -1),
            {
              ...lastRectangle,
              width: cursorPoint.x - lastRectangle.startX,
              height: cursorPoint.y - lastRectangle.startY,
            }
          ];
        });
        setMouseMoved(true);
      }
    }
  };

  const handleMouseUp = () => {
    setShowSaveButton(true);
    setShowCancelButton(true);
    const modalX = rectangles[rectangles.length - 1].startX + rectangles[rectangles.length - 1].width + 5;
    const modalY = rectangles[rectangles.length - 1].startY - 25;
    setModalPosition({ left: modalX, top: modalY });
  };

  const handleSave = () => {
    const newExtractedData = rectangles.map(rectangle => {
      const linesInRectangle = textData
        .filter(item => item.type === 'Line')
        .filter(line => {
          const lineX = line.x;
          const lineY = line.y;
          const lineWidth = line.width;
          const lineHeight = line.height;
          const rectX = rectangle.startX;
          const rectY = rectangle.startY;
          const rectWidth = rectangle.width;
          const rectHeight = rectangle.height;

          return (
            (lineX >= rectX && lineY >= rectY && lineX <= rectX + rectWidth && lineY <= rectY + rectHeight) ||
            (lineX + lineWidth >= rectX && lineY + lineHeight >= rectY && lineX + lineWidth <= rectX + rectWidth && lineY + lineHeight <= rectY + rectHeight)
          );
        })
        .map(line => ({
          text: line.words.map(word => word.text).join(' ')
        }));

      const tablesInRectangle = textData
        .filter(item => item.type === 'Table')
        .map(table => ({
          rows: table.rows.map(row => ({
            cells: row.cells
              .filter(cell => {
                const cellX = cell.x;
                const cellY = cell.y;
                const cellWidth = cell.width;
                const cellHeight = cell.height;

                return (
                  cellX >= rectangle.startX &&
                  cellY >= rectangle.startY &&
                  cellX + cellWidth <= rectangle.startX + rectangle.width &&
                  cellY + cellHeight <= rectangle.startY + rectangle.height
                );
              })
              .map(cell => ({
                text: cell.text
              }))
          }))
        }));

      return {
        lineData: linesInRectangle,
        tableData: tablesInRectangle,
      };
    });
    setShowSaveButton(false);
    setShowCancelButton(false);
    setModalPosition({})

    setExtractedData(newExtractedData);
    
  };

  const handleCancel = () => {
    setRectangles(prevRectangles => prevRectangles.slice(0, -1));
    setShowSaveButton(false);
    setShowCancelButton(false);
    setModalPosition({});
    // resetState();
  };

  // const resetState = () => {
  //   setRectangles([]);
  //   setShowSaveButton(false);
  //   setShowCancelButton(false);
  //   setMouseMoved(false);
  // };

  const handleDownloadCsv = () => {
    const csvRows = extractedData.map((rectangleData, index) => {
      const lineTextData = rectangleData.lineData.map(line => `"${line.text}"`).join(',');
      const tableCellTextData = rectangleData.tableData.map(table =>
        table.rows.map(row =>
          row.cells.map(cell => `"${cell.text}"`).join(',')
        )
      ).join(',');
  
      return `"Rectangle ${index + 1}",${lineTextData}${tableCellTextData}`;



    });
  
    const csvData = csvRows.join('\n');
    const csvBlob = new Blob([csvData], { type: 'text/csv' });
    const csvUrl = window.URL.createObjectURL(csvBlob);
    const link = document.createElement('a');
    link.href = csvUrl;
    link.setAttribute('download', 'extracted_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseUp]);

  const renderText = textData.map((item, index) => {
    if (item.type === 'Line') {
      return (
        <div
          key={index}
          className="text-line"
          style={{
            position: 'absolute',
            left: `${item.x}px`,
            top: `${item.y}px`,
            width: `${item.width}px`,
            height: `${item.height}px`,
          }}
        >
          {item.words.map((word, wordIndex) => (
            <span
              key={wordIndex}
              className="text-word"
              style={{
                display: 'inline-block',
                whiteSpace: 'nowrap',
              }}
            >
              {word.text}
            </span>
          ))}
        </div>
      );
    } else if (item.type === 'Table') {
      return item.rows.map((row, rowIndex) => (
        <div key={rowIndex} className="table-row">
          {row.cells.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className="table-cell"
              style={{
                position: 'absolute',
                left: `${cell.x}px`,
                top: `${cell.y}px`,
                width: `${cell.width}px`,
                height: `${cell.height}px`,
                border: '1px solid blue',
                borderBlockColor: 'Blue',
                overflow: 'hidden',
              }}
            >
              {cell.text}
            </div>
          ))}
        </div>
      ));
    }
    return null;
  });
  const classes = useStyles();

  return (
    <>
      <svg
        className={classes.svgContainer}
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
        onMouseDown={handleMouseDown}
      >
        <foreignObject x="0" y="0" width="100%" height="100%">
          <div className={classes.textDisplayContainer} style={{ position: 'relative' }}>
            {renderText}
          </div>
        </foreignObject>
        {rectangles.map((rect, index) => (
          <rect
            key={index}
            x={rect.startX}
            y={rect.startY}
            width={rect.width}
            height={rect.height}
            fill="none"
            stroke="red"
            strokeWidth="2"
          />
        ))}
      </svg>
      {showSaveButton && mouseMoved && showCancelButton && (
        <RectangleModal handleSave={handleSave} handleCancel={handleCancel} position={modalPosition} />
      )}
      <PreviewOutput extractedData={extractedData} />
      <button className={classes.button} onClick={handleDownloadCsv} style={{position:'relative'}}>Download CSV</button>
    </>
  );
};

export default TextDisplay;
