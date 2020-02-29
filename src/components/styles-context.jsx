import { tval, tfval, config } from '@dsplay/template-utils';
import { hexToRgb } from '../ultis/utils';
import DEFAULT_BG_IMAGE from '../assets/images/menu-back-medium.jpg';
import { createContext } from 'react';

const webkit = config.osVersion < 19;

const bgImage = tval('backgroundImage', DEFAULT_BG_IMAGE);


// styles
const color1 = tval('color1', 'darkred');
const color2 = tval('color2', '#000');
const color3 = tval('color3', '#FFF');
const color4 = tval('color4', '#FFCA08');

const topBarColor = tval('topBarColor', color1);
const categoryBgColor = tval('categoryBgColor', color1);
const numberBgColor = tval('numberBgColor', color1);
const descColor = tval('descColor', color1);
const brandBoxBorderColor1 = tval('brandBoxBorderColor1', color1);
const priceTitlesColor = tval('priceTitlesColor', color1);

const titleColor = tval('titleColor', color2);
const priceColor = tval('priceColor', color2);

const separatorColor = tval('separatorColor', color3);
const brandBoxBorderColor2 = tval('brandBoxBorderColor2', color3);

const backgroundColor = tval('backgroundColor', color4);
const categoryColor = tval('categoryColor', color4);
const numberColor = tval('numberColor', color4);
let fontSize = '100%';

const backgroundOpacity = tfval('backgroundOpacity', .8);
const bgOpacityThreshold = tval('bgOpacityThreshold', '75%')

const rgb = hexToRgb(backgroundColor);
const rgbString = "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + backgroundOpacity + ")";

let background;

if (webkit) {
    background = `-webkit-linear-gradient( top, ${rgbString} ${bgOpacityThreshold}, transparent 120%)`;
} else {
    background = `linear-gradient(to bottom, ${rgbString} ${bgOpacityThreshold}, transparent 100%)`;
}

const brandBoxBorder = `1px dashed ${brandBoxBorderColor1}`;
const brandBoxBoxShadow = `0 0 0 0.15em ${brandBoxBorderColor2}, 0 0 0 0.3em ${brandBoxBorderColor1}, 0 0 0 0.6em ${brandBoxBorderColor2}, 0 0 0.15em 0.5em #eee`;
const adBoxBoxShadow = `0 0 0.10em 0.2em ${brandBoxBorderColor2}`;

export const styles = {
    brandBoxBorder,
    brandBoxBoxShadow,
    adBoxBoxShadow,
    topBarColor,
    fontSize,
    categoryBgColor,
    numberBgColor,
    descColor,
    brandBoxBorderColor1,
    brandBoxBorderColor2,
    priceTitlesColor,
    titleColor,
    priceColor,
    separatorColor,
    background,
    bgImage,
    categoryColor,
    numberColor,
};

export const StylesContext = createContext(styles);
