import { useState, useEffect } from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  YAxis,
  XAxis,
  Tooltip,
  Legend,
} from "recharts";

import {Link, Route, Routes} from 'react-router-dom'
import  AddPredictors  from './Pages/addPredictors.js'
import UnivariatePreScreening from './Pages/page2.js'

function App() {
  return (
   <>
    <nav>
      <ul>
        <li>
          <Link to="/">Add_Predictors</Link>
        </li>
        <li>
          <Link to="/page2">Univariate_Pre-testing</Link>
        </li>
      </ul>
    </nav>
    
    <Routes>
      <Route path="/" element={<AddPredictors />} />
      <Route path="/page2" element={<UnivariatePreScreening />} />
    </Routes>
  </>  
  )
}


//import addPredictors from './Pages/addPredictors.js'

export default App



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
  const pre_initialData = Array.from({ length: 20 }, () => ({
    dataset1: normalRandomMarsaglia(50, 10),
    dataset2: normalRandomMarsaglia(40, 5),
    dataset3: normalRandomMarsaglia(65, 8),
    dataset4: normalRandomMarsaglia(30, 7),
    dataset5: normalRandomMarsaglia(34, 2),
    dataset6: normalRandomMarsaglia(21, 4),
    dataset7: normalRandomMarsaglia(46, 1),
    dataset8: normalRandomMarsaglia(78, 9),
    dataset9: normalRandomMarsaglia(25, 6),
    dataset10: normalRandomMarsaglia(41, 3),
    dataset11: normalRandomMarsaglia(55, 7),
    dataset12: normalRandomMarsaglia(63, 8),
    dataset13: normalRandomMarsaglia(37, 4),
    dataset14: normalRandomMarsaglia(26, 8),
    dataset15: normalRandomMarsaglia(70, 10),
    dataset16: normalRandomMarsaglia(32, 5), // Example additional predictor
  }));

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

  function mean(X) {
    const sum = X.reduce((acc, value) => acc + value, 0)
    return sum / X.length;
  }

  function calculateSSR (y) {

    if (Array.isArray(y[0])){
      y = y.map(arr => arr[0]);
    }

    let meanY = mean(y)

    const residuals = y.map(value => value - meanY)

    const residualsSquared = residuals.map(residual => residual*residual)

    const SSR = residualsSquared.reduce((acc, value) => acc + value, 0)

    return SSR
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

   const initialData = sortData(pre_initialData)

  // Initial regression (only using dataset2 as predictor)
  const initialDesignMatrix = createDesignMatrix(initialData.map(d => [d.dataset2]));
  const y = initialData.map(d => [d.dataset1]);
  const initialBetas = OLS(initialDesignMatrix, y);
  const initialModel = multiplyMatrices(initialDesignMatrix, initialBetas).map(row => row[0]);



 function Graph1() {
  // State for dynamic data updates
  const [updatedData, setUpdatedData] = useState(
    (initialData.map((d, i) => ({ ...d, model: initialModel[i] })))
  );



  const [predictors, setPredictors] = useState(["dataset2"]); // Track included predictors

  function addPredictorsToRegression(...newPredictorKeys) {
    //console.log("Updated Data Before Regression:", updatedData);
    const newPredictors = [...new Set([...predictors, ...newPredictorKeys])]; // Ensure uniqueness
    //console.log("Predictors before update:", predictors);
    //console.log("Predictors after update:", [...new Set([...predictors, ...newPredictorKeys])]);
    
    
    
        // Extend the design matrix with selected predictors
    const extendedDesignMatrix = createDesignMatrix(
      updatedData.map(d => newPredictors.map(key => d[key]))
    

  
    );
 
   // console.log('DM:', extendedDesignMatrix) 
    // Run OLS with the extended matrix
    const newBetas = OLS(extendedDesignMatrix, y);

    // Compute new predictions
    const newModel = multiplyMatrices(extendedDesignMatrix, newBetas).map(row => row[0]);

    const dataNewModel = updatedData.map((d, i) => ({ ...d, model: newModel[i] }))

  

    setUpdatedData(dataNewModel)

    // Update state with new model and predictors
    //setUpdatedData(prevData => sortData(prevData.map((d, i) => ({ ...d, model: newModel[i] }))));
    setPredictors(newPredictors);

    console.log("updatedData after regression:", updatedData)
  }

  




  const [clicked, setClicked] = useState({
    dataset3: false,
    dataset4: false,
    dataset5: false,
    dataset6: false,
    dataset7: false,
    dataset8: false,
    dataset9: false,
    dataset10: false,
    dataset11: false,
    dataset12: false,
    dataset13: false,
    dataset14: false,
    dataset15: false,
    dataset16: false,
  });

  const handleAddDataset = (dataset) => {
    addPredictorsToRegression(dataset);
    setClicked(prev => ({
      ...prev,
      [dataset]: true,
    }));
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

      
      <button onClick={() => {handleAddDataset("dataset3")}} disabled={clicked.dataset3}>Add Dataset 3</button>
      <button onClick={() => addPredictorsToRegression("dataset4")}>Add Dataset 4</button>
      <button onClick={() => {handleAddDataset("dataset5")}} disabled={clicked.dataset5}>Add Dataset 5</button>
      <button onClick={() => {handleAddDataset("dataset6")}} disabled={clicked.dataset6}>Add Dataset 6</button>
      <button onClick={() => {handleAddDataset("dataset7")}} disabled={clicked.dataset7}>Add Dataset 7</button>
      <button onClick={() => {handleAddDataset("dataset8")}} disabled={clicked.dataset8}>Add Dataset 8</button>
      <button onClick={() => {handleAddDataset("dataset9")}} disabled={clicked.dataset9}>Add Dataset 9</button>
      <button onClick={() => {handleAddDataset("dataset10")}} disabled={clicked.dataset10}>Add Dataset 10</button>
      <button onClick={() => {handleAddDataset("dataset11")}} disabled={clicked.dataset11}>Add Dataset 11</button>
      <button onClick={() => {handleAddDataset("dataset12")}} disabled={clicked.dataset12}>Add Dataset 12</button>
      <button onClick={() => {handleAddDataset("dataset13")}} disabled={clicked.dataset13}>Add Dataset 13</button>
      <button onClick={() => {handleAddDataset("dataset14")}} disabled={clicked.dataset14}>Add Dataset 14</button>
      <button onClick={() => {handleAddDataset("dataset15")}} disabled={clicked.dataset15}>Add Dataset 15</button>
      <button onClick={() => {handleAddDataset("dataset16")}} disabled={clicked.dataset16}>Add Dataset 16</button>
    </div>
  );
};



