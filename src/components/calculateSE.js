export default function calculateSE(y ,variances, SSR) {
    let n = y.length
    let p = variances.length-1

    const SE_Betas = variances.map(value => 
        Math.sqrt((SSR*value)/(n-p-1))
    );
  
    return SE_Betas
}