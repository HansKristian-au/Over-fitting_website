import { studentt } from 'jstat';

export default function calculateP(tStatistic, y) {

    let n = y.length
    let p = tStatistic.length-1
    const df =  n - p - 1;

    const pValues = tStatistic.map(value =>
        2 * (1- studentt.cdf(Math.abs(value), df))   
    );

    return pValues
}