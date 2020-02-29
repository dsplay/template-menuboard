import React, { useContext } from 'react';
import { StylesContext } from './styles-context';

function PricesHead({
    titles,
    title,
}) {

    const prices = titles ? titles : [""];
    const priceAuxClassName = "price" + Math.min(prices.length, 4);
    const priceCols = [];

    const {
        priceTitlesColor,
    } = useContext(StylesContext);


    for (let i = 0; i < prices.length; i++) {
        priceCols.push(
            <td
                rowSpan="2"
                className={'priceHeadItem ' + (i < prices.length - 1 ? 'rightBorder ' : '') + priceAuxClassName}
                style={{
                    color: priceTitlesColor,
                    borderRightColor: priceTitlesColor,
                }}
            >
                {prices[i]}
            </td>
        );
    }

    return (
        <div className="priceHeadContainer">
            <div className="row">
                <table className="priceHead">
                    <tr>
                        <td rowSpan="2" className="number" style={{ width: "2%", height: "100%" }}><span></span></td>
                        <td className="title" style={{ "height": "100%", "vertical-align": "middle" }}>&nbsp;{title}</td>
                        {priceCols}
                    </tr>
                    <tr>
                        <td className="desc" style={{ height: "0" }}></td>
                    </tr>
                </table>
            </div>
            <hr style={{ "visibility": "hidden" }} />
        </div>
    );
}

export default PricesHead;