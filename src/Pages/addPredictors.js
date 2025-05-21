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







const pre_initialData = Array.from({ length: 20 }, () => ({
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

const y = pre_initialData.map(d => [d.variable1]);
console.log("y", JSON.stringify(y));

const initialData = [...pre_initialData].sort((a, b) => a.variable2 - b.variable2);
//const initialDesignMatrix = createDesignMatrix(initialData.map(d => [d.dataset2]));
//const initialBetas = OLS(initialDesignMatrix, y);
//const initialModel = multiplyMatrices(initialDesignMatrix, initialBetas).map(row => row[0]);





export default function AddPredictors(){
  // State for dynamic data updates
 // const [updatedData, setUpdatedData] = useState(
 //   (initialData.map((d, i) => ({ ...d, model: initialModel[i] })))
//);
  const [updatedData, setUpdatedData] = useState(initialData);
  const [predictors, setPredictors] = useState([]);

  //const [predictors, setPredictors] = useState(["dataset2"]); // Track included predictors

  const [pValue, setPValue] = useState([])

  const [showExtraComponent, setShowExtraComponent] = useState(false);

  const [polishedDataset, setPolishedDataset] = useState(null)

  const [rSquared, setRSquared] = useState(null)
  const [rSquaredAdjusted, setRSquareAdjusted] = useState(null);

  const [highlightReport, setHighlightReport] = useState(false);

  const [numToAdd, setNumToAdd] = useState(1);

  const [bonferroniOn, setBonferroniOn] = useState(false);
  const [testCount, setTestCount] = useState(0);

  const[pValueThreshold, setPValueThreshold] = useState(0.05);





  function addPredictorsToRegression(...newPredictorKeys) {
    console.log("Updated Data Before Regression:", JSON.stringify(updatedData));
    const newPredictors = [...new Set([...predictors, ...newPredictorKeys])]; // Ensure uniqueness
    console.log("Predictors before update:", predictors);
    console.log("Predictors after update:", [...new Set([...predictors, ...newPredictorKeys])]);
    
    
    
    
    const extendedDesignMatrix = createDesignMatrix(
      updatedData.map(d => newPredictors.map(key => d[key]))
    

  
    );
 
    console.log('DM:', JSON.stringify(extendedDesignMatrix)) 
   
    const newBetas = OLS(extendedDesignMatrix, y);

    
    const newModel = multiplyMatrices(extendedDesignMatrix, newBetas).map(row => row[0]);
    console.log("newmodel", JSON.stringify(newModel))

  
    

     const pValues = pStatistic(y, newModel, extendedDesignMatrix, newBetas);

     const rSquaredTemporary = squaredR(y, newModel)
     const rSquaredAdjustedTemporary = adjustedRSquared(rSquaredTemporary, newPredictors)
     console.log('R-Squared', rSquaredTemporary)
     console.log('adjusted',JSON.stringify(rSquaredAdjustedTemporary))
  


   



    const dataNewModel = updatedData.map((d, i) => ({ ...d, model: newModel[i] }))

    const newTests = pValues.length - 1;
    const updatedTestCount = testCount + newTests;
   
  

    setUpdatedData(dataNewModel)

    setPredictors(newPredictors);

    setPValue(pValues);
    setTestCount(prev => prev + (pValues.length - 1));
    setRSquared(rSquaredTemporary);
    setRSquareAdjusted(rSquaredAdjustedTemporary)
    

    
    const threshold = bonferroniOn && updatedTestCount > 0 
      ? 0.05 / updatedTestCount 
      : 0.05;
    setPValueThreshold(threshold) 
// check for significant predictor and log
const result = getSignificantPredictorData(pValues, newPredictors, dataNewModel, rSquared, threshold);
if (result) {
  console.log("✅ Significant predictor found:", result.key);
  console.log("Predictor values:", result.predictorValues);
  console.log("Target values:", result.targetValues);
  console.log("Design Matrix:", result.designMatrix);
  console.log("polished model:", result.polishedModel);
  console.log("polished data:", result.polishedData);
} else {
  console.log("❌ No significant predictors found.");
}

  }






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
  


  
  useEffect(() => {
    // Run initial regression with dataset2 on first render
    addPredictorsToRegression("variable2");
    setTestCount(1);
  }, []);
  

  const handleAddDataset = (dataset) => {
    addPredictorsToRegression(dataset);
    setClicked(prev => ({
      ...prev,
      [dataset]: true,
    }));
  }
  




function ToggleBox({ data, xKey, significantPValue, significantRSquared, readableNames }) {
  console.log("pValue in ToggleBox:", significantPValue);
  const CustomToggleTooltip = ({ active, payload }) => {
    if (!active || !payload || payload.length === 0) return null;
  
    const point = payload[0].payload;
    const label = readableNames?.[xKey] || xKey;
  
    return (
      <div style={{ background: "#fff", border: "1px solid #ccc", padding: "8px", fontSize: "14px" }}>
        <p><strong>{label}:</strong> {point[xKey].toFixed(1)}</p>
        <p><strong>Sleep(hours):</strong> {point.dataset1.toFixed(1)}</p>
        <p><strong>Model:</strong> {point.model.toFixed(1)}</p>
      </div>
    );
  };
  

  return (
    <div style={{ padding: '1em', marginTop: '1em', border: '1px solid #ccc' }}>
      <p>Significant Predictor Chart</p>
      <LineChart width={800} height={300} data={data}>
        <CartesianGrid />
        <XAxis dataKey={xKey} scale="linear" name="significant predictor" tickFormatter={(value) => value.toFixed(1)}/>
        <YAxis
          label={
            <text
              x={-2}
              y={15}
              transform="rotate(-90)"
              textAnchor="end"
              fill="#666"
            >
              Total Hours of Sleep During the Week
            </text>
          }
        />
        <Tooltip content={<CustomToggleTooltip />} />
        <Legend />
        <Line type="linear" dataKey="model" stroke="red" dot={false} />
        <Line type="linear" dataKey="dataset1" stroke="none" name={readableNames[xKey]} dot={{ fill: "blue", r: 4 }} />
      </LineChart>
      <div style={{ marginLeft: '1em', paddingTop: '2em' }}>

         
         <p style={{ fontWeight: 'bold', whiteSpace: 'pre' }}>
           p-value = {significantPValue.toFixed(3)}     R^2 = {significantRSquared.toFixed(3)}
          </p>
          <p>
            you can now report this p-value and illustrate the effect with this simplified graph. What do you think would happen if someone tried to replicate your finding? Click on 'Recollect Data' to find out.
          </p>
      </div>
    </div>
  );
}



function getSignificantPredictorData(pValues, predictors, updatedData, rSquared, threshold) {
  for (let i = 1; i < pValues.length; i++) {
    if (pValues[i] < threshold) {
      const significantPValue = pValues[i]
      const significantRSquared = rSquared

      const key = predictors[i-1];
      const predictorValues = updatedData.map(d => [d[key]]);
      const targetValues = updatedData.map(d => [d.variable1]); // your dependent variable
      
      const designMatrix = createDesignMatrix(predictorValues)
      const betas = OLS(designMatrix, targetValues)
      const polishedModel = multiplyMatrices(designMatrix, betas);

      const combinedData = targetValues.map((row, i) => ({
        dataset1: row[0],
        [key]: predictorValues[i][0],
        model: polishedModel[i][0]
      }));

      const polishedData = [...combinedData].sort((a, b) => a[key] - b[key]);

      setPolishedDataset({polishedData, key, significantPValue, significantRSquared})
      setHighlightReport(true); 

      
      return {
        key, // name like 'dataset3'
        predictorValues,
        targetValues,
        designMatrix,
        polishedModel,
        polishedData,
        significantPValue,
        significantRSquared
      };
    }
  }
  return null; // No significant predictor found
}



const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  const dataPoint = payload[0].payload;

  return (
    <div style={{ background: "#fff", border: "1px solid #ccc", padding: "8px", fontSize: "14px" }}>
      <p><strong>Milk(dl):</strong> {dataPoint.variable2.toFixed(1)}</p>
      <p><strong>Sleep(hours):</strong> {dataPoint.variable1.toFixed(1)}</p>
      <p><strong>Model:</strong> {dataPoint.model.toFixed(1)}</p>
    </div>
  );
};

function adjustedRSquared (rSquared, predictors) {
  const p = predictors.length;
  const N = 20;

  const adjusted = 1 - (((1-rSquared)*(N - 1)) / (N - p - 1));

  return adjusted;
}

function addMultipleUnusedPredictors(n) {
  const allPossible = [
    "variable3", "variable4", "variable5", "variable6",
    "variable7", "variable8", "variable9", "variable10",
    "variable11", "variable12", "variable13", "variable14",
    "variable15", "variable16", "variable17", "variable18"
  ];

  // Filter out predictors already in use
  const unused = allPossible.filter(p => !predictors.includes(p));

  // Shuffle unused predictors to avoid always picking the same ones
  const shuffled = [...unused].sort(() => Math.random() - 0.5);

  // Take the first N from the shuffled list
  const selected = shuffled.slice(0, n);

  if (selected.length > 0) {
    addPredictorsToRegression(...selected);

    // Mark them as clicked (so UI disables their buttons)
    setClicked(prev => {
      const updated = { ...prev };
      selected.forEach(p => updated[p] = true);
      return updated;
    });
  } else {
    console.log("🚫 No unused predictors left to add.");
  }
}

const maxAddable = useMemo(() => {
  const allPossible = [
    "variable3", "variable4", "variable5", "variable6",
    "variable7", "variable8", "variable9", "variable10",
    "variable11", "variable12", "variable13", "variable14",
    "variable15", "variable16", "variable17", "variable18"
  ];
  return allPossible.filter(p => !predictors.includes(p)).length;
}, [predictors]);


const alpha = 0.05;
const numTests = numToAdd;

const effectiveAlpha = bonferroniOn ? alpha / numTests : alpha;
const probFalsePositive = 1 - Math.pow(1 - effectiveAlpha, numTests);


useEffect(() => {
  const threshold = bonferroniOn && testCount > 0
    ? 0.05 / testCount
    : 0.05;
  setPValueThreshold(threshold);
}, [bonferroniOn, testCount]);

function formatThreshold(threshold) {
  // Convert to 2 significant figures
  const str = threshold.toPrecision(2);

  // Convert to fixed-decimal if in scientific notation
  const fixed = Number(str).toString();

  return fixed;
}

 
  return (
   <> 
     <div className="layout-container">
      <div className="Chart" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <p style={{fontSize : "20px", fontWeight: "bold", marginBottom: "1em"}}>
        Over-fitting by adding too many predictors to a linear model
        </p>  
      <p style={{border: "1px solid #ccc", background: "#f9f9f9", padding: "5px"}}>
       Over-fitting is when a model finds a significant relationship in a sample which doesn't exist in the wider population from which the sample was drawn. This is an issue, because if the relationship doesn't exist in the wider population then your model will not predict your outcome variable no matter how significant your p-value is. <br />
       This webapp is designed to illustrate how adding too many predictors to a model can lead to over-fitting. Below is a linear regression with a single predictor and your assignment will be to add predictors while observing how it affects the R^2 value and the p-values.<br /> 
       There is an important twist: even though all the variables below are given food names they are randomized variables. This means that any significant p-values you find will be spurious and the R^2 value should ideally be zero. Notice that in spite of this the R^2 always increases when a predictor is added and you almost always get a significant p-value. When you get a significant p-value the app will force you to engage in some bad practice by creating a report of your results. After creating the report you can collect more data to see if your model actually predicts the outcome variable. You'll see that it does not!
        </p>
        <p style={{border: "1px solid #ccc", background: "#f9f9f9", padding: "5px"}}>
        Study: Does what you eat affect how you sleep?<br />
        Participants: 20<br />
        Experiment: Participants recorded how much they ate of 17 different food items and how much they slept for 7 days.<br />
        Objective: Investigate if there is a relationship between food intake and sleep by adding predictors to your model. Keep adding predictors until you get a significant p-value and then report your results.<br />
      
        </p>
        <p>Plotted Sleep Data</p>
        <LineChart width={935} height={300} data={updatedData}>
          <CartesianGrid />
          <XAxis dataKey="variable2" scale="linear"  tickFormatter={(value) => value.toFixed(1)}/>
          <YAxis  label={
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
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="linear" dataKey="model" stroke="red" dot={false} />
          <Line type="linear" dataKey="variable1" name="Milk(dl)" stroke="none" dot={{ fill: "blue", r: 4 }} />
        </LineChart>
      </div> 
      <div className="model-display">
      <RegressionFormulaDisplay predictors={predictors} readableNames={readableNames} />
      </div>
      <div className="metrics-row">

        <div className="button-grid">  
        <button onClick={() => {handleAddDataset("variable3")}} disabled={clicked.variable3 || polishedDataset}>Add Broccoli</button>
        <button onClick={() => {handleAddDataset("variable4")}} disabled={clicked.variable4 || polishedDataset}>Add Apples</button>
        <button onClick={() => {handleAddDataset("variable5")}} disabled={clicked.variable5 || polishedDataset}>Add Chicken</button>
        <button onClick={() => {handleAddDataset("variable6")}} disabled={clicked.variable6 || polishedDataset}>Add Rice</button>
        <button onClick={() => {handleAddDataset("variable7")}} disabled={clicked.variable7 || polishedDataset}>Add Cheese</button>
        <button onClick={() => {handleAddDataset("variable8")}} disabled={clicked.variable8 || polishedDataset}>Add Bananas</button>
        <button onClick={() => {handleAddDataset("variable9")}} disabled={clicked.variable9 || polishedDataset}>Add Eggs</button>
        <button onClick={() => {handleAddDataset("variable10")}} disabled={clicked.variable10 || polishedDataset}>Add Carrots</button>
        <button onClick={() => {handleAddDataset("variable11")}} disabled={clicked.variable11 || polishedDataset}>Add Tomatoes</button>
        <button onClick={() => {handleAddDataset("variable12")}} disabled={clicked.variable12 || polishedDataset}>Add Bread</button>
        <button onClick={() => {handleAddDataset("variable13")}} disabled={clicked.variable13 || polishedDataset}>Add Yogurt</button>
        <button onClick={() => {handleAddDataset("variable14")}} disabled={clicked.variable14 || polishedDataset}>Add Fish</button>
        <button onClick={() => {handleAddDataset("variable15")}} disabled={clicked.variable15 || polishedDataset}>Add Peas</button>
        <button onClick={() => {handleAddDataset("variable16")}} disabled={clicked.variable16 || polishedDataset}>Add Cereal</button>
        <button onClick={() => {handleAddDataset("variable17")}} disabled={clicked.variable17 || polishedDataset}>Add Nuts</button>
        <button onClick={() => {handleAddDataset("variable18")}} disabled={clicked.variable18 || polishedDataset}>Add Juice</button>
  
        </div>
      
        <div className="rSquared-box">
          <div>
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
           <hr style={{ margin: "10px 0", border: "0", borderTop: "1px solid #ccc" }} />
           <div>
           Adjusted R² ={" "}
           <span style={{ color: rSquaredAdjusted < 0.3 ? "red" : rSquaredAdjusted < 0.6 ? "orange" : "#10B981" }}>
             {typeof rSquaredAdjusted === "number" ? rSquaredAdjusted.toFixed(3) : "..."}
           </span>
           </div> 
        </div>
        <div className="pValueBox" style={{ border: `${polishedDataset ? '2px' : '1px'} solid ${polishedDataset ? '#10B981' : '#ccc'}`}}>
          <div className="pValueHeader">predictor</div>
          <div className="pValueHeader">p-value</div>

          {(pValue).map((value, i) => (
          <>
            <div className="pValueLabel">{i === 0 ? "Intercept" : readableNames[predictors[i - 1]] || predictors[i - 1]}</div> 
            <div className="pValueItem" key={i} style={{ color: i !== 0 && value < pValueThreshold ? '#10B981' : 'inherit' }}> {value.toFixed(3)}</div>
          </> 
          ))}
        </div>
        
      
        
      </div>
      <div className="controls-row">
        <div className="tooltip-button-wrapper">
          <button
            className="hover-button"
            onClick={() => GatherNewData({updatedData, setUpdatedData, setRSquared, setPValue})}
            disabled={!polishedDataset}
          >
            Recollect Data
          </button>
          <div className="hover-tooltip">
            20 new participants record what they eat for a week.<br /> Can your model predict how much they will sleep?
          </div>
        </div>

        <div className="extra-controls"> 
          <div className="arrow-and-button">

            <button onClick={() => setShowExtraComponent(prev => !prev)}
              disabled={!polishedDataset}
              >
                {showExtraComponent ? 'Hide' : 'Show'} Report
              </button>
              {highlightReport && (
              <div className="arrow-label">⬅</div>
            )} 
           </div>   
        </div>   
       </div>  

        {showExtraComponent && polishedDataset && (
         <div className="extra-display">
          <ToggleBox 
            data={polishedDataset.polishedData} 
            xKey={polishedDataset.key} 
            significantPValue={polishedDataset.significantPValue} 
            significantRSquared={polishedDataset.significantRSquared}
            readableNames={readableNames}
          />
         </div> 
        )}
         <div className='predictor-controls-row'>
            <div className="predictor-stepper-box">
              <button onClick={() => addMultipleUnusedPredictors(numToAdd)} disabled={!!polishedDataset}>Add</button>

              <div className="stepper-display">
                <div className="stepper-arrow" onClick={() => setNumToAdd(n => Math.min(n + 1, maxAddable))}>▲</div>
                <div className="stepper-number">{numToAdd}</div>
                <div className="stepper-arrow" onClick={() => setNumToAdd(n => n > 1 ? n - 1 : n)}>▼</div>
              </div>
              <div style={{ height: "2.8em", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ fontSize: "14px", fontStyle: "italic", margin: 0, textalign: "center" }}>
                Chance of at least one false positive when adding {numToAdd} predictor{numToAdd > 1 ? "s" : ""}:{" "}
                <span>
                <strong>{(probFalsePositive * 100).toFixed(1)}%</strong>
                </span>
                <span
                    style={{
                      visibility: bonferroniOn ? "visible" : "hidden",
                      display: "inline-block",
                      width: "auto",
                    }}
                  >
                    (Bonferroni-adjusted)
                  </span>
              </p>
              </div>
              <div className="bonferroni-toggle" onClick={() => setBonferroniOn(prev => !prev)}>
                <div className={`checkbox ${bonferroniOn ? "checked" : ""}`}></div>
                <label>Bonferroni correction</label>
              </div>
            </div>
              <div className="bonferroni-metrics-box" style={{ visibility: bonferroniOn ? "visible" : "hidden" }}>
                <div className="bonferroni-line">
                    <span className="metric-label"># of tests:</span> {testCount}
                  </div>
                  <div className="bonferroni-line">
                    <span className="metric-label">p-value threshold:</span> {formatThreshold(pValueThreshold)}
                </div>
              </div>
              
            
          </div>
        
    </div>  
   </> 
  );
}