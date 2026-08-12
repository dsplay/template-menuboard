import { useContext } from 'react';
import { StylesContext } from '../../contexts/styles-context';

function PricesHead({
  titles,
  title,
}) {
  const prices = titles || [''];
  const priceAuxClassName = `price${Math.min(prices.length, 4)}`;

  const {
    priceTitlesColor,
  } = useContext(StylesContext);

  const priceCols = prices.map((price, i) => (
    <td
      // eslint-disable-next-line react/no-array-index-key
      key={`price_${i}`}
      rowSpan="2"
      className={`priceHeadItem ${i < prices.length - 1 ? 'rightBorder ' : ''}${priceAuxClassName}`}
      style={{
        color: priceTitlesColor,
        borderRightColor: priceTitlesColor,
      }}
    >
      {price}
    </td>
  ));

  return (
    <div className="priceHeadContainer">
      <div className="row">
        <table className="priceHead">
          <tbody>
            <tr>
              <td rowSpan="2" className="number" style={{ width: '2%', height: '100%' }}><span /></td>
              <td className="title" style={{ height: '100%', verticalAlign: 'middle' }}>
                &nbsp;
                {title}
              </td>
              {priceCols}
            </tr>
            <tr>
              <td className="desc" style={{ height: '0' }} />
            </tr>
          </tbody>
        </table>
      </div>
      <hr style={{ visibility: 'hidden' }} />
    </div>
  );
}

export default PricesHead;
