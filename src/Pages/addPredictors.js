import '../App.css'
import { useState, useEffect, useMemo } from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  YAxis,
  XAxis,
  Tooltip,
  Legend,
} from "recharts";

import multiplyMatrices from '../components/multiplyMatrices'
import createDesignMatrix from '../components/createDesignMatrix'
import OLS from '../components/OLS'
import normalRandomMarsaglia from '../components/normalRandomMarsaglia'


//import calculateSSR from '../components/calculateSSR.js'
//import calculateVar from '../components/calculateVar.js'
//import calculateSE from '../components/calculateSE.js'
//import calculateT from '../components/calculateT.js'
//import calculateP from '../components/calculateP.js'
import pStatistic from '../components/pStatistic.js'
import squaredR from '../components/squaredR.js'







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
    dataset16: normalRandomMarsaglia(32, 5),
  }));


const initialData = [...pre_initialData].sort((a, b) => a.dataset2 - b.dataset2);



  // Initial regression (only using dataset2 as predictor)
const initialDesignMatrix = createDesignMatrix(initialData.map(d => [d.dataset2]));
const y = initialData.map(d => [d.dataset1]);
console.log("y", JSON.stringify(y));
const initialBetas = OLS(initialDesignMatrix, y);
const initialModel = multiplyMatrices(initialDesignMatrix, initialBetas).map(row => row[0]);



export default function AddPredictors(){
  // State for dynamic data updates
  const [updatedData, setUpdatedData] = useState(
    (initialData.map((d, i) => ({ ...d, model: initialModel[i] })))
  );


  const [predictors, setPredictors] = useState(["dataset2"]); // Track included predictors

  const [pValue, setPValue] = useState([])

  function addPredictorsToRegression(...newPredictorKeys) {
    console.log("Updated Data Before Regression:", updatedData);
    const newPredictors = [...new Set([...predictors, ...newPredictorKeys])]; // Ensure uniqueness
    console.log("Predictors before update:", predictors);
    console.log("Predictors after update:", [...new Set([...predictors, ...newPredictorKeys])]);
    
    
    
        // Extend the design matrix with selected predictors
    const extendedDesignMatrix = createDesignMatrix(
      updatedData.map(d => newPredictors.map(key => d[key]))
    

  
    );
 
    console.log('DM:', JSON.stringify(extendedDesignMatrix)) 
    // Run OLS with the extended matrix
    const newBetas = OLS(extendedDesignMatrix, y);

    

    // Compute new predictions
    const newModel = multiplyMatrices(extendedDesignMatrix, newBetas).map(row => row[0]);
    console.log("newmodel", JSON.stringify(newModel))

     //calcutating p-value**
     //const SSR = calculateSSR(y, newModel)
     //console.log("SSR", SSR)
     //const variancesBetas = calculateVar(extendedDesignMatrix)
     //console.log("variances", JSON.stringify(variancesBetas))
     //const SE_Betas = calculateSE(y, variancesBetas, SSR)
     //console.log("SE_betas", JSON.stringify(SE_Betas))
     //const tStatistic = calculateT(newBetas, SE_Betas)
     //console.log("t-statistic", JSON.stringify(tStatistic))
     //const pValues = calculateP(tStatistic, y)
     //console.log("p-values", JSON.stringify(pValues))

     const pValues = pStatistic(y, newModel, extendedDesignMatrix, newBetas);

     const rSquared = squaredR(y, newModel)
     console.log('R-Squared', rSquared)


     //calcutlatin p-value**



    const dataNewModel = updatedData.map((d, i) => ({ ...d, model: newModel[i] }))

     
 
  

    setUpdatedData(dataNewModel)

    // Update state with new model and predictors
    //setUpdatedData(prevData => sortData(prevData.map((d, i) => ({ ...d, model: newModel[i] }))));
    setPredictors(newPredictors);

    
    setPValue(pValues);
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
   <> 
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
    <div className="pValueBox">
      {(pValue).map((value, i) =>
        <div className="pValueItem" key={i}>
          {value.toFixed(3)}
        </div>
      )}
    </div>  
      
   </> 
  );
}