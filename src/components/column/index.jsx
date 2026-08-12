import SectionTitle from '../section-title';
import Spacer from '../spacer';
import PricesHead from '../prices-head';
import FeaturedImage from '../featured-image';
import Item from '../item';

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
          i += 1;
          const key = `${id}_${i}`;

          switch (type) {
            case 'category':
              return <SectionTitle key={key} width={width} title={title} usage={usage} typed={typed} />;
            case 'spacer':
              return <Spacer key={key} />;
            case 'pricesHead':
              return <PricesHead key={key} title={title} titles={titles} />;
            case 'featuredImage':
              return <FeaturedImage key={key} size={size} url={url} layout={layout} />;
            default:
              return <Item key={key} num={num} title={title} desc={description} price={price} last={last} />;
          }
        })
      }
    </div>
  );
}

export default Column;
