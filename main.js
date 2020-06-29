const puppeteer = require("puppeteer");
const fs = require("fs");
const base = "https://www.dictionary.cambridge.org";

// const str = "Hello my name is mark";
// const [...letters] = str;
// const x = letters.join("");
// console.log(x.split(' '));


let x = [];

const words = fs.readFileSync('./words.txt', "utf-8");
    for (const letter of words) {
        if (letter === "\n") {
            x.push(',');
        } else if (letter === " ") x.push("_")
        else x.push(letter);
    };

const [str] = x.join("").split(" ");
const wordList = str.split(',');

// console.log(wordList);

let finalList = [];

for (const word of wordList) {
    const num = word.length - 1;

    if (word.includes("_")) {
        if (word[word.length - 1] === "_") {
            finalWord = word.slice(0, num);
        } else finalWord = word.replace(/_/g, " ");
    } else finalWord = word;
    finalList.push(finalWord);
    fs.appendFile("msg.txt", finalWord + "\n", err => err)
}

console.log(finalList);
// fs.writeFileSync("mayores.txt", finalList)


// (async () => {
//     const browser = await puppeteer.launch({
//         // headless: false,
//         slowMo: 20,
//     });

//     const page = await browser.newPage();
//     await page.setViewport({ width: 600, height: 1080 });
    
//     await page.goto(`${base}`);  
// })();
