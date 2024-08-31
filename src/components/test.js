import React from 'react';
import TextDisplay from './components/TextDisplay';

const App = () => {

  const textData = [
    {
      "type": "Line",
      "class_type": "Text",
      "x": 1500,
      "y": 684,
      "width": 189,
      "height": 47,
      "words": [
        {
          "x": 1500,
          "y": 684,
          "width": 189,
          "height": 47,
          "text": "大阪支社",
          "confidence": 0.9999876419703165
        }
      ]
    },
    {
      "type": "Line",
      "class_type": "Text",
      "x": 219,
      "y": 688,
      "width": 619,
      "height": 49,
      "words": [
        {
          "x": 219,
          "y": 688,
          "width": 619,
          "height": 49,
          "text": "(株) ソニー・インタラクティブ",
          "confidence": 0.9867315795272589
        }
      ]
    },
    {
      "type": "Line",
      "class_type": "Text",
      "x": 1500,
      "y": 733,
      "width": 488,
      "height": 53,
      "words": [
        {
          "x": 1500,
          "y": 733,
          "width": 488,
          "height": 53,
          "text": "大阪府大阪市北区天満橋",
          "confidence": 0.9999983777170596
        }
      ]
    },
    {
      "type": "Line",
      "class_type": "Text",
      "x": 1241,
      "y": 743,
      "width": 187,
      "height": 43,
      "words": [
        {
          "x": 1241,
          "y": 743,
          "width": 187,
          "height": 43,
          "text": "530-6022",
          "confidence": 0.9999489188194275
        }
      ]
    },
    {
      "type": "Table",
      "rows": [
        {
          "cells": [
            {
              "x": 100,
              "y": 800,
              "width": 200,
              "height": 50,
              "text": "Header 1",
              "confidence": 0.999
            },
            {
              "x": 300,
              "y": 800,
              "width": 200,
              "height": 50,
              "text": "Header 2",
              "confidence": 0.999
            }
          ]
        },
        {
          "cells": [
            {
              "x": 100,
              "y": 850,
              "width": 200,
              "height": 50,
              "text": "Data 1-1",
              "confidence": 0.999
            },
            {
              "x": 300,
              "y": 850,
              "width": 200,
              "height": 50,
              "text": "Data 1-2",
              "confidence": 0.999
            }
          ]
        },
        {
          "cells": [
            {
              "x": 100,
              "y": 900,
              "width": 200,
              "height": 50,
              "text": "Data 2-1",
              "confidence": 0.999
            },
            {
              "x": 300,
              "y": 900,
              "width": 200,
              "height": 50,
              "text": "Data 2-2",
              "confidence": 0.999
            }
          ]
        }
      ]
    }
  ];
  
  // A4 dimensions in PDF units (595 x 842 points)
  const pdfWidth = 795;
  const pdfHeight = 990;

  // Adjust the position and size of text data to fit within the PDF boundaries
  const adjustedTextData = textData.map(item => {
    if (item.type === 'Line') {
      const newX = Math.min(item.x, pdfWidth - item.width);
      const newY = Math.min(item.y, pdfHeight - item.height);
      const newWidth = Math.min(item.width, pdfWidth);
      const newHeight = Math.min(item.height, pdfHeight);
      return { ...item, x: newX, y: newY, width: newWidth, height: newHeight };
    } else if (item.type === 'Table') {
      const newRows = item.rows.map(row => ({
        ...row,
        cells: row.cells.map(cell => ({
          ...cell,
          x: Math.min(cell.x, pdfWidth - cell.width),
          y: Math.min(cell.y, pdfHeight - cell.height),
          width: Math.min(cell.width, pdfWidth),
          height: Math.min(cell.height, pdfHeight)
        }))
      }));
      return { ...item, rows: newRows };
    }
    return item;
  });

  return (
    <div className="app-container" style={{ width: `${pdfWidth}px`, height: `${pdfHeight}px`, border: "1px solid black" }}>
      <TextDisplay textData={adjustedTextData} />
    </div>
  );
};

export default App;
