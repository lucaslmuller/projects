// https://medium.com/karuna-sehgal/a-simplified-explanation-of-merge-sort-77089fe03bb2

// const __A = [5,2,4,7];
// const A = [5,2,4,7,1,3,2,6];
const __A = getRandomIntArray(10);

// Split the array into halves and merge them recursively
function mergeSort(A) {
    if (A.length === 1) { return A; }

    // Get the middle item of the array rounded down by creating a variable
    const middle = Math.floor(A.length / 2)
    // Create a variable for the items on the left side
    const left = A.slice(0, middle)
    // Create a variable for the items on the right side
    const right = A.slice(middle)

    return merge(mergeSort(left), mergeSort(right));
}

// Compare the arrays item by item and return the concatenated result
function merge(L, R) {
    let result = []
    let LIndex = 0
    let RIndex = 0

    while (LIndex < L.length && RIndex < R.length) {
        if (L[LIndex] < R[RIndex]) {
            result.push(L[LIndex])
            LIndex++
        } else {
            result.push(R[RIndex])
            RIndex++
        }
    }

    return result.concat(L.slice(LIndex)).concat(R.slice(RIndex));
}

console.log('BEFORE SORT\n', __A, '\n\nAFTER SORT\n', mergeSort(__A));

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