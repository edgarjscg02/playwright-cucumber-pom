import { Page } from '@playwright/test';

export class LoginPage {
    private page: Page;
    private usernameInput: string;
    private passwordInput: string;
    private loginButton: string;
    private inventoryContainer: string;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = 'input[data-test="username"]';
        this.passwordInput = 'input[data-test="password"]';
        this.loginButton = 'input[data-test="login-button"]';
        this.inventoryContainer = '.inventory_container';
    }

    async navigateTo(): Promise<void> {
        await this.page.goto('https://www.saucedemo.com/');
    }

    async login(username: string, password: string): Promise<void> {
        await this.page.fill(this.usernameInput, username);
        await this.page.fill(this.passwordInput, password);
        await this.page.click(this.loginButton);
    }

    async isProductPageVisible(): Promise<boolean> {
        return await this.page.isVisible(this.inventoryContainer);
    }
}
