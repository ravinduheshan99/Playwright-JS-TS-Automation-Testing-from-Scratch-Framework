Feature: Ecommerce Validation
  @Regression
  Scenario: Placing the Order
    Given a login to Ecommerce application with "test@gmail.com" and "test@123"
    When add "ZARA COAT 3" to the cart
    Then Verify "ZARA COAT 3" is displayed in the cart
    When Enter "Sri Lanka" as the country in the checkout form and validate the login email of the user is "test@gmail.com" and submit the order
    Then Verify the order is present in the order history with correct details

  @Error
  @Validation
  Scenario Outline: Placing the Order
    Given a login to Ecommerce2 application with "<username>" and "<password>"
    Then Verify Error message is displayed for invalid credentials

    Examples:
      | username        | password  |
      | test@gmail.com  | test@123  |
      | test2@gmail.com | test2@123 |