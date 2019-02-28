const fs = require("fs");
const { files } = require("./constants");
const { inline } = require("./alg/inline");
const { shuffle } = require("lodash");
const { scoreSlides } = require("./alg/score");

const parseFile = filename => {
  const fileContent = fs
    .readFileSync(filename)
    .toString()
    .split("\n");

  fileContent.shift();
  return fileContent
    .map((pictureStr, slideIndex) => parsePicture(slideIndex, pictureStr))
    .reduce(
      (agg, currentPicture) => {
        if (currentPicture.type === "H") {
          agg.horizontal.push(currentPicture);
        } else if (currentPicture.type === "V") {
          agg.vertical.push(currentPicture);
        }
        return agg;
      },
      { horizontal: [], vertical: [] }
    );
};

const parsePicture = (slideId, slideStr) => {
  const [type, _, ...tags] = slideStr.split(/\s+/);
  return { type, id: slideId, tags: new Set(tags) };
};

const print = (filename, slides) => {
  let output = `${slides.length}\n`;
  slides.forEach(slide => {
    if (slide.hasOwnProperty("H")) {
      output += slide["H"].id + "\n";
    } else if (slide.hasOwnProperty("V")) {
      output += slide["V"].map(image => image.id).join(" ") + "\n";
    }
  });

  fs.writeFileSync(filename, output, { flag: "w" });
};

let maxScores = {};
while (true) {
  Object.keys(files).forEach(file => {
    let batch = Date.now();
    let parsed = parseFile(files[file]);
    let { horizontal, vertical } = parsed;
    parsed = { horizontal: shuffle(horizontal), vertical: shuffle(vertical) };
    let result = inline(parsed);
    score = scoreSlides(result);

    maxScores[file] = maxScores[file] || score;
    if (maxScores[file] < score) {
      maxScores[file] = score;
      console.log("", maxScores);
      print(`data/output${file}-${batch}-${score}.txt`, result);
    }
  });
}

//   H V
// A 2     2
// B 80000 0
// C 500   500
// D 30000 60000
// E 0     80000
