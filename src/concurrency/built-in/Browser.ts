
import * as playwright from 'patchright';

import { debugGenerator, timeoutExecute } from '../../util';
import ConcurrencyImplementation, { WorkerInstance } from '../ConcurrencyImplementation';
const debug = debugGenerator('BrowserConcurrency');

const BROWSER_TIMEOUT = 5000;

export default class Browser extends ConcurrencyImplementation {
    public async init() { }
    public async close() {
        try {
            await (this.browser as playwright.Browser)?.close();
        } catch (error: any) {
            debug("Error closing browser: " + error.message)
        }
    }
    browser: playwright.Browser | null = null;
    public async workerInstance(perBrowserOptions: playwright.LaunchOptions | undefined, perPageOptions: playwright.BrowserContextOptions | undefined):
        Promise<WorkerInstance> {

        const options = perBrowserOptions || this.options;
        const pageOptions = perPageOptions || this.pageOptions;
        let browser = await this.playwright.launch(options) as playwright.Browser;
        this.browser = browser;
        let page: playwright.Page;
        let context: playwright.BrowserContext;

        return {
            jobInstance: async () => {
                await timeoutExecute(BROWSER_TIMEOUT, (async () => {
                    context = await browser.newContext(pageOptions);
                    page = await context.newPage();
                })());

                return {
                    resources: {
                        page,
                    },

                    close: async () => {
                        await timeoutExecute(BROWSER_TIMEOUT, context.close());
                    },
                };
            },

            close: async () => {
                await browser.close();
            },

            repair: async () => {
                debug('Starting repair');
                try {
                    // will probably fail, but just in case the repair was not necessary
                    await browser.close();
                } catch (e) { }

                // just relaunch as there is only one page per browser
                browser = await this.playwright.launch(options);
            },
        };
    }

}
