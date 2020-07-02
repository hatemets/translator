const puppeteer = require("puppeteer");
const fs = require("fs");
const base =
	"https://translate.google.com/?js=y&prev=_t&hl=en&ie=UTF-8&text=&file=&sl=et&tl=de#view=home&op=translate&sl=en&tl=et";

let x = [];

const words = fs.readFileSync("./words.txt", "utf-8");
for (const letter of words) {
	if (letter === "\n") {
		x.push(",");
	} else if (letter === " ") x.push("_");
	else x.push(letter);
}

const [str] = x.join("").split(" ");
const wordList = str.split(",");

let finalList = [];

(async () => {
	const browser = await puppeteer.launch({
		headless: false,
		slowMo: 20
	});

	const page = await browser.newPage();
	await page.setViewport({ width: 600, height: 1080 });

	await page.goto(base);

	for (const word of wordList) {
		const num = word.length - 1;

		if (word.includes("_")) {
			if (word[word.length - 1] === "_") {
				finalWord = word.slice(0, num);
			} else finalWord = word.replace(/_/g, " ");
		} else finalWord = word;

		await page.type("#source", finalWord);

		let translated = false;

		while (!translated) {
			console.log("Waiting for translation...");
			await page.waitFor(300);
			translated = await page.$(".tlid-translation span");
		}

		const translation = await page.evaluate(_ => {
			const et = document.querySelector(".tlid-translation span").textContent;
			document.querySelector("#source").value = "";
			return et;
		});

		console.log(finalWord, translation);
		const wordPair = `${finalWord} - ${translation}\n`;

		finalList.push(wordPair);
		fs.appendFile("finalList.txt", wordPair, err => err);
	}

	console.log("All words translated");

	await browser.close();
})();
