const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


rl.on("close", () => {
    console.log("\nFinished");
    process.exit(0);
});

// ------------------------------------
// Start of algorithm - only code below belongs to the algorithm
// ------------------------------------

(async () => {

    // const A = [5,2,4,6,1,3];
    const A = getRandomIntArray(10);
    // const A = [1,2,3,10,9,8,7,5,5,6,3,2,1];

    console.log('BEFORE SORTING', A);

    for (let j = 1; j <= A.length - 1; j++) {
        let key = A[j]; // 2

        i = j - 1; // 0

        console.log('key:', key, ' | i:', i, `(${A[i]})`);
        await breakpoint();

        while (i >= 0 && A[i] > key) {
            console.log('start while | ', 'A:', A);
            await breakpoint();
            A[i + 1] = A[i];
            console.log('end while | ', `j = ${j} | i = ${A[i + 1]} | A = ${A}`);
            i--;
            await breakpoint();
        }


        A[i + 1] = key;
        console.log('while finished | ', `key=${key} | A=${A}`);
        await breakpoint();
    }

    console.log('AFTER SORTING', A);
})();


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

function breakpoint() {
    return new Promise((resolve) => {
        rl.question("Pressione enter para continuar...", () => {
            resolve();
        });
    });
}