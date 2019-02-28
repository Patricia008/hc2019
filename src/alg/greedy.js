const { score, union } = require('./score');
const { maxBy } = require('lodash');

const buildGreedy = parsedPictures => {
  const solution = [buildSolutionEntry(parsedPictures.horizontal.shift())];

  console.log(findBestNextStep(unpackSolutionEntry(solution[0]), parsedPictures));
};

const findBestNextStep = (currentPicture, pictures) => {
  console.log(currentPicture, pictures)
  const { horizontal, vertical } = pictures;
  const horizontalMax = computeMaxHorizontalSlide(currentPicture, horizontal);
  const verticalMax = computeMaxVerticalSlide(currentPicture, vertical);

  return [horizontalMax, verticalMax]; //picture
};

const computeMaxHorizontalSlide = (currentPicture, horizontal) => {
  console.log(currentPicture, horizontal)
  return horizontal.reduce(
    (agg, current) => {
      const newScore = score(currentPicture, { tags: new Set([...current.tags, ...currentPicture.tags]) });
      if (newScore > agg.maxScore) {
        return { maxScore: newScore, maxSlide: [current, currentPicture] };
      }
      return agg;
    },
    { maxSlide: {}, maxScore: 0 }
  );
};

const computeMaxVerticalSlide = (currentPicture, vertical) => {
  console.log(currentPicture, vertical)

  // iterate all combinations of verticals and find best combo
  let maxScore = 0;
  let maxSlide = [];
  vertical.forEach(v1 => {
    vertical.forEach(v2 => {
      if (v1.id !== v2.id) {
        const newScore = score(currentPicture, { tags: new Set([...v1.tags, ...v2.tags]) });
        if (newScore > maxScore) {
          maxScore = newScore;
          maxSlide = [v1, v2];
        }
      }
    });
  });
  return { maxSlide, maxScore };
};

const unpackSolutionEntry = solutionEntry => {
  const x = solutionEntry.h || union(solutionEntry.v[0].tags, solutionEntry.v[1].tags);
  console.log(x)
  return x;
};

const buildSolutionEntry = parsedPicture => {
  if (parsedPicture.type === 'H') {
    return { h: parsedPicture };
  } else {
    return { v: parsedPicture };
  }
};

module.exports = {
  buildGreedy
};
