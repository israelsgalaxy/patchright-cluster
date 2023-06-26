const { Cluster } = require("../dist/index.js");
const { chromium } = require("playwright-extra");

// Load the stealth plugin and use defaults (all tricks to hide playwright usage)
// Note: playwright-extra is compatible with most puppeteer-extra plugins
const stealth = require("puppeteer-extra-plugin-stealth")();

// Add the plugin to playwright (any number of plugins can be added)
chromium.use(stealth);
(async () => {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_BROWSER,
        maxConcurrency: 2,
        playwright: chromium,
        playwrightOptions: {
            headless: false,
        },
    });
    cluster.execute(
        "https://bot.sannysoft.com",
        async ({ page, data: url }) => {
            console.log("Testing the stealth plugin..");
            await page.goto(url, { waitUntil: "networkidle" });
            await page.screenshot({
                path: `example-${Date.now()}.png`,
                fullPage: true,
            });
        }
    );
})();
