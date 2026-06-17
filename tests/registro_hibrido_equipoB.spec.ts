import { test, expect } from '@playwright/test';

test('Registro Híbrido de Equipo B', async ({ page, request }) => {
  const uniqueId = Date.now();
  const nombre = `Equipo B ${uniqueId}`;
  const email = `equipob_${uniqueId}@mailinator.com`;
  const password = 'QA123@@qa123@@';
  const firstName = 'Equipo';
  const lastName = 'B';
  const company = 'DGII';
  const address = 'EN LA CAPITAL';
  const state = 'FLORIDA';
  const city = 'MEDLEY';
  const zipcode = '33166';
  const mobileNumber = '8095555555';

  const dateOfBirth = {
    day: '1',
    month: '1',
    year: '1997',
  };

  const radioOption = 'Mr.';

  const expectedMessages = {
    signupHeader: 'New User Signup!',
    accountInfoSection: 'Enter Account Information',
    accountCreatedBanner: 'Account Created!',
    accountCreatedParagraph: '- paragraph: Congratulations! Your new account has been successfully created!',
    accountDeletedBanner: 'Account Deleted!',
    accountDeletedText: 'Your account has been permanently deleted!',
  };

  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (
      url.includes('googleads') ||
      url.includes('doubleclick') ||
      url.includes('pagead2') ||
      url.includes('google-analytics') ||
      url.includes('quantserve') ||
      url.includes('facebook')
    ) {
      route.abort();
    } else {
      route.continue();
    }
  });

  // Paso 1: Dado (Given)
  await test.step('Dado que navego a la página de registro de Automation Exercise', async () => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Signup / Login' })).toBeVisible();
    await page.getByRole('link', { name: 'Signup / Login' }).click();
    await expect(page.getByRole('heading', { name: expectedMessages.signupHeader })).toBeVisible();
  });

  // Paso 2: Cuando (When)
  await test.step('Cuando completo el formulario de registro con los datos de Equipo B', async () => {
    await page.getByRole('textbox', { name: 'Name' }).fill(nombre);
    await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').fill(email);
    await page.getByRole('button', { name: 'Signup' }).click();

    await expect(page.getByText(expectedMessages.accountInfoSection)).toBeVisible();
    await page.getByRole('radio', { name: radioOption }).check();
    await page.getByRole('textbox', { name: 'Password *' }).fill(password);

    await page.locator('#days').selectOption(dateOfBirth.day);
    await page.locator('#months').selectOption(dateOfBirth.month);
    await page.locator('#years').selectOption(dateOfBirth.year);

    await page.getByRole('textbox', { name: 'First name *' }).fill(firstName);
    await page.getByRole('textbox', { name: 'Last name *' }).fill(lastName);
    await page.getByRole('textbox', { name: 'Company', exact: true }).fill(company);
    await page.getByRole('textbox', { name: 'Address * (Street address, P.' }).fill(address);
    await page.getByRole('textbox', { name: 'State *' }).fill(state);
    await page.getByRole('textbox', { name: 'City * Zipcode *' }).fill(city);
    await page.locator('#zipcode').fill(zipcode);
    await page.getByRole('textbox', { name: 'Mobile Number *' }).fill(mobileNumber);
    await page.getByRole('button', { name: 'Create Account' }).click();
  });

  // Paso 3: Entonces (Then)
  await test.step('Entonces valido que la cuenta fue creada y el mensaje de confirmación se muestra', async () => {
    await expect(page.getByText(expectedMessages.accountCreatedBanner)).toBeVisible();
    await expect(page.locator('#form')).toMatchAriaSnapshot(expectedMessages.accountCreatedParagraph);
    await expect(page.getByRole('link', { name: 'Continue' })).toBeVisible();
    await page.getByRole('link', { name: 'Continue' }).click();
  });
// Paso 4: Y luego (And Then)
  await test.step('Entonces valido vía API que el usuario fue creado y los datos coinciden', async () => {
    const apiResponse = await request.get('/api/getUserDetailByEmail', {
      params: { email },
    });

    expect(apiResponse.status()).toBe(200);

    const responseBody = await apiResponse.json();

    expect(responseBody.responseCode).toBe(200);
    expect(responseBody.user).toBeDefined();

    const userData = responseBody.user;
    expect(userData.name).toBe(nombre);
    expect(userData.email).toBe(email);
    expect(userData.title).toBe(radioOption.replace('.', ''));
    expect(userData.birth_day).toBe(dateOfBirth.day);
    expect(userData.birth_month).toBe(dateOfBirth.month);
    expect(userData.birth_year).toBe(dateOfBirth.year);
    expect(userData.first_name).toBe(firstName);
    expect(userData.last_name).toBe(lastName);
    expect(userData.company).toBe(company);
    expect(userData.address1).toBe(address);
    expect(userData.state).toBe(state);
    expect(userData.city).toBe(city);
    expect(userData.zipcode).toBe(zipcode);
  });

  // Paso 5: Y luego (And Then)
  await test.step('Y luego limpio los datos eliminando la cuenta creada', async () => {
    await page.getByRole('link', { name: 'Delete Account' }).click();
    await expect(page.getByText(expectedMessages.accountDeletedBanner)).toBeVisible();
    await expect(page.locator('#form')).toContainText(expectedMessages.accountDeletedText);
  });
});