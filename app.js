window.addEventListener("load", start);

const ENDPOINT = "http://localhost:8080/ordbogen";

async function start() {
    console.log("Loading dictionary data from .csv file...");
    document.querySelector("#knap").addEventListener("click", handleClick);
}

async function getSizes() {
    const res = await fetch(ENDPOINT).then((r) => r.json());
    return res;
}

async function getEntryAt(index) {
    const res = await fetch(`${ENDPOINT}/${index}`).then((r) => r.json());
    return res;
}

async function handleClick() {
    const search = document.querySelector("#search").value;
    const startTime = performance.now();
    await binarySearch(search);
    const endTime = performance.now();
    const timeTaken = (endTime - startTime) / 1000;
    document.querySelector("#tid").textContent = timeTaken;
}

async function binarySearch(searchTerm) {
    const sizes = await getSizes();
    let low = sizes.min;
    let high = sizes.max;
    let middle;
    let searches = 0;

    while (high >= low) {
        middle = low + Math.floor((high - low) / 2);
        let entry = await getEntryAt(middle);
        searches++;
        document.querySelector("#requests").textContent = searches;

        const comp = searchTerm.localeCompare(entry.inflected);
        console.log(`Entry: ${entry.inflected}, Comp: ${comp}, low: ${low}, high: ${high}, middle: ${middle}`);

        if (comp === 0) {
            displayResult(entry);
            return middle;
        }

        if (comp < 0) {
            high = middle - 1;
        } else {
            low = middle + 1;
        }
    }
    document.querySelector("#result").innerHTML = "<h2>Ordet blev ikke fundet!</h2>";
    return -1;
}

function displayResult(word) {
    const resultDiv = document.querySelector("#result");
    resultDiv.innerHTML = `
        <h2>Fundet!</h2>
        <p>bøjningsform: ${word.inflected}</p>
        <p>opslagsord: ${word.headword}</p>
        <p>homograf nr: ${word.homograph}</p>
        <p>ordklasse: ${word.partofspeech}</p>
        <p>id: ${word.id}</p>

    `;
}
