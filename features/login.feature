Feature: Autenticación de Usuarios

  Scenario: Inicio de sesión exitoso en el portal
    Given el usuario está en la página de login
    When ingresa el usuario "standard_user" y la contraseña "secret_sauce"
    Then el usuario debería ver la página principal