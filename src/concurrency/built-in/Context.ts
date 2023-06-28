
import * as playwright from 'playwright';

import { ResourceData } from '../ConcurrencyImplementation';
import SingleBrowserImplementation from '../SingleBrowserImplementation';
import debug = require('debug');

export default class Context extends SingleBrowserImplementation {
    public async init() { }
    public async close() {
        try {
            await (this.browser as playwright.Browser)?.close();
        } catch (error: any) {
            debug("Error closing browser: " + error.message)
        }
    }
    protected async createResources(): Promise<ResourceData> {
        const context = await (this.browser as playwright.Browser)
            .newContext();
        const page = await context.newPage();
        return {
            context,
            page,
        };
    }

    protected async freeResources(resources: ResourceData): Promise<void> {
        await resources.context.close();
    }

}
