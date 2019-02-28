const inline = parsedPictures => {
  const slides = [];
  const horizontal = parsedPictures.horizontal;
  const vertical = parsedPictures.vertical;
  while (horizontal.length) {
    slides.push({ H: horizontal.shift() });
  }

  while (vertical.length >= 2) {
    slides.push({ V: [vertical.shift(), vertical.shift()] });
  }

  return slides;
};

module.exports = {
  inline
};
