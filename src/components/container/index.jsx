import { useState, useMemo } from 'react';
import {
  useTemplateVal, useTemplateBoolVal, useTemplateIntVal, useConfig, useMedia, useTemplate,
} from '@dsplay/react-template-utils';
import MenuBoard from '../menu-board';
import { createPages } from '../../utils/utils';
import { useInterval } from '../../hooks/use-interval';
import { useStyles, StylesContext } from '../../contexts/styles-context';

function Container() {
  const {
    result: {
      data,
    },
    duration,
  } = useMedia();
  const template = useTemplate();
  const { orientation } = useConfig();
  const isVertical = orientation === 'portrait';

  const showSectionPartials = useTemplateBoolVal('showPartials', true);
  const showFooter = useTemplateBoolVal('footer', true);
  const debug = useTemplateBoolVal('debug');
  const screenSize = useTemplateVal('screenSize', 'large');
  const loopCount = useTemplateIntVal('loopCount', 1);

  const horizontal = !isVertical;
  const horizontalCols = screenSize === 'large' ? 3 : 2;
  const verticalCols = screenSize === 'large' ? 2 : 1;
  const cols = horizontal ? horizontalCols : verticalCols;

  const options = useMemo(() => ({
    showSectionPartials,
    showFooter,
    horizontal,
    cols,
    debug,
    template,
  }), [showSectionPartials, showFooter, horizontal, cols, debug, template]);

  const pages = useMemo(() => createPages(data, options), [data, options]);

  let pageDuration = duration;
  if (pages.length > 1) {
    pageDuration = Math.floor(duration / (pages.length * loopCount));
  }

  const styles = useStyles();

  const pseudoBodyStyles = {
    backgroundImage: `url('${styles.bgImage}')`,
  };

  const containerStyles = {
    borderTop: `1em solid ${styles.topBarColor}`,
    background: styles.background,
    fontSize: styles.fontSize,
  };

  const [currentPage, setCurrentPage] = useState(0);
  useInterval(() => {
    setCurrentPage((currentPage + 1) % pages.length);
  }, pageDuration);

  return (
    <div style={pseudoBodyStyles} className="pseudo-body">
      <div style={containerStyles} className="main-container">
        <StylesContext.Provider value={styles}>
          <MenuBoard
            pages={pages}
            index={currentPage}
            cols={cols}
          />
        </StylesContext.Provider>
      </div>
    </div>
  );
}

export default Container;
