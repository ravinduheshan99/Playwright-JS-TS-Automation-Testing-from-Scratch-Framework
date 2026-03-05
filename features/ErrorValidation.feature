Feature: Ecommerce Error Validation
  @Error
  @Validation
  Scenario Outline: Placing the Order
    Given a login to Ecommerce2 application with "<username>" and "<password>"
    Then Verify Error message is displayed for invalid credentials

    Examples:
      | username           | password  |
      | test@gmail.com     | test@123  |
      | test2@gmail.com    | test2@123 |