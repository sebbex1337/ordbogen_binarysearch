import express from "express";
import fs from "fs";
import readline from "readline";
import cors from "cors";
import { once } from "events";

const PORT = 8080;
const PATH = "ordbogen";

const globalArrayOfWords = [];

const app = express();

app.use(express.json());
app.use(cors());

app.listen(PORT, async () => {
  console.log("Loading dictionary data from .csv file...");

  try {
    // read every line of the inputfile
    const rl = readline.createInterface({
      input: fs.createReadStream("data/ddo_fullforms.csv"),
      crlfDelay: Infinity,
    });

    rl.on("line", (line) => {
      // Process the line, and add entry to global array of words
      globalArrayOfWords.push(splitLineIntoEntry(line));
    });

    // wait until all lines are read
    await once(rl, "close");

    console.log(`Dictionary loaded. ${globalArrayOfWords.length} entries read.`);
    // sort entries by 'inflected' rather than 'headword'
    globalArrayOfWords.sort((a, b) => a.inflected.localeCompare(b.inflected));
    console.log("Dictionary data sorted according to inflected form.");

    console.log(`Server is running on port 8080 - endpoint is http://localhost:${PORT}/${PATH}`);

  } catch (error) {
    if(error.code === 'ENOENT') {
      console.error("File 'data/ddo_fullforms.csv' does not exist - did you remember to download and rename datafile?");
    }
    console.error("Full error message:", error);
  }
});

function splitLineIntoEntry(line) {
  const parts = line.split("\t");
  return {
    inflected: parts[0],
    headword: parts[1],
    homograph: parts[2],
    partofspeech: parts[3],
    id: parts[4],
  };
}

app.get(`/${PATH}`, (req, res) => {
  res.send({
    min: 0,
    max: globalArrayOfWords.length - 1,
  });
});

app.get(`/${PATH}/:id`, (req, res) => {
  const id = req.params.id;
  const word = globalArrayOfWords[id];
  if (word) {
    // delay a bit before responding
    setTimeout(()=>{
      res.send(word);
    }, 100);
  } else {
    res.status(404).send({ error: "Word not found." });
  }
});