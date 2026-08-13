import { createContext, useMemo } from 'react';
import { useTemplateVal, useTemplateFloatVal, useConfig } from '@dsplay/react-template-utils';
import { hexToRgb } from '../../utils/utils';
import DEFAULT_BG_IMAGE from '../../assets/images/menu-back-medium.jpg';

export const StylesContext = createContext(null);

export function useStyles() {
  const { osVersion } = useConfig();
  const webkit = osVersion < 19;

  const bgImage = useTemplateVal('backgroundImage', DEFAULT_BG_IMAGE);

  // styles
  const color1 = useTemplateVal('color1', 'darkred');
  const color2 = useTemplateVal('color2', '#000');
  const color3 = useTemplateVal('color3', '#FFF');
  const color4 = useTemplateVal('color4', '#FFCA08');

  const topBarColor = useTemplateVal('topBarColor', color1);
  const categoryBgColor = useTemplateVal('categoryBgColor', color1);
  const numberBgColor = useTemplateVal('numberBgColor', color1);
  const descColor = useTemplateVal('descColor', color1);
  const brandBoxBorderColor1 = useTemplateVal('brandBoxBorderColor1', color1);
  const priceTitlesColor = useTemplateVal('priceTitlesColor', color1);

  const titleColor = useTemplateVal('titleColor', color2);
  const priceColor = useTemplateVal('priceColor', color2);

  const separatorColor = useTemplateVal('separatorColor', color3);
  const brandBoxBorderColor2 = useTemplateVal('brandBoxBorderColor2', color3);

  const backgroundColor = useTemplateVal('backgroundColor', color4);
  const categoryColor = useTemplateVal('categoryColor', color4);
  const numberColor = useTemplateVal('numberColor', color4);
  const fontSize = '100%';

  const backgroundOpacity = useTemplateFloatVal('backgroundOpacity', 0.8);
  const bgOpacityThreshold = useTemplateVal('bgOpacityThreshold', '75%');

  return useMemo(() => {
    const rgb = hexToRgb(backgroundColor);
    const rgbString = rgb && `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${backgroundOpacity})`;

    let background;

    if (webkit) {
      background = `-webkit-linear-gradient( top, ${rgbString} ${bgOpacityThreshold}, transparent 120%)`;
    } else {
      background = `linear-gradient(to bottom, ${rgbString} ${bgOpacityThreshold}, transparent 100%)`;
    }

    const brandBoxBorder = `1px dashed ${brandBoxBorderColor1}`;
    const brandBoxBoxShadow = `0 0 0 0.15em ${brandBoxBorderColor2}, 0 0 0 0.3em ${brandBoxBorderColor1}, 0 0 0 0.6em ${brandBoxBorderColor2}, 0 0 0.15em 0.5em #eee`;
    const adBoxBoxShadow = `0 0 0.10em 0.2em ${brandBoxBorderColor2}`;

    return {
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
  }, [
    webkit,
    bgImage,
    backgroundColor,
    backgroundOpacity,
    bgOpacityThreshold,
    brandBoxBorderColor1,
    brandBoxBorderColor2,
    topBarColor,
    fontSize,
    categoryBgColor,
    numberBgColor,
    descColor,
    priceTitlesColor,
    titleColor,
    priceColor,
    separatorColor,
    categoryColor,
    numberColor,
  ]);
}
