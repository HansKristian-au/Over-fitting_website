import calculateMean from './calculateMean.js'
import calculateSSR from './calculateSSR.js'

export default function squaredR(y, newModel) {

    let meanY = calculateMean(y)
    const nullResiduals = y.map(value => (value - meanY)**2)
    const TSS = nullResiduals.reduce((acc, value) => acc + value, 0);

    const SSR = calculateSSR(y, newModel)

    let rSquared = 1 - (SSR/TSS)

    return rSquared
}