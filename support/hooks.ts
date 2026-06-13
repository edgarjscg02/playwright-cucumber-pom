import { Before, After, BeforeAll, AfterAll, setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page, APIRequestContext, request } from '@playwright/test';

let browser: Browser;

export class CustomWorld extends World {
  public apiContext!: APIRequestContext;
  public context!: BrowserContext;
  public page!: Page;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);

BeforeAll(async function () {
    // En CI (GitHub Actions) se ejecuta headless. En local, por defecto se ejecuta headed (con navegador visible)
    const headless = process.env.CI === 'true' || process.env.HEADLESS === 'true';
    browser = await chromium.launch({ headless });
});

Before(async function (this: CustomWorld) {
    // Inicializa contextos independientes para API y UI por cada escenario
    this.apiContext = await request.newContext();
    this.context = await browser.newContext();
    this.page = await this.context.newPage();
});

After(async function (this: CustomWorld) {
    // Limpieza absoluta para evitar fugas de memoria
    if (this.page) {
        await this.page.close();
    }
    if (this.context) {
        await this.context.close();
    }
    if (this.apiContext) {
        await this.apiContext.dispose();
    }
});

AfterAll(async function () {
    if (browser) {
        await browser.close();
    }
});
