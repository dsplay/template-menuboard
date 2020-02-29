import React, { useState } from 'react';
import { tval, tbval, tival, isVertical, media } from '@dsplay/template-utils';
import MenuBoard from './menu-board';
import { createPages } from '../ultis/utils';
import { useInterval } from '../ultis/use-interval';
import { styles, StylesContext } from './styles-context';


const {
    result: {
        data,
    },
    duration,
} = media;

const showSectionPartials = tbval('showPartials', true);
const showFooter = tbval('footer', true);

const horizontal = !isVertical;
const screenSize = tval('screenSize', 'large');
const horizontalCols = screenSize === 'large' ? 3 : 2;
const verticalCols = screenSize === 'large' ? 2 : 1;

const cols = horizontal ? horizontalCols : verticalCols;

const options = {
    showSectionPartials,
    showFooter,
    horizontal,
    cols,
}

const pages = createPages(data, options);
let pageDuration = duration;

if (pages.length > 1) {
    const loopCount = tival('loopCount', 1);
    pageDuration = Math.floor(duration / (pages.length * loopCount));
}

const pseudoBodyStyles = {
    backgroundImage: `url('${styles.bgImage}')`,
};

const containerStyles = {
    borderTop: `1em solid ${styles.topBarColor}`,
    background: styles.background,
    fontSize: styles.fontSize,
};

function Container() {

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