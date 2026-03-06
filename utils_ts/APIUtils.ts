export class APIUtils {

    apiContext: any;
    loginPayLoad: any;

    constructor(apiContext: any, loginPayLoad: any) {
        // Store API request context and login payload so they can be reused in multiple API calls
        this.apiContext = apiContext;
        this.loginPayLoad = loginPayLoad;
    }

    async getToken() {
        // Send login request to obtain authentication token
        const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",{ data: this.loginPayLoad });
        const loginResponseJson = await loginResponse.json();
        const token = loginResponseJson.token;  // Extract token from login response
        return token;
    }

    async createOrder(orderPayLoad: any) {
        let response = {token: String, orderId: String};

        // Retrieve authentication token before creating an order
        response.token = await this.getToken();

        // Create a new order using API with authorization header
        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",{data: orderPayLoad, headers: {'Authorization': response.token, 'Content-Type': 'application/json'}});
        const orderResponseJson = await orderResponse.json();

        // Extract order ID from response to validate later in UI tests
        const orderId = orderResponseJson.orders[0];
        response.orderId = orderId;

        return response;
    }
}

module.exports = { APIUtils };