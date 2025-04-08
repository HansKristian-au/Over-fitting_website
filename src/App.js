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
  const initialData = Array.from({ length: 20 }, () => ({
    dataset1: normalRandomMarsaglia(50, 10),
    dataset2: normalRandomMarsaglia(40, 5),
    dataset3: normalRandomMarsaglia(65, 8),
    dataset4: normalRandomMarsaglia(30, 7), // Example additional predictor
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
    (initialData.map((d, i) => ({ ...d, model: initialModel[i] })))
  );
  const [predictors, setPredictors] = useState(["dataset2"]); // Track included predictors

  function addPredictorsToRegression(...newPredictorKeys) {
    const newPredictors = [...new Set([...predictors, ...newPredictorKeys])]; // Ensure uniqueness
    console.log("Predictors before update:", predictors);
    console.log("Predictors after update:", [...new Set([...predictors, ...newPredictorKeys])]);
    console.log("Updated Data Before Regression:", updatedData);
    
    
        // Extend the design matrix with selected predictors
    const extendedDesignMatrix = createDesignMatrix(
      updatedData.map(d => newPredictors.map(key => d[key]))
    

  
    );
 
    console.log('DM:', extendedDesignMatrix) 
    // Run OLS with the extended matrix
    const newBetas = OLS(extendedDesignMatrix, y);

    // Compute new predictions
    const newModel = multiplyMatrices(extendedDesignMatrix, newBetas).map(row => row[0]);

    // Update state with new model and predictors
    setUpdatedData(prevData => sortData(prevData.map((d, i) => ({ ...d, model: newModel[i] }))));
    setPredictors(newPredictors);

    console.log("updatedData after regression:", updatedData)
  }

  useEffect(() => {
    console.log("updatedData after regression:", updatedData);
  }, [updatedData]);





  const [clicked, setClicked] = useState({
    dataset3: false,
    dataset4: false,
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
    </div>
  );
}