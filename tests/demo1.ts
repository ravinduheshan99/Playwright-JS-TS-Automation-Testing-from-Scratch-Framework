import {expect, type Locator, type Page} from "@playwright/test";

let message1 : String = "Hello";
message1 = "Bye";
console.log(message1);

let age1 : number = 20;
console.log(age1);

let isActive : boolean = true;
console.log(isActive);

let numbers1 : number[] = [1, 2, 3];
console.log(numbers1);

let data : any = "This could be anything";
console.log(data);

function add(x: number, y: number): number {
    return x + y;
}
console.log(add(5, 10));

let user : {name:string, age:number, location:string} = {name: "Alice", age: 30, location: "New York"};
console.log(user);


class CartPage {

    page:Page;
    cartProduct:Locator;
    checkoutButton:Locator;

    constructor(page:any) {
        this.page = page;
        // All products listed in the cart
        this.cartProduct = page.locator("div li");
        // Checkout button to proceed to order review
        this.checkoutButton = page.locator("text=Checkout");
    }
}