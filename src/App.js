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
        
      ]
    }
  ];
  
  return (
    <div className="app-container" >
      <TextDisplay textData={textData}  />
    </div>
  
  );
};

export default App;
