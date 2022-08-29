// const A = [5,2,4,6,1,3];
const A = getRandomIntArray(10);

console.log('BEFORE SORTING', A);

for (let j = 1; j <= A.length - 1; j++) {
    let key = A[j]; // 2

    i = j - 1; // 0

    while (i >= 0 && A[i] > key) {
        A[i + 1] = A[i];
        i--;
    }

    A[i + 1] = key;
}

console.log('AFTER SORTING', A);

// ------------------------------------
// End of algorithm - code below isn't part of it
// ------------------------------------

function getRandomIntArray(size) {
    const result = [];
    while (result.length < size) {
        result.push(Math.trunc(Math.random() * 1000));
    }
    return result;
}