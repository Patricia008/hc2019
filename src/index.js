const fs = require('fs');
const { files } = require('./constants');

const parseFile = filename => {
  const fileContent = fs
    .readFileSync(filename)
    .toString()
    .split('\n');

  const size = parseInt(fileContent.shift());
  return fileContent
    .map((slideStr, slideIndex) => parseSlide(slideIndex, slideStr))
    .reduce(
      (agg, currentSlide) => {
        if (currentSlide.type === 'H') {
          agg.horizontal.push(currentSlide);
        } else if (currentSlide.type === 'V') {
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
