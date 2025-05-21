import squaredR from './squaredR.js'
import normalRandomMarsaglia from './normalRandomMarsaglia.js'

export default function gatherNewData({updatedData, setUpdatedData, setRSquared, setPValue}) {
  const newOutcomeVariable = Array.from({ length: 20}, () => normalRandomMarsaglia(50,10));
  
  setUpdatedData(prevData =>
    prevData.map((item, index) => ({
      ...item,
      variable1: newOutcomeVariable[index]  
    }))
  );
  
  const model = updatedData.map(d => d.model);
  const rSquared = squaredR(model, newOutcomeVariable)
  console.log('R-Squared', rSquared) 
  setRSquared(rSquared);
  setPValue([]);
}