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

import pStatistic from '../components/pStatistic.js'
import squaredR from '../components/squaredR.js'
import GatherNewData from '../components/gatherNewData.js'

import RegressionFormulaDisplay from '../layout_components/regressionFormulaDisplay.js'
import { readableNames } from '../layout_components/readableNames.js'






const initialData = Array.from({ length: 20 }, () => ({
  variable1: normalRandomMarsaglia(50, 10),
  variable2: normalRandomMarsaglia(40, 5),
  variable3: normalRandomMarsaglia(65, 8),
  variable4: normalRandomMarsaglia(30, 7),
  variable5: normalRandomMarsaglia(34, 2),
  variable6: normalRandomMarsaglia(21, 4),
  variable7: normalRandomMarsaglia(46, 1),
  variable8: normalRandomMarsaglia(78, 9),
  variable9: normalRandomMarsaglia(25, 6),
  variable10: normalRandomMarsaglia(41, 3),
  variable11: normalRandomMarsaglia(55, 7),
  variable12: normalRandomMarsaglia(63, 8),
  variable13: normalRandomMarsaglia(37, 4),
  variable14: normalRandomMarsaglia(26, 8),
  variable15: normalRandomMarsaglia(70, 10),
  variable16: normalRandomMarsaglia(32, 5),
  variable17: normalRandomMarsaglia(32, 5),
  variable18: normalRandomMarsaglia(32, 5),
}));

const y = initialData.map(d => [d.variable1]);
console.log("y", JSON.stringify(y));






export default function UnivariatePreScreening() {
 
  const [updatedData, setUpdatedData] = useState([]);

  const [predictors, setPredictors] = useState("variable2"); // Track included predictors

  const [pValue, setPValue] = useState([])

  const [rSquared, setRSquared] = useState()

  function addPredictorsToRegression(newPredictorKey) {
    setPredictors(newPredictorKey);
    console.log("predictors", JSON.stringify(predictors))
    console.log("Updated Data Before Regression:", updatedData);
    const predictor = [newPredictorKey]; // Ensure uniqueness
    console.log("Predictors before update:", predictor);

    const predictorValues = initialData.map(d => [d[newPredictorKey]]);


    
    console.log('dataset2:', JSON.stringify(predictorValues)) 
    
        // Extend the design matrix with selected predictors
    const extendedDesignMatrix = createDesignMatrix(predictorValues);
 
    console.log('DM:', JSON.stringify(extendedDesignMatrix)) 
    // Run OLS with the extended matrix
    const newBetas = OLS(extendedDesignMatrix, y);

    

    // Compute new predictions
    const newModel = multiplyMatrices(extendedDesignMatrix, newBetas).map(row => row[0]);
    console.log("newmodel", JSON.stringify(newModel))

  

     const pValues = pStatistic(y, newModel, extendedDesignMatrix, newBetas);

     const rSquared = squaredR(y, newModel)
     setRSquared(rSquared)
     console.log('R-Squared', rSquared)



     
    

    const dataNewModel = initialData.map((d, i) => ({ ...d, model: newModel[i] }))

     
    console.log("datanewmodel", dataNewModel)

    const sortedDataNewModel = dataNewModel.sort((a, b) => a[newPredictorKey] - b[newPredictorKey]);
  

    setUpdatedData(sortedDataNewModel)

    

    
    setPValue(pValues);
  }

  useEffect(() => {
    addPredictorsToRegression("variable2");
  }, []);
  




  const [clicked, setClicked] = useState({
    variable3: false,
    variable4: false,
    variable5: false,
    variable6: false,
    variable7: false,
    variable8: false,
    variable9: false,
    variable10: false,
    variable11: false,
    variable12: false,
    variable13: false,
    variable14: false,
    variable15: false,
    variable16: false,
    variable17: false,
    variable18: false,
  });

  const handleAddDataset = (dataset) => {
    addPredictorsToRegression(dataset);
    setClicked(prev => ({
      ...prev,
      [dataset]: true,
    }));
  }
  


  const hasSignificantPredictor = pValue.slice(1).some(value => value > 0.05);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;
  
    const dataPoint = payload[0].payload;
  
    return (
      <div style={{ background: "#fff", border: "1px solid #ccc", padding: "8px", fontSize: "14px" }}>
        <p><strong>{readableNames[predictors]}:</strong> {dataPoint.variable2.toFixed(1)}</p>
        <p><strong>Sleep(hours):</strong> {dataPoint.variable1.toFixed(1)}</p>
        <p><strong>Model:</strong> {dataPoint.model.toFixed(1)}</p>
      </div>
    );
  };
  
    
 
  return (
   <> 
     <div className="layout-container">
        <div className="Chart" style={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
        <p style={{fontSize : "20px", fontWeight: "bold", marginBottom: "1em"}}>
            Over-fitting by pre-testing predictors one at a time
            </p>  
          <p style={{border: "1px solid #ccc", background: "#f9f9f9", padding: "5px"}}>
          Over-fitting is when a model finds a significant relationship in a sample which doesn't exist in the wider population from which the sample was drawn. This is an issue, because if the relationship doesn't exist in the wider population then your model will not predict your outcome variable no matter how significant your p-value is.<br />
          This webapp illustrates how testing your predictors independently before adding them to your final model increases the risk of over-fitting. Below is a linear regression layout where you can make a univariable model for each predictor in your dataset(which is what univariable pre-testing is). Your assignment will be to create models until you find a significant relationship between a predictor and the sleep variable. <br />
          There is an important twist: even though all the variables below are given food names they are randomized variables. This means that any significant p-values you find will be spurious and the R^2 value should ideally be zero. Notice that in spite of this the R^2 is sometimes quite high and you can get more than one significant p-value from the same dataset. When you get a significant p-value you can try pressing the 'recolloct data' button and see if your model can predict sleep hours. You'll see that it does not!
            </p>
            <p style={{border: "1px solid #ccc", background: "#f9f9f9", padding: "5px"}}>
            Study: Does what you eat affect how you sleep?<br />
            Participants: 20<br />
            Experiment: Participants recorded how much they ate of 17 different food items and how much they slept for 7 days.<br />
            Objective: Try creating univariable models from the various food items and see if any yield a significant p-value. If one of them does then press recollect data to see if the model can predict a new batch of sleep data.<br />
            </p>
          <p>Plotted Sleep Data</p>
          <LineChart width={935} height={300} data={updatedData}>
            <CartesianGrid />
            <XAxis dataKey={predictors} scale="linear" tickFormatter={(value) => value.toFixed(1)} />
            <YAxis label={
                          <text
                            x={-2}
                            y={15}  // adjust based on chart height (near bottom)
                            transform="rotate(-90)"
                            textAnchor="end"
                            fill="#666"
                          >
                            Total Hours of Sleep During the Week
                          </text>
                        }/>
            <Tooltip content={CustomTooltip}/>
            <Legend />
            <Line type="linear" dataKey="model" stroke="red" dot={false} />
            <Line type="linear" dataKey="variable1" name={readableNames[predictors]} stroke="none" dot={{ fill: "blue", r: 4 }} />
          </LineChart>

       </div>
       <div className="model-display">
            <RegressionFormulaDisplay predictors={predictors} readableNames={readableNames} />
       </div> 
       <div className="metrics-row">

        <div className="button-grid">  
          <button onClick={() => {handleAddDataset("variable3")}} disabled={clicked.variable3 || !hasSignificantPredictor}>Test Broccoli</button>
          <button onClick={() => {handleAddDataset("variable4")}} disabled={clicked.variable4 || !hasSignificantPredictor}>Test Apples</button>
          <button onClick={() => {handleAddDataset("variable5")}} disabled={clicked.variable5 || !hasSignificantPredictor}>Test Chicken</button>
          <button onClick={() => {handleAddDataset("variable6")}} disabled={clicked.variable6 || !hasSignificantPredictor}>Test Rice</button>
          <button onClick={() => {handleAddDataset("variable7")}} disabled={clicked.variable7 || !hasSignificantPredictor}>Test Cheese</button>
          <button onClick={() => {handleAddDataset("variable8")}} disabled={clicked.variable8 || !hasSignificantPredictor}>Test Bananas</button>
          <button onClick={() => {handleAddDataset("variable9")}} disabled={clicked.variable9 || !hasSignificantPredictor}>Test Eggs</button>
          <button onClick={() => {handleAddDataset("variable10")}} disabled={clicked.variable10 || !hasSignificantPredictor}>Test Carrots</button>
          <button onClick={() => {handleAddDataset("variable11")}} disabled={clicked.variable11 || !hasSignificantPredictor}>Test Tomatoes</button>
          <button onClick={() => {handleAddDataset("variable12")}} disabled={clicked.variable12 || !hasSignificantPredictor}>Test Bread</button>
          <button onClick={() => {handleAddDataset("variable13")}} disabled={clicked.variable13 || !hasSignificantPredictor}>Test Yogurt</button>
          <button onClick={() => {handleAddDataset("variable14")}} disabled={clicked.variable14 || !hasSignificantPredictor}>Test Fish</button>
          <button onClick={() => {handleAddDataset("variable15")}} disabled={clicked.variable15 || !hasSignificantPredictor}>Test Peas</button>
          <button onClick={() => {handleAddDataset("variable16")}} disabled={clicked.variable16 || !hasSignificantPredictor}>Test Cereal</button>
          <button onClick={() => {handleAddDataset("variable17")}} disabled={clicked.variable17 || !hasSignificantPredictor}>Test Nuts</button>
          <button onClick={() => {handleAddDataset("variable18")}} disabled={clicked.variable18 || !hasSignificantPredictor}>Test Juice</button>





        </div>

        <div className="rSquared-box">
          R² ={" "}
          <span
            style={{
              color:
                rSquared < 0.3 ? "red" :
                rSquared < 0.6 ? "orange" :
                "#10B981"
            }}
        >
            {typeof rSquared === "number" ? rSquared.toFixed(3) : "..."}
          </span>
        </div>
        <div className="pValueBox" style={{ border: "1px solid #ccc"}}>
          <div className="pValueHeader">predictor</div>
          <div className="pValueHeader">p-value</div>

          {(pValue).map((value, i) => (
          <>
            <div className="pValueLabel">{i === 0 ? "Intercept" : readableNames[predictors] || predictors}</div> 
            <div className="pValueItem" key={i} style={{ color: i !== 0 && value < 0.05 ? '#10B981' : 'inherit' }}> {value.toFixed(3)}</div>
          </> 
          ))}
        </div>
        </div>
        <button
                    className="recollect-button"
                    onClick={() => GatherNewData({updatedData, setUpdatedData, setRSquared, setPValue})}
                    disabled={hasSignificantPredictor}
                  >
                    Recollect Data
          </button>
       </div>
      
   </> 
  );
}