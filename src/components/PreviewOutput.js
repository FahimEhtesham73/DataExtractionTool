import React from 'react';

const PreviewOutput = ({ extractedData }) => {
  if (!extractedData || !Array.isArray(extractedData) || extractedData.length === 0) {
    return null; 
  }

  return (
    <div className="preview-output">
      {extractedData.map((data, index) => (
        <div key={index}>
          <h2>PreviewOutput</h2>
          <h3>Selected Region {index + 1}</h3>
          <div>
            <h4>Lines:</h4>
            <ol>
              {data.lineData.map((line, lineIndex) => (
                <li key={lineIndex}>{line.text}</li>
              ))}
            </ol>
          </div>
          <div>
            <h4>Tables:</h4>
            {data.tableData.map((table, tableIndex) => (
              <div key={tableIndex}>
                <h5>Table {tableIndex + 1}:</h5>
                <ul>
                  {table.rows.map((row, rowIndex) => (
                    <li key={rowIndex}>
                      {row.cells.map((cell, cellIndex) => (
                        <span key={cellIndex}>{cell.text} </span>
                      ))}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PreviewOutput;
