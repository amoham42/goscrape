const { crawl } = require('./crawl.js');

function main() {
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
    crawl(map);
}

main();