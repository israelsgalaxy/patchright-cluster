
import * as playwright from 'playwright';

import { ResourceData } from '../ConcurrencyImplementation';
import SingleBrowserImplementation from '../SingleBrowserImplementation';
import debug = require('debug');

export default class Page extends SingleBrowserImplementation {
    public async init() { }
    public async close() {
        try {
            await (this.browser as playwright.Browser)?.close();
        } catch (error: any) {
            debug("Error closing browser: " + error.message)
        }
    }
    private context: playwright.BrowserContext | null = null;;
    protected async createResources(): Promise<ResourceData> {
        const browser = this.browser as playwright.Browser;
        if (!this.context) {
            this.context = await browser.newContext();
        }
        return {
            page: await this.context.newPage(),
        };
    }

    protected async freeResources(resources: ResourceData): Promise<void> {
        await resources.page.close();
    }

}
