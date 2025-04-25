export default function calculateSSR (y, newModel) {

    if (Array.isArray(y[0])){
      y = y.map(arr => arr[0]);
    }


    const residuals = y.map((value, i) => value - newModel[i])

    const residualsSquared = residuals.map(residual => residual*residual)

    const SSR = residualsSquared.reduce((acc, value) => acc + value, 0)

    return SSR
 }