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
    .map((slideStr, slideIndex) => parseSlide(slideIndex, slideStr))
    .reduce(
      (agg, currentSlide) => {
        if (currentSlide.type === "H") {
          agg.horizontal.push(currentSlide);
        } else if (currentSlide.type === "V") {
          agg.vertical.push(currentSlide);
        }
        return agg;
      },
      { horizontal: [], vertical: [] }
    );
};

const parseSlide = (slideId, slideStr) => {
  const [type, _, ...tags] = slideStr.split(/\s+/);
  return { type, id: slideId, tags: new Set(tags) };
};

const parsedSlides = parseFile(files.d);

console.log(parsedSlides);
