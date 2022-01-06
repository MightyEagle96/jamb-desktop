const timer = 15 * 60 * 1000 + 100000;

let hrlLabel = Math.floor(timer / (60 * 60 * 1000));

let minLabel = Math.floor((timer / (60 * 1000)) % 60);

let secLabel = (timer % (60 * 1000)) / 1000;

console.log(`${hrlLabel}:${minLabel}:${secLabel}`);
