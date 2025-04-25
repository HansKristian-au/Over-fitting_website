 export default function calculateMean(y) {
    if (Array.isArray(y[0])){
    y = y.map(arr => arr[0]);
  }
    const sum = y.reduce((acc, value) => acc + value, 0)
    return sum / y.length;
  }
  