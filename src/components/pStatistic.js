import calculateSSR from './calculateSSR.js'
import calculateVar from './calculateVar.js'
import calculateSE from './calculateSE.js'
import calculateT from './calculateT.js'
import calculateP from './calculateP.js'


export default function pStatistic(y, newModel, extendedDesignMatrix, newBetas) {
      const SSR = calculateSSR(y, newModel)
      console.log("SSR", SSR)
      const variancesBetas = calculateVar(extendedDesignMatrix)
      console.log("variances", JSON.stringify(variancesBetas))
      const SE_Betas = calculateSE(y, variancesBetas, SSR)
      console.log("SE_betas", JSON.stringify(SE_Betas))
      const tStatistic = calculateT(newBetas, SE_Betas)
      console.log("t-statistic", JSON.stringify(tStatistic))
      const pValues = calculateP(tStatistic, y)
      console.log("p-values", JSON.stringify(pValues)) 

      return(pValues)

}