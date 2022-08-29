// const __A = [5,2,4,7];
// const __A = [5,2,4,7,1,3,2,6];
const __A = getRandomIntArray(10);

function bubbleSort(A) {
    const result = Array.from(A);
    for (let i = 0; i <= A.length; i++) {
        for (let j = result.length; j >= i; j--) {
            if (result[j] < result[j - 1]) {
                const temp = result[j];
                result[j] = result[j - 1];
                result[j - 1] = temp;
            }
        }
    }

    return result;
}


console.log('BEFORE SORT\n', __A, '\n\nAFTER SORT\n', bubbleSort(__A));

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