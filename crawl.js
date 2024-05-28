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

async function crawl(url) {
    console.log(`crawling: ${url}`);
    try {
        const res = await fetch(url);
        if (res.status > 399) {
            console.log(`error in fetch with status code: ${res.status} on page: ${url}`);
            return;
        }
        const content = res.headers.get('content-type');
        if(!content.includes('text/html')) {
            console.log(`non html response! content type: ${content} on page: ${url}`);
            return;
        }
        console.log(await res.text());
    } catch (err) {
        console.log(`error: ${err}`);
    }
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