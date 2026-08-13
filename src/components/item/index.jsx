import { useContext } from 'react';
import { useTemplate } from '@dsplay/react-template-utils';
import { StylesContext } from '../../contexts/styles-context';

function Item({
  title,
  desc = '',
  price,
  last,
  num,
}) {
  const template = useTemplate();
  const prices = price;
  const priceAuxClassName = `price${Math.min(prices.length, 4)}`;
  const showCurrency = template.currencySymbol && (template.currencyMaxCols ? (template.currencyMaxCols >= prices.length) : true);
  const hasDesc = desc !== null && desc.trim() !== '';

  const {
    numberColor,
    numberBgColor,
    titleColor,
    priceColor,
    descColor,
    separatorColor,
  } = useContext(StylesContext);

  const priceCols = prices.map((price1, i) => (
    <td
      // eslint-disable-next-line react/no-array-index-key
      key={`col_${i}`}
      rowSpan="2"
      className={`price ${priceAuxClassName}`}
      style={{ color: priceColor }}
    >
      <span className="currency">{(showCurrency && price1 ? `${template.currencySymbol} ` : '')}</span>
      {price1}
    </td>
  ));

  return (
    <div className={(hasDesc ? 'product-with-desc' : 'product')}>
      <div className="row">
        <table className="tableItem">
          <tbody>
            <tr>
              <td rowSpan="2" className="number" style={{ width: num ? '11%' : '2%', height: '100%' }}>
                <span style={{
                  color: numberColor,
                  backgroundColor: numberBgColor,
                }}
                >
                  {num}
                </span>
              </td>
              <td
                className="title"
                style={{
                  height: hasDesc ? '60%' : '100%',
                  verticalAlign: hasDesc ? 'bottom' : 'middle',
                  color: titleColor,
                }}
              >
                {title}
              </td>
              {priceCols}
            </tr>
            <tr>
              <td
                className="desc"
                style={{
                  height: hasDesc ? '40%' : '0',
                  color: descColor,
                }}
              >
                {desc}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr style={{
        visibility: last ? 'hidden' : 'visible',
        borderColor: separatorColor,
      }}
      />
    </div>
  );
}

export default Item;
