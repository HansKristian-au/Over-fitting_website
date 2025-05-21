export default function regressionFormulaDisplay({ predictors, readableNames }) {

   const safePredictors = Array.isArray(predictors) ? predictors : [predictors];

    return (
      <div style={{ fontFamily: 'monospace', fontSize: '16px', padding: '10px' }}>
        <span>y = </span>
        <span>β<sub>0</sub></span>
        {safePredictors.map((p, i) => (
          <span key={i}>
            {" + "}
            β<sub>{readableNames[p] || p}</sub>·x<sub>{readableNames[p] || p}</sub>
          </span>
        ))}
      </div>
    );
  }