const fs = require("fs");
const { files } = require("./constants");

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
    .split("\n");

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

const parsedPictures = parseFile(files.b);

parsedPictures.vertical.sort((a, b) => a.tags.length - b.tags.length);

const output = slides => {};

//   H V
// A 2     2
// B 80000 0
// C 500   500
// D 30000 60000
// E 0     80000
