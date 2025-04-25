export default function calculateT(Betas, SE) {

    const t = Betas.map((value, i) => value/SE[i] );

    return t;

}