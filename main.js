const { crawl } = require('./crawl.js');

async function main() {
    if (process.argv.length < 3) {
        console.log("input a page to scrape");
        process.exit(1);
    }

    if (process.argv.length > 3) {
        console.log("too many commands");
        process.exit(1);
    }

    const map = process.argv[2];
    console.log("Crawler started!");
    const pages = await crawl(map, map, {});
    for (const page of Object.entries(pages)) {
        console.log(page);
    }
}

main();