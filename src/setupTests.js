// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import logo from './logo.svg';
import './App.css';
import{useState} from 'react'
import {
  Scatter,
  ScatterChart,
  Line,
  LineChart,
  CartesianGrid,
  YAxis,
  XAxis,
  Tooltip,
  Legend,
} from "recharts";


//to-do list
//matrix transposition function
function transposeMatrix(matrix) {
  return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}


//matrix inversion function
function inverseMatrix(matrix) {
  const n = matrix.length;
  let identity = matrix.map((row, i) => 
      row.map((_, j) => (i === j ? 1 : 0))
  );
  let augmented = matrix.map((row, i) => row.concat(identity[i]));

  // Forward elimination
  for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
          if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
              maxRow = k;
          }
      }
      [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]]; // Swap rows

      let pivot = augmented[i][i];
      if (pivot === 0) {
          throw new Error("Matrix is singular and cannot be inverted.");
      }

      for (let j = 0; j < 2 * n; j++) {
          augmented[i][j] /= pivot;
      }

      for (let k = 0; k < n; k++) {
          if (k !== i) {
              let factor = augmented[k][i];
              for (let j = 0; j < 2 * n; j++) {
                  augmented[k][j] -= factor * augmented[i][j];
              }
          }
      }
  }

  return augmented.map(row => row.slice(n)); // Extract inverse matrix
}

// Example usage:
const matrix = [
  [2, 1],
  [5, 3]
];

console.log(inverseMatrix(matrix));



//matrix multiplication function
function multiplyMatrices(A, B) {
  if (A[0].length !== B.length) {
      throw new Error("Number of columns in A must match number of rows in B");
  }

  return A.map(row => 
      B[0].map((_, colIndex) => 
          row.reduce((sum, value, rowIndex) => sum + value * B[rowIndex][colIndex], 0)
      )
  );
}

//OLS function
function OLS(X, y){
 let transpose = transposeMatrix(X)
 let first_mult = multiplyMatrices(transpose, X)
 let inverse = inverseMatrix(first_mult)
 let second_mult = multiplyMatrices(inverse, transpose)
 let betasrows = multiplyMatrices(second_mult, y)
 let betascolumn = betasrows.map(b => [b])

return betascolumn
}

function createDesignMatrix(data) {
  return data.map(row => [1, ...row]);
}




export default function graph() {
  function normalRandomMarsaglia(mean = 0, stdDev = 1) {
    let u, v, s;
    do {
        u = 2 * Math.random() - 1; // Uniformly distributed in [-1,1]
        v = 2 * Math.random() - 1;
        s = u * u + v * v;
    } while (s >= 1 || s === 0); // Reject pairs outside the unit circle

    let multiplier = Math.sqrt(-2.0 * Math.log(s) / s);
    return mean + stdDev * u * multiplier;
}

// Generate dataset as an array of objects
const data = Array.from({ length: 20 }, () => ({
  dataset1: normalRandomMarsaglia(50, 10),
  dataset2: normalRandomMarsaglia(40, 5),
  dataset3: normalRandomMarsaglia(65, 8)
}));


const designMatrix = createDesignMatrix(data.map(d => [d.dataset2]))

const y = data.map(d => [d.dataset1])

const betas = OLS(designMatrix, y)

const model = multiplyMatrices(designMatrix, betas).map(row => row[0]); // Flatten matrix

const updatedData = data.map((d, i) => ({ ...d, model: model[i] }));


//temporary function
function addPredictorsToRegression(...newPredictorKeys) {
  // Create a shallow copy of updatedData
  const newData = [...updatedData];

  // Ensure predictors exist
  newPredictorKeys.forEach(key => {
    if (!(key in newData[0])) throw new Error(`Predictor "${key}" does not exist in data.`);
  });

  // Extend the design matrix with dataset2 (baseline predictor) + new predictors
  const extendedDesignMatrix = createDesignMatrix(newData.map(d => [d.dataset2, ...newPredictorKeys.map(key => d[key])]));

  // Keep y the same (target variable)
  const y = newData.map(d => [d.dataset1]);

  // Run OLS with the extended matrix
  const newBetas = OLS(extendedDesignMatrix, y);

  // Compute new predictions
  const newModel = multiplyMatrices(extendedDesignMatrix, newBetas).map(row => row[0]);

  // Return updated dataset with new model values
  return newData.map((d, i) => ({ ...d, model: newModel[i] }));
}



//sorting
function Sorting(updatedData){
  const sortedData = [...updatedData].sort((a, b) => a.dataset2 - b.dataset2);
  return sortedData
}

const sortedData = Sorting(updatedData)








console.log("data", updatedData);

  return(
    <div className="Chart" style={{display: "flex", flexDirection: "column", alignItems: "center", height: "2000px"}}>
      <p>plotted data</p>
      <LineChart width={1000} height={300} data={sortedData}>

        <CartesianGrid></CartesianGrid>
        <XAxis dataKey="dataset2" scale="linear"></XAxis>
        <YAxis></YAxis>
        <Tooltip></Tooltip>
        <Legend></Legend>
        <Line type="linear" dataKey="model" stroke="red" dot={false}></Line>
        <Line type="linear" dataKey="dataset1" stroke="none" dot={{ fill: "blue", r: 4 }}></Line>
        
      </LineChart>
   </div>

  )
}


import { useState } from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  YAxis,
  XAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function Graph() {
  function normalRandomMarsaglia(mean = 0, stdDev = 1) {
    let u, v, s;
    do {
      u = 2 * Math.random() - 1;
      v = 2 * Math.random() - 1;
      s = u * u + v * v;
    } while (s >= 1 || s === 0);

    let multiplier = Math.sqrt(-2.0 * Math.log(s) / s);
    return mean + stdDev * u * multiplier;
  }

  // Generate dataset
  const [initialData] = useState(() => { 
    return Array.from({ length: 20 }, () => ({
     dataset1: normalRandomMarsaglia(50, 10),
     dataset2: normalRandomMarsaglia(40, 5),
     dataset3: normalRandomMarsaglia(65, 8),
     dataset4: normalRandomMarsaglia(30, 7), // Example additional predictor
  }))
});


  function createDesignMatrix(data) {
    return data.map(row => [1, ...row]);
  }

  function transposeMatrix(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  }

  function multiplyMatrices(A, B) {
    if (A[0].length !== B.length) {
      throw new Error("Number of columns in A must match number of rows in B");
    }
    return A.map(row =>
      B[0].map((_, colIndex) =>
        row.reduce((sum, value, rowIndex) => sum + value * B[rowIndex][colIndex], 0)
      )
    );
  }

  function inverseMatrix(matrix) {
    const n = matrix.length;
    let identity = matrix.map((row, i) =>
      row.map((_, j) => (i === j ? 1 : 0))
    );
    let augmented = matrix.map((row, i) => row.concat(identity[i]));

    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = k;
        }
      }
      [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

      let pivot = augmented[i][i];
      if (pivot === 0) {
        throw new Error("Matrix is singular and cannot be inverted.");
      }

      for (let j = 0; j < 2 * n; j++) {
        augmented[i][j] /= pivot;
      }

      for (let k = 0; k < n; k++) {
        if (k !== i) {
          let factor = augmented[k][i];
          for (let j = 0; j < 2 * n; j++) {
            augmented[k][j] -= factor * augmented[i][j];
          }
        }
      }
    }

    return augmented.map(row => row.slice(n));
  }

  function OLS(X, y) {
    let transpose = transposeMatrix(X);
    let firstMult = multiplyMatrices(transpose, X);
    let inverse = inverseMatrix(firstMult);
    let secondMult = multiplyMatrices(inverse, transpose);
    let betasRows = multiplyMatrices(secondMult, y);
    return betasRows.map(b => [b]);
  }

  function sortData(data) {
    return [...data].sort((a, b) => a.dataset2 - b.dataset2);
  }

  // Initial regression (only using dataset2 as predictor)
  const initialDesignMatrix = createDesignMatrix(initialData.map(d => [d.dataset2]));
  const y = initialData.map(d => [d.dataset1]);
  const initialBetas = OLS(initialDesignMatrix, y);
  const initialModel = multiplyMatrices(initialDesignMatrix, initialBetas).map(row => row[0]);

  // State for dynamic data updates
  const [updatedData, setUpdatedData] = useState(
    initialData.map((d, i) => ({ ...d, model: initialModel[i] }))
  );
  const [predictors, setPredictors] = useState(["dataset2"]); // Track included predictors

  function addPredictorsToRegression(...newPredictorKeys) {
    const newPredictors = [...new Set([...predictors, ...newPredictorKeys])]; // Ensure uniqueness

    // Extend the design matrix with selected predictors
    const extendedDesignMatrix = createDesignMatrix(
      updatedData.map(d => newPredictors.map(key => d[key]))
    );

    // Run OLS with the extended matrix
    const newBetas = OLS(extendedDesignMatrix, y);

    // Compute new predictions
    const newModel = multiplyMatrices(extendedDesignMatrix, newBetas).map(row => row[0]);

    // Update state with new model and predictors
    setUpdatedData(sortData(updatedData.map((d, i) => ({ ...d, model: newModel[i] }))));
    setPredictors(newPredictors);
  }

  return (
    <div className="Chart" style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "600px" }}>
      <p>Plotted Data</p>
      <LineChart width={1000} height={300} data={updatedData}>
        <CartesianGrid />
        <XAxis dataKey="dataset2" scale="linear" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="linear" dataKey="model" stroke="red" dot={false} />
        <Line type="linear" dataKey="dataset1" stroke="none" dot={{ fill: "blue", r: 4 }} />
      </LineChart>

      {/* Buttons to Add Predictors */}
      <button onClick={() => addPredictorsToRegression("dataset3")}>Add Dataset 3</button>
      <button onClick={() => addPredictorsToRegression("dataset4")}>Add Dataset 4</button>
    </div>
  );
}


useEffect(() => {
    console.log("updatedData after regression:", updatedData);
  }, [updatedData]);
