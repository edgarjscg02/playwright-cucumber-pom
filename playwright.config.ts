import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Ejecución secuencial para evitar conflictos de datos o problemas de carga en el sitio de práctica
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: 'https://automationexercise.com',
    trace: 'on', // For DoD, we always capture tracing evidence
    screenshot: 'on',
    video: 'on',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
