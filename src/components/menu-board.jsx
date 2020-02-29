import React, { useMemo, useContext } from 'react';
import Column from './column';
import { template } from '@dsplay/template-utils';
import { StylesContext } from './styles-context';


function MenuBoard({
    featured,
    pages,
    cols = 3,
    index = 0,
}) {

    const {
        brandBoxBorder,
        brandBoxBoxShadow,
    } = useContext(StylesContext);

    const page = useMemo(() => {
        return pages[index];
    }, [pages, index]);

    const { logo } = template;
    const colCount = cols;

    const bgUrl = featured ? ("url('" + featured + "')") : "none";
    const colWidth = (12 / colCount);
    const colClass = 'col-md-' + colWidth;
    let idx = 0;

    let col1 = null, col2 = null, col3 = null;

    if (colCount === 3) {
        col1 = (
            <div className={colClass}>
                <Column key={index} id={index + "_1"} width={colWidth} items={page[idx++]} />
            </div>
        );
    }

    col2 = (
        <div className={colClass}>

            <div className="row brand-container">
                <div
                    className="jumbotron brand-box"
                    style={{
                        backgroundImage: "url('" + logo + "')",
                        boxShadow: brandBoxBoxShadow,
                        border: brandBoxBorder,
                    }}
                />
            </div>

            <Column key={index} id={index + "_2"} width={colWidth} items={page[idx++]} />

            <div className="row" style={{ "display": featured ? "inherit" : "none" }}>
                <div className="col-md-12">
                    <div className="ad-box" style={{ backgroundImage: bgUrl }} />
                </div>
            </div>

        </div>
    );

    if (colCount > 1) {
        col3 = (
            <div className={colClass}>
                <Column key={index} id={index + "_3"} width={colWidth} items={page[idx++]} />
            </div>
        );
    }

    if (colCount === 3) {
        cols = (
            <div className="row">
                {col1}
                {col2}
                {col3}
            </div>
        )
    } else if (colCount === 2) {
        cols = (
            <div className="row">
                {col2}
                {col3}
            </div>
        )
    } else if (colCount === 1) {
        cols = (
            <div className="row">
                {col2}
            </div>
        )
    }

    return (
        <div className="container fade-in">
            {cols}
        </div>
    );

}

export default MenuBoard;