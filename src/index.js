const fs = require('fs');
const { files } = require('./constants');
const { buildGreedy } = require('./alg/greedy');

const union = (a, b) => new Set([...a, ...b]);
const intersection = (a, b) => new Set([...a].filter(x => b.has(x)));
const difference = (a, b) => new Set([...a].filter(x => !b.has(x)));

const score = (current, next) => {
  const same = intersection(current.tags, next.tags);
  const differenceA = difference(current.tags, next.tags);
  const differenceB = difference(next.tags, current.tags);

  return Math.min(same, differenceA, differenceB);
};

const parseFile = filename => {
  const fileContent = fs
    .readFileSync(filename)
    .toString()
    .split('\n');

  return fileContent
    .map((pictureStr, slideIndex) => parsePicture(slideIndex, pictureStr))
    .reduce(
      (agg, currentPicture) => {
        if (currentPicture.type === 'H') {
          agg.horizontal.push(currentPicture);
        } else if (currentPicture.type === 'V') {
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

const parsedPictures = parseFile(files.c);

parsedPictures.vertical.sort((a, b) => a.tags.size - b.tags.size);

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

print("data/output.txt", [{ H: { id: 1 } }, { V: [{ id: 2 }, { id: 3 }] }]);

//   H V
// A 2     2
// B 80000 0
// C 500   500
// D 30000 60000
// E 0     80000
buildGreedy(parsedPictures);
