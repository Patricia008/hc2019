const { score, union } = require('./score');
const { maxBy } = require('lodash');

const buildGreedy = parsedPictures => {

  const solution = [buildSolutionEntry(parsedPictures.horizontal.shift() || [parsedPictures.vertical.shift(), parsedPictures.vertical.shift()])];

  const N = parsedPictures.vertical.length / 2 + parsedPictures.horizontal.length

  let horizontalMax = {}
  let verticalMax = {}

  for(let i = 0; i < N-1; i++) {
    [horizontalMax1, verticalMax1] = findBestNextStep(unpackSolutionEntry(solution[solution.length-1]), parsedPictures);
    if(horizontalMax.maxSlide === horizontalMax1 || verticalMax.maxSlide === verticalMax1) {
      return solution
    }
    horizontalMax = horizontalMax1
    verticalMax = verticalMax1
    if(horizontalMax.maxScore > verticalMax.maxScore) {
     // console.log(JSON.stringify(horizontalMax))
      solution.push(buildSolutionEntry(horizontalMax.maxSlide))
      // parsedPictures.delete(parsedPictures.filter(e => e.id === horizontalMax.id))
      parsedPictures.horizontal = parsedPictures.horizontal.filter(x => x.id != horizontalMax.maxSlide.id)
      // .splice(parsedPictures.horizontal.indexOf(horizontalMax.maxSlide), 1)
    } else {
      solution.push(buildSolutionEntry(verticalMax.maxSlide))
      // parsedPictures.vertical.splice(parsedPictures.vertical.indexOf(verticalMax.maxSlide[0]), 1)
      parsedPictures.vertical = parsedPictures.vertical.filter(x => (x.id != verticalMax.maxSlide[0].id && x.id != verticalMax.maxSlide[1].id))
      // parsedPictures.vertical.splice(parsedPictures.vertical.indexOf(verticalMax.maxSlide[1]), 1)
    }
  }
  return solution
};

const findBestNextStep = (currentPicture, pictures) => {
  const { horizontal, vertical } = pictures;
  const horizontalMax = computeMaxHorizontalSlide(currentPicture, horizontal);
  const verticalMax = computeMaxVerticalSlide(currentPicture, vertical);

  return [horizontalMax, verticalMax]; //picture
};

const computeMaxHorizontalSlide = (currentPicture, horizontal) => {
  return horizontal.reduce(
    (agg, possibleNextSlide) => {
      const newScore = score(currentPicture, possibleNextSlide);
      if (newScore > agg.maxScore) {
        return { maxScore: newScore, maxSlide: possibleNextSlide };
      }
      return agg;
    },
    { maxSlide: currentPicture, maxScore: 0 }
  );
};

const computeMaxVerticalSlide = (currentPicture, vertical) => {
  // iterate all combinations of verticals and find best combo
  let maxScore = -1;
  let maxSlide = [vertical[0], vertical[1]];

  for(let i = 0; i < vertical.length - 1; i++) {
    for(let j = i; j < vertical.length; j++) {
      if (vertical[i].id !== vertical[j].id) {
        const newScore = score(currentPicture, { tags: new Set([...vertical[i].tags, ...vertical[j].tags]) });
        if (newScore > maxScore) {
          maxScore = newScore;
          maxSlide = [vertical[i], vertical[j]];
        }
      }
    }
  }
  []
  return { maxSlide, maxScore };
};

const unpackSolutionEntry = solutionEntry => {
  const x = solutionEntry.H || { tags: union(solutionEntry.V[0].tags, solutionEntry.V[1].tags)};
  return x;
};

const buildSolutionEntry = parsedPicture => {
  if (parsedPicture.type === 'H') {
    return { H: parsedPicture };
  } else if (Array.isArray(parsedPicture)) {
    return { V: parsedPicture };
  }
};

module.exports = {
  buildGreedy
};
