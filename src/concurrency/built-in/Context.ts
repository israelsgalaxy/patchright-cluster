
import * as playwright from 'playwright';

import { ResourceData } from '../ConcurrencyImplementation';
import SingleBrowserImplementation from '../SingleBrowserImplementation';

export default class Context extends SingleBrowserImplementation {
    public async init() { }
    public async close() { }
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
