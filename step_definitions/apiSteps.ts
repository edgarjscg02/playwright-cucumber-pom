import { Given, When, Then } from '@cucumber/cucumber';
import { expect, APIResponse } from '@playwright/test';
import { UserClient } from '../api/UserClient';
import { CustomWorld } from '../support/hooks';

let userClient: UserClient;
let apiResponse: APIResponse;
let responseBody: any;

Given('que el servicio de usuarios está disponible', async function (this: CustomWorld) {
    userClient = new UserClient(this.apiContext);
});

When('envío una solicitud POST para crear el usuario con nombre {string} y trabajo {string}', async function (name: string, job: string) {
    apiResponse = await userClient.createUser(name, job);
    responseBody = await apiResponse.json();
});

Then('la respuesta del servicio debe tener un código de estado {int}', async function (statusCode: number) {
    expect(apiResponse.status()).toBe(statusCode);
});

Then('el JSON de respuesta debe contener el nombre {string} y un ID generado', async function (expectedName: string) {
    expect(responseBody.name).toBe(expectedName);
    expect(responseBody).toHaveProperty('id');
});
