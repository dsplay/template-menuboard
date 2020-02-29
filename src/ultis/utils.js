import { tbval, template } from '@dsplay/template-utils';

const DEBUG = tbval('debug');
const DEFAULT_IMAGE_SIZE = 6;

function log() {
    if (DEBUG) {
        for (let i = 0; i < arguments.length; i++) {
            console.log(arguments[i]);
        }
    }
}

export function getMaxItemsForColumn(column, options) {
    const { horizontal, showFooter, cols } = options;
    let items = 0;

    if (horizontal) {
        if (cols === 3) {
            items = (column % 2 === 0) ? 14 : 10;
            if (!showFooter) {
                items += 2;
            }
        } else if (cols === 2) {
            items = (column % 2 === 0) ? 6 : 10;
            if (!showFooter) {
                items += 2;
            }
        }
    } else {
        if (cols === 2) {
            items = (column % 2 === 0) ? 22 : 26;
            if (!showFooter) {
                items += 2;
            }
        } else if (cols === 1) {
            items = 16;
            if (!showFooter) {
                items += 2;
            }
        }
    }

    return items;
}

export function featuredImage(item) {
    return item.num && (item.num.indexOf("/fi") === 0 || item.num.indexOf("/li") === 0);
}

export function isLastContentItem(category, start) {
    let last = true;
    for (let j = start; j < category.items.length; j++) {
        const item = category.items[j];
        const isColumnBreak = item.num === "/cb";
        const isPageBreak = item.num === "/pb";
        const isFeaturedImage = featuredImage(item);
        const isSpacer = !isColumnBreak && !isPageBreak && !isFeaturedImage && (!item.title || item.num === "/n");

        if (!isColumnBreak && !isPageBreak && !isFeaturedImage && !isSpacer) {
            last = false;
            break;
        }
    }
    return last;
}

export function createPage(cols) {
    let page = [];
    for (let i = 0; i < cols; i++) {
        page.push([]);
    }
    return page;
}

export function parseFeaturedImage(text) {

    if (!text) return null;

    try {

        text = text.replace(/\s+/, '');
        const fiResult = /^\/fi\((\d+)(,(\d+))?\)$/i.exec(text);
        const liResult = /^\/li\((\d+)(,(\d+))?\)$/i.exec(text);

        if (!fiResult && !liResult) return null;

        const layoutImage = liResult != null;
        const result = layoutImage ? liResult : fiResult;

        const fi = { type: 'featuredImage', url: template['image' + result[1]], size: result[3] ? result[3] : DEFAULT_IMAGE_SIZE, layout: layoutImage };

        return fi;
    } catch (e) {
        log(e);
        return null;
    }
}

export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    const result2 = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : (result2 ? {
        r: parseInt(result2[1] + '' + result2[1], 16),
        g: parseInt(result2[2] + '' + result2[2], 16),
        b: parseInt(result2[3] + '' + result2[3], 16)
    } : null);
}

const categoryUsage = {};

function getCategoryUsageCount(cod) {

    if (categoryUsage[cod]) {
        categoryUsage[cod] = categoryUsage[cod] + 1;
    } else {
        categoryUsage[cod] = 1
    }

    log("Category " + cod + " was used " + categoryUsage[cod] + " time(s).");

    return categoryUsage[cod];
}


function enhanceItem(item, last, priceCount) {

    const prices = [];

    for (let i = 0; i < priceCount; i++) {
        prices.push(item['price' + (i + 1)]);
    }

    return { num: item.num, title: item.title, description: item.description, price: prices, last: last };
}

export function createPages(data, options) {
    const categories = data.categories;
    let colIdx = 0;
    let colSize = 0;
    let currentCategory = 0;
    const {
        showSectionPartials,
        cols,
    } = options;

    const pages = [];

    let page = createPage(cols);
    pages.push(page);

    for (let i = 0; i < categories.length; i++) {

        const category = categories[i];
        log("Category: " + category.title);

        const priceCount = category.priceTitles ? Math.max(category.priceTitles.length, 1) : 1;

        if (colSize <= getMaxItemsForColumn(colIdx, options) - 4) {

            currentCategory = { type: 'category', cod: category.cod, title: category.title, typed: priceCount > 1 };
            page[colIdx].push(currentCategory);
            log("Category Item created: " + currentCategory);

            if (priceCount > 1) {
                const cItem = { type: "pricesHead", titles: category.priceTitles };
                page[colIdx].push(cItem);
            }

            colSize += 2;

        } else {

            log("Category spacer created");
            if (page[colIdx].length > 0) {
                page[colIdx][page[colIdx].length - 1].last = true;
            }

            for (let j = 0; j < getMaxItemsForColumn(colIdx, options) - colSize; j++) {
                page[colIdx].push({ type: 'spacer' });
            }
            // next column
            colIdx = (colIdx + 1) % page.length;

            if (colIdx === 0) {
                page = createPage(cols);
                pages.push(page);
            }
            colSize = 0;
            currentCategory = { type: 'category', cod: category.cod, title: category.title, typed: priceCount > 1 };
            page[colIdx].push(currentCategory);
            log("Category Item created on nex column/page: " + currentCategory);

            if (priceCount > 1) {
                let cItem = { type: "pricesHead", titles: category.priceTitles };
                page[colIdx].push(cItem);
            }

            colSize += 2;
        }

        // handling items

        for (let j = 0; j < category.items.length; j++) {
            const item = category.items[j];
            const isColumnBreak = item.num === "/cb";
            const isPageBreak = item.num === "/pb";
            const isFeaturedImage = featuredImage(item);
            const isSpacer = !isColumnBreak && !isPageBreak && !isFeaturedImage && (!item.title || item.num === "/n");
            const fi = isFeaturedImage ? parseFeaturedImage(item.num) : null;

            let itemSize = 0;

            if (isSpacer) {
                itemSize = 1;
                log("item is spacer", item, "Size:", itemSize);
            } else if (isColumnBreak) {
                itemSize = getMaxItemsForColumn(colIdx, options) - colSize;
                log("item is column break", item, "Size:", itemSize);
            } else if (isPageBreak) {
                log("item is page break", item, "Size:", itemSize);
            } else if (isFeaturedImage) {
                const remainColSize = getMaxItemsForColumn(colIdx, options) - colSize;
                fi.size = remainColSize > 1 ? Math.min(fi.size, remainColSize) : fi.size;
                itemSize = fi ? fi.size : 0;
                log("item is featured image", item, fi, "Size:", itemSize);
            } else {
                itemSize = item.description ? 2 : 1;
                log("item is normal item", item, "Size:", itemSize);
            }

            // if remain column size fits the item...
            if ((getMaxItemsForColumn(colIdx, options) - colSize >= itemSize)
                // and item is not a page or column break...
                &&
                !isColumnBreak && !isPageBreak) {

                log("Item created in current column: " + item);

                if (isSpacer || isFeaturedImage) {
                    if (page[colIdx].length > 0) {
                        page[colIdx][page[colIdx].length - 1].last = true;
                    }
                }

                if (isSpacer) {
                    page[colIdx].push({ type: 'spacer' });
                } else if (isFeaturedImage && fi) {
                    page[colIdx].push(fi);
                } else {
                    page[colIdx].push(enhanceItem(item, j === category.items.length - 1, priceCount));
                }

                colSize += itemSize;
                log("current col size: " + colSize);

            } else {
                // if has previous item
                if (page[colIdx].length > 0) {
                    // set it as last (in column)
                    page[colIdx][page[colIdx].length - 1].last = true;
                }

                // next column
                colIdx = isPageBreak ? 0 : (colIdx + 1) % page.length;
                colSize = 0;

                if (colIdx === 0) {
                    const lastItem = isLastContentItem(category, j);
                    const repeatCategory = (!isColumnBreak && !isPageBreak) || !lastItem;

                    if (repeatCategory && showSectionPartials && !currentCategory.usage) {
                        log("changing current category: ", currentCategory);
                        currentCategory.usage = getCategoryUsageCount(category.cod);
                        log("changing current category: ", currentCategory);
                        log('category usage:', categoryUsage);
                    }

                    page = createPage(cols);
                    pages.push(page);
                    log("Category Item re-created after page finished");

                    if (repeatCategory) {
                        currentCategory = { type: 'category', cod: category.cod, title: category.title, usage: showSectionPartials ? getCategoryUsageCount(category.cod) : null, typed: priceCount > 1 };
                        page[colIdx].push(currentCategory);
                        log("current category: ", currentCategory);
                        log('category usage:', categoryUsage);

                        if (priceCount > 1) {
                            const cItem = { type: "pricesHead", titles: category.priceTitles };
                            page[colIdx].push(cItem);
                        }

                        colSize += 2;
                    }

                }

                if (isSpacer) {
                    log("Spacer created on next column/page: " + item);
                    page[colIdx].push({ type: 'spacer' });
                    colSize += itemSize;
                } else if (isColumnBreak || isPageBreak) {
                    colSize = 0;
                } else if (isFeaturedImage && fi) {
                    log("Freatured image created on next column/page: " + item);
                    if (page[colIdx].length > 0) {
                        page[colIdx][page[colIdx].length - 1].last = true;
                    }
                    page[colIdx].push(fi);
                    colSize += itemSize;
                } else {
                    log("Item created on next column/page: " + item);
                    page[colIdx].push(enhanceItem(item, j === category.items.length - 1, priceCount));
                    colSize += itemSize;
                }

                log("current col size: " + colSize);

            }

        }

    }

    return pages;
}