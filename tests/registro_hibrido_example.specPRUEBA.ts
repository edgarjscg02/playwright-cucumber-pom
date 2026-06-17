import { test, expect } from '@playwright/test';

test('Registro Híbrido de Cliente y Validación de Integración por API', async ({ page, request }) => {
  // Generar datos únicos de registro para evitar conflictos
  const uniqueId = Date.now();
  const nombre = `Cliente Hibrido ${uniqueId}`;
  const email = `cliente_hibrido_${uniqueId}@gmail.com`;
  const password = 'PasswordSecure123';
  const firstName = 'Esteban';
  const lastName = 'Test';
  const company = 'Test Company Inc.';
  const address1 = 'Calle Falsa 123';
  const address2 = 'Apto 4B';
  const country = 'United States';
  const state = 'Florida';
  const city = 'Miami';
  const zipcode = '33101';
  const mobileNumber = '3055551234';

  // Configurar interceptores de red para bloquear anuncios y analytics molestos de Google
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
    // Hacer clic en Signup / Login en el header
    const signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
    await expect(signupLoginLink).toBeVisible();
    await signupLoginLink.click();

    // Validar que el formulario de "New User Signup!" esté presente
    await expect(page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible();
  });

  // Paso 2: Cuando (When)
  await test.step('Cuando completo el formulario de registro con los datos del usuario en la UI', async () => {
    // 1. Ingresar Nombre y Email iniciales
    await page.locator('[data-qa="signup-name"]').fill(nombre);
    await page.locator('[data-qa="signup-email"]').fill(email);
    
    // 2. Hacer clic en "Signup"
    await page.locator('[data-qa="signup-button"]').click();

    // 3. Completar la sección "Enter Account Information"
    await expect(page.getByText('Enter Account Information')).toBeVisible();
    await page.locator('#id_gender1').check(); // Elegir Mr.
    await page.locator('[data-qa="password"]').fill(password);
    
    // Fecha de nacimiento
    await page.locator('[data-qa="days"]').selectOption('15');
    await page.locator('[data-qa="months"]').selectOption('May');
    await page.locator('[data-qa="years"]').selectOption('1995');

    // Opcionales: Boletines y Ofertas
    await page.locator('#newsletter').check();
    await page.locator('#optin').check();

    // 4. Completar la sección "Address Information"
    await page.locator('[data-qa="first_name"]').fill(firstName);
    await page.locator('[data-qa="last_name"]').fill(lastName);
    await page.locator('[data-qa="company"]').fill(company);
    await page.locator('[data-qa="address"]').fill(address1);
    await page.locator('[data-qa="address2"]').fill(address2);
    await page.locator('[data-qa="country"]').selectOption(country);
    await page.locator('[data-qa="state"]').fill(state);
    await page.locator('[data-qa="city"]').fill(city);
    await page.locator('[data-qa="zipcode"]').fill(zipcode);
    await page.locator('[data-qa="mobile_number"]').fill(mobileNumber);

    // 5. Presionar el botón de crear cuenta (guardar)
    await page.locator('[data-qa="create-account"]').click();

    // Validar mensaje visual de éxito en la UI
    await expect(page.locator('[data-qa="account-created"]')).toBeVisible();
    await expect(page.getByText('Account Created!')).toBeVisible();
  });

  // Paso 3: Entonces (Then)
  await test.step('Entonces valido la existencia y coincidencia de datos del usuario mediante la API', async () => {
    // Realizar la consulta a la API de consulta de usuario por email
    const apiResponse = await request.get('/api/getUserDetailByEmail', {
      params: {
        email: email
      }
    });

    // Validar que el código de estado HTTP es 200
    expect(apiResponse.status()).toBe(200);

    const responseBody = await apiResponse.json();
    console.log('Respuesta del API obtenida:', JSON.stringify(responseBody, null, 2));

    // Validar que el código de respuesta JSON de la API sea 200 (indica éxito de búsqueda en este backend)
    expect(responseBody.responseCode).toBe(200);
    
    // Validar que los datos guardados en BD coincidan con lo introducido en la UI
    const userData = responseBody.user;
    expect(userData.name).toBe(nombre);
    expect(userData.email).toBe(email);
    expect(userData.first_name).toBe(firstName);
    expect(userData.last_name).toBe(lastName);
    expect(userData.company).toBe(company);
    expect(userData.address1).toBe(address1);
    expect(userData.address2).toBe(address2);
    expect(userData.country).toBe(country);
    expect(userData.state).toBe(state);
    expect(userData.city).toBe(city);
    expect(userData.zipcode).toBe(zipcode);
  });
});
