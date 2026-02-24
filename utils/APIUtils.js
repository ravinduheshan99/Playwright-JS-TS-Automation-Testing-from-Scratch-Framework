class APIUtils {

    constructor(apiContext, loginPayLoad) {
        // Store shared API context and login payload so they can be reused across API calls
        this.apiContext = apiContext;
        this.loginPayLoad = loginPayLoad;
    }

    async getToken() {
        // Authenticate via API instead of UI to obtain a reusable auth token
        const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",{ data: this.loginPayLoad });
        const loginResponseJson = await loginResponse.json();
        const token = loginResponseJson.token;
        return token;
    }

    async createOrder(orderPayLoad) {
        let response = {};
        // First retrieve a valid token so the order request can be authorized
        response.token = await this.getToken();
        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",{data: orderPayLoad, headers: {'Authorization': response.token, 'Content-Type': 'application/json'}});
        const orderResponseJson = await orderResponse.json();
        // Extract the created order ID to use later in UI validation
        const orderId = orderResponseJson.orders[0];
        response.orderId = orderId;
        return response;
    }
}

module.exports = { APIUtils };
