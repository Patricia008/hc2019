const union = (a, b) => new Set([...a, ...b]);
const intersection = (a, b) => new Set([...a].filter(x => b.has(x)));
const difference = (a, b) => new Set([...a].filter(x => !b.has(x)));

const score = (current, next) => {
  const same = intersection(current.tags, next.tags);
  const differenceA = difference(current.tags, next.tags);
  const differenceB = difference(next.tags, current.tags);
  return Math.min(same.size, differenceA.size, differenceB.size);
};

const getTags = slide => {
  if (slide.hasOwnProperty("H")) {
    return { tags: slide["H"].tags };
  } else if (slide.hasOwnProperty("V")) {
    return { tags: union(slide["V"][0].tags, slide["V"][1].tags) };
  }
};

const scoreSlides = slides => {
  let total = 0;
  for (let i = 0; i < slides.length - 1; i++) {
    const [a, b] = [slides[i], slides[i + 1]];

    total += score(getTags(a), getTags(b));
  }

  return total;
};

module.exports = {
  score,
  union,
  scoreSlides
};
