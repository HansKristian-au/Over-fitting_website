export default function normalRandomMarsaglia(mean = 0, stdDev = 1) {
    let u, v, s;
    do {
      u = 2 * Math.random() - 1;
      v = 2 * Math.random() - 1;
      s = u * u + v * v;
    } while (s >= 1 || s === 0);

    let multiplier = Math.sqrt(-2.0 * Math.log(s) / s);
    return mean + stdDev * u * multiplier;
  }