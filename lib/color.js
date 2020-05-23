'use strict';

const parseColor = require('parse-color');

function bestContrastRatio(color1, color2, background) {
  return contrastRatio(color1, background) > contrastRatio(color2, background)
    ? color1
    : color2;
}

/**
 * Calculates the contrast ratio, as described on https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 *
 * @param {string} foreground the foreground color.
 * @param {string} background the background color, Defaults to #FFFFFF.
 * @returns {Number} the contrast ration.
 */
function contrastRatio(foreground, background = '#FFFFFF') {
  if (background.trim() === 'transparent') background = 'white';

  const bgLuminance = relativeLuminance(background);
  const fgLuminance = relativeLuminance(foreground);

  let darker;
  let lighter;
  if (fgLuminance > bgLuminance) {
    lighter = fgLuminance;
    darker = bgLuminance;
  } else {
    lighter = bgLuminance;
    darker = fgLuminance;
  }

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculates the relative luminance, as described on https://www.w3.org/TR/WCAG20/#relativeluminancedef
 *
 * @param {string} color the foreground color.
 * @returns {Number} the relative luminance.
 */
function relativeLuminance(color) {
  let colorRed;
  let colorGreen;
  let colorBlue;

  try {
    [colorRed, colorGreen, colorBlue] = parseColor(color.trim()).rgb;
  } catch (error) {
    throw new Error('Error parsing Color with parseColor' + error);
  }
  let red = componentRelativeLuminance_(colorRed);
  let green = componentRelativeLuminance_(colorGreen);
  let blue = componentRelativeLuminance_(colorBlue);

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

/**
 * Generates the luminance of a single color component.
 * @param {Number} component the value to have the luminance calculated
 * @returns {Number} the calculated luminance of the color component.
 */
function componentRelativeLuminance_(component) {
  let c = component / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

module.exports = {
  contrastRatio: contrastRatio,
  relativeLuminance: relativeLuminance,
  bestContrastRatio: bestContrastRatio,
};
