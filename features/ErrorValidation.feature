Feature: Ecommerce Error Validation

  # Tags used to categorize the scenario for test filtering and grouped execution
  @Error
  @Validation
  Scenario Outline: Placing the Order
    Given a login to Ecommerce2 application with "<username>" and "<password>"
    Then Verify Error message is displayed for invalid credentials

    # Test data used by the Scenario Outline to run the same scenario with multiple inputs
    Examples:
      | username           | password  |
      | test@gmail.com     | test@123  |
      | test2@gmail.com    | test2@123 |