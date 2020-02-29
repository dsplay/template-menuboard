import React, { useContext } from 'react';
import { StylesContext } from './styles-context';

function SectionTitle({
    title,
    typed,
    width,
    usage,
}) {

    const {
        categoryColor,
        categoryBgColor,
    } = useContext(StylesContext);

    return (
        <div className={"row category" + (typed ? '-with-types ' : '') + (" category-" + (width))}>
            <div className="col-md-12">
                <div className="product-category">
                    <div className="contain-flag">
                        <div className="flag flag-l" style={{ color: categoryBgColor }}></div>
                        <div
                            className="flag item-title"
                            style={{ color: categoryColor, backgroundColor: categoryBgColor }}
                        >
                            {title + (usage ? (" (" + usage + ")") : "")}
                        </div>
                        <div className="flag flag-r" style={{ color: categoryBgColor }}></div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default SectionTitle;