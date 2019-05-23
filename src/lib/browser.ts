/*
	Import the instance(s) of the webdriver for selenium-webdriver for the
	desired side-effect of them automatically providing their npm-installed
	path when instantiating a new browser
*/
import "chromedriver";
import "geckodriver";
import { Builder, Capabilities, ThenableWebDriver } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";

import { logger } from "./logger";

export type BrowserType = "firefox" | "chrome";

export class Browser
{
	public readonly driver: ThenableWebDriver;

	public constructor(browserType: BrowserType, startingURL: URL, vpn: boolean = false)
	{
		logger.debug(`Building a new ${browserType} browser (${startingURL.hostname})`);

		if (browserType === "chrome")
		{
			const chromeCapabilities: Capabilities = Capabilities.chrome();

			const chromeOptions: Options = new Options();

			// Try to disable "Restore pages?" popup - although it doesn't seem to be working
			chromeOptions.addArguments("disable-features=InfiniteSessionRestore");

			// If a vpn is required, using a single Chrome profile directory to only require the user to set up their VPN once.
			// Otherwise, use different profile per hostname so browsers don't error out from directory being in use.
			if (vpn)
			{
				chromeOptions.addArguments("user-data-dir=.\\webdriver-browser-profiles\\chrome-vpn\\");
			} else
			{
				chromeOptions.addArguments(`user-data-dir=.\\webdriver-browser-profiles\\chrome-${startingURL.hostname}\\`);
			}

			chromeOptions.addArguments(`homepage ${startingURL.href}`);

			chromeCapabilities.set("chromeOptions", chromeOptions);

			this.driver = new Builder()
				.forBrowser(browserType)
				.setChromeOptions(chromeOptions)
				.build();
		} else
		{
			this.driver = new Builder().forBrowser(browserType)
				.build();
		}
		logger.debug(`Browser built (${startingURL.href})`);
	}

	public async close(): Promise<void>
	{
		await this.driver.quit();
	}
}
