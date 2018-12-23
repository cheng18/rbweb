import s from 'stochastic'

export function test () {
    var geometricBrownianMotion = s.GBM(1258715, 0, 0.1, 35, 35, true);
    console.log(geometricBrownianMotion);
}

