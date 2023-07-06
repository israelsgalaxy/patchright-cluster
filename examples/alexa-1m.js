// You need to download the Alexa 1M from http://s3.amazonaws.com/alexa-static/top-1m.csv.zip
// and unzip it into this directory

const { Cluster } = require("../dist");

const fs = require("fs").promises;
const devices = require("playwright").devices;
const iphone = devices["iPhone 13"];
(async () => {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 2,
        monitor: false,
        playwrightOptions: {
            headless: false,
        },
        //perPageOptions: [{ ...iphone }, { ...desktop }],
        pageOptions: { ...iphone },
    });
    setTimeout(() => {
        const metrics = cluster.status();
        console.log(metrics);
    }, 30000);
    cluster.context;
    // Extracts document.title of the crawled pages
    await cluster.task(async ({ page, data: url }) => {
        await page.goto(url, { waitUntil: "networkidle" });
        const pageTitle = await page.evaluate(() => document.title);
        console.log(`Page title of ${url} is ${pageTitle}`);
    });

    // In case of problems, log them
    cluster.on("taskerror", (err, data) => {
        console.log(`  Error crawling ${data}: ${err.message}`);
    });

    // Read the top-1m.csv file from the current directory
    const csvFile = await fs.readFile(__dirname + "/top-1m.csv", "utf8");
    const lines = csvFile.split("\n");
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const splitterIndex = line.indexOf(",");
        if (splitterIndex !== -1) {
            const domain = line.substr(splitterIndex + 1);
            // queue the domain
            cluster.queue("https://www." + domain.replace("\r", ""));
        }
    }
    await cluster.idle();
    await cluster.close();
})();
