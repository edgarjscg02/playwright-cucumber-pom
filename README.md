# Playwright + Cucumber + TypeScript Automation Framework (POM)

Este es un framework de automatización de pruebas de nivel profesional estructurado con el patrón de diseño **Page Object Model (POM)**, utilizando **Playwright** para la interacción web/API, **Cucumber** para la orquestación basada en comportamiento (BDD) con **Gherkin**, y **TypeScript** para garantizar un tipado estricto, robustez y autocompletado en el desarrollo.

---

## 🚀 Características del Framework

- **BDD (Behavior-Driven Development)**: Escenarios de negocio escritos en lenguaje natural (Gherkin).
- **TypeScript Nativo**: Código fuertemente tipado que reduce errores en tiempo de desarrollo.
- **Page Object Model (POM)**: Separación limpia entre la lógica de interacción de las páginas (Locators/Actions) y la definición de los pasos (Step Definitions).
- **Pruebas Híbridas (UI y API)**: Soporte integrado para automatización web de extremo a extremo y peticiones HTTP eficientes.
- **Contexto Aislado e Inteligente**: Inicialización de `APIRequestContext` y `BrowserContext` independientes por escenario de prueba (limpieza total automática).
- **Ejecución Flexible (Headed/Headless)**: Ejecución visual por defecto localmente y modo *headless* automático en entornos de integración continua.
- **Reporte Integrado**: Generación automática de reportes HTML interactivos (`cucumber-report.html`).
- **Pipeline de CI/CD**: Flujo configurado para **GitHub Actions** que automatiza la ejecución de pruebas y guarda los reportes de resultados.

---

## 📂 Estructura del Proyecto

```text
├── .github/
│   └── workflows/
│       └── ci.yml             # Pipeline de CI en GitHub Actions
├── api/
│   └── UserClient.ts          # POM para interacciones con la API (ReqRes)
├── features/
│   ├── api_users.feature      # Escenarios Gherkin para pruebas de API
│   └── login.feature          # Escenarios Gherkin para pruebas de UI (SauceDemo)
├── pages/
│   └── LoginPage.ts           # POM para la página de Login (UI)
├── step_definitions/
│   ├── apiSteps.ts            # Implementación de los pasos Gherkin de API
│   └── loginSteps.ts          # Implementación de los pasos Gherkin de UI
├── support/
│   └── hooks.ts               # Ciclo de vida (Before/After), CustomWorld y setup de Playwright
├── .gitignore                 # Exclusiones de archivos para Git/GitHub
├── cucumber.json              # Configuración del motor Cucumber-JS
├── package.json               # Dependencias del proyecto y scripts
└── tsconfig.json              # Configuración de compilación de TypeScript
```

---

## 🛠️ Requisitos Previos

Asegúrate de tener instalado:
- **Node.js** (Versión 18 o superior)
- **npm** (Viene integrado con Node.js)

---

## ⚙️ Instalación

1. Clona este repositorio o navega hasta el directorio raíz del proyecto:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd playwright-cucumber-pom
   ```

2. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```

3. Instala los navegadores necesarios de Playwright (solo requiere Chromium en esta configuración):
   ```bash
   npx playwright install chromium
   ```

---

## 🏃 Ejecución de Pruebas

### Ejecutar todas las pruebas (Modo Headed / Navegador Visible por defecto):
```bash
npm test
```

### Ejecutar pruebas en segundo plano (Modo Headless):
```bash
$env:HEADLESS="true"; npm test
```
*(Para entornos Linux/macOS, usa `HEADLESS=true npm test`)*

### Reporte de Resultados:
Una vez finalizada la ejecución, se generará un reporte interactivo en la raíz del proyecto con el nombre:
📂 **`cucumber-report.html`**

Puedes abrir este archivo en cualquier navegador para ver los detalles, capturas de pantalla o pasos fallidos.

---

## 🤖 Integración Continua (GitHub Actions)

Este framework está preparado para ejecutarse automáticamente en cada `push` o `pull_request` a las ramas principales (`main`, `master`, `dev`).

El workflow definido en [ci.yml](.github/workflows/ci.yml) realiza las siguientes acciones:
1. Descarga el código del repositorio.
2. Levanta un entorno Node.js optimizado.
3. Instala las dependencias e instala la versión exacta del navegador requerida por Playwright.
4. Ejecuta los escenarios de prueba en modo headless (`CI: 'true'`).
5. Genera y publica el reporte de Cucumber como un artefacto descargable en la interfaz de GitHub, disponible por 30 días.

---

## 📝 Buenas Prácticas Aplicadas

1. **Tipado Estricto de Contexto (`CustomWorld`)**: En [hooks.ts](support/hooks.ts) extendemos la clase `World` de Cucumber para tipar con precisión `this.page`, `this.context` y `this.apiContext`, evitando el uso de tipos implícitos `any` y facilitando el autocompletado en los pasos.
2. **Ciclo de vida limpio**: Los hooks garantizan el cierre absoluto de las instancias del navegador y la liberación de memoria en el bloque `After`, previniendo fugas de recursos y procesos zombie.
3. **Parámetros Tipados en Step Definitions**: Validación estricta de variables que ingresan desde los archivos `.feature` de Gherkin a los métodos de prueba.
4. **Git Higiénico**: Configuración robusta en el `.gitignore` para asegurar que credenciales locales, reportes pesados de ejecuciones locales y directorios temporales de construcción no contaminen el control de versiones.
