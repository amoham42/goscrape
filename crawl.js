const { JSDOM } = require('jsdom');

function URLtoHTML(body, url) {
    const urls = [];
    const dom = new JSDOM(body);
    const links = dom.window.document.querySelectorAll('a');
    for (const link of links) {
        if(link.href.slice(0, 1) === '/') {
            try {
                const urlOBJ = new URL(`${url}${link.href}`)
                urls.push(urlOBJ.href);
            } catch (err) {
                console.log(`invalid relative URL: ${err.message}`);
            }
        } else {
            try {
                const urlOBJ = new URL(link.href);
                urls.push(urlOBJ.href);
            } catch (err) {
                console.log(`invalid relative URL: ${err.message}`);
            }
        }
        
    }
    return urls;
}

async function crawl(url, curURL, pages) {
    const baseURLOBJ = new URL(url);
    const curURLOBJ = new URL(curURL);
    if(baseURLOBJ.hostname !== curURLOBJ.hostname) {
        return pages;
    }
    const normCurURL = normalizeURL(curURL);
    if(pages[normCurURL] > 0) {
        pages[normCurURL]++;
        return pages;
    }

    pages[normCurURL] = 1;
    console.log(`crawling: ${curURL}`);
    try {
        const res = await fetch(curURL);
        if (res.status > 399) {
            console.log(`error in fetch with status code: ${res.status} on page: ${curURL}`);
            return pages;
        }
        const content = res.headers.get('content-type');
        if(!content.includes('text/html')) {
            console.log(`non html response! content type: ${content} on page: ${curURL}`);
            return pages;
        }
        // console.log(await res.text());
        const htmlBody = await res.text();
        const nextURLS = URLtoHTML(htmlBody, url);
        for (const nextURL of nextURLS) {
            pages = await crawl(url, nextURL, pages);
        }
    } catch (err) {
        console.log(`error: ${err}`);
    }
    return pages;
}

function normalizeURL(url) {
    const urlOBJ = new URL(url);
    const hostname = `${urlOBJ.hostname}${urlOBJ.pathname}`;
    if(hostname.length > 0 && hostname.slice(-1) === '/') {
        return hostname.slice(0, -1);
    } else {
        return hostname;
    }
}

module.exports = {
    normalizeURL,
    URLtoHTML,
    crawl,
}