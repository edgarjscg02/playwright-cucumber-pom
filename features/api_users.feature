Feature: Gestión de Usuarios vía API

  Scenario: Crear un nuevo usuario de forma exitosa
    Given que el servicio de usuarios está disponible
    When envío una solicitud POST para crear el usuario con nombre "Esteban" y trabajo "QA Automation"
    Then la respuesta del servicio debe tener un código de estado 201
    And el JSON de respuesta debe contener el nombre "Esteban" y un ID generado