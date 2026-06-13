import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CustomWorld } from '../support/hooks';

let loginPage: LoginPage;

Given('el usuario está en la página de login', async function (this: CustomWorld) {
    loginPage = new LoginPage(this.page);
    await loginPage.navigateTo();
});

When('ingresa el usuario {string} y la contraseña {string}', async function (username: string, password: string) {
    await loginPage.login(username, password);
});

Then('el usuario debería ver la página principal', async function () {
    const isVisible = await loginPage.isProductPageVisible();
    expect(isVisible).toBe(true);
});
