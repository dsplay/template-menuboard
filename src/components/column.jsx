import React from 'react';
import SectionTitle from './section-title';
import Spacer from './spacer';
import PricesHead from './prices-head';
import FeaturedImage from './featured-image';
import Item from './item';

function Column({
    id,
    width,
    items = [],
}) {
    let i = 0;

    return (
        <div className="fade-in">
            {
                items.map(({
                    type,
                    title,
                    usage,
                    typed,
                    titles,
                    url,
                    layout,
                    num,
                    description,
                    price,
                    size,
                    last,
                }) => {
                    let result = null;

                    switch (type) {
                        case 'category':
                            result = <SectionTitle key={id + "_" + i++} width={width} title={title} usage={usage} typed={typed} />
                            break;
                        case 'spacer':
                            result = <Spacer key={id + "_" + i++} />
                            break;
                        case 'pricesHead':
                            result = <PricesHead key={id + "_" + i++} title={title} titles={titles} />
                            break;
                        case 'featuredImage':
                            result = <FeaturedImage key={id + "_" + i++} size={size} url={url} layout={layout} />
                            break;
                        default:
                            result = <Item key={id + "_" + i++} num={num} title={title} desc={description} price={price} last={last} />;
                    }

                    return result;
                })
            }
        </div>
    );
}

export default Column;