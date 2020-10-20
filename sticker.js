// https://marmelab.com/blog/2018/02/20/convert-image-to-ascii-art-masterpiece.html
// required: scale down and crop the image to constant dimensions

const toGrayScale = (r, g, b) => 0.21 * r + 0.72 * g + 0.07 * b;

const convertToGrayScales = (context, width, height) => {

  const imageData = context.getImageData(0, 0, width, height);

  const grayScales = [];

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];

    const grayScale = toGrayScale(r, g, b);
    imageData.data[i] = imageData.data[i + 1] = imageData.data[
      i + 2
    ] = grayScale;

    grayScales.push(grayScale);
  }

  context.putImageData(imageData, 0, 0);

  return grayScales;

};

const grayRamp = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,\"^`'. ";
const rampLength = grayRamp.length;

// the grayScale value is an integer ranging from 0 (black) to 255 (white)
const getCharacterForGrayScale = grayScale => grayRamp[Math.ceil(((rampLength - 1) * grayScale) / 255)];

const asciiImage = document.querySelector("pre#ascii");

const drawAscii = grayScales => {
  const ascii = grayScales.reduce((asciiImage, grayScale) => {
    return asciiImage + getCharacterForGrayScale(grayScale);
  }, "");

  asciiImage.textContent = ascii;
};
