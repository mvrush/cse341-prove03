const fs = require('fs');
const path = require('path');

// this is how we create our path to save our file. It calls our 'path' const from the above line and joins it to the path to our root directory.
// There we created a folder named 'data' the 2nd argument sends it to. The 3rd argument creates a file called 'cart.json'. It is a global constant because it's not in any of the functions below.
const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

// this line exports our 'Cart' class. Classes start with capital letters
module.exports = class Cart {
    static addProduct(id, productPrice) { // we use the static keyword to call from the Cart class. Static methods have no access to data stored in specific objects so they use the class.
        // Fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0}; // this creates the cart variable with an array of products and a 'totalPrice' value of 0.
            // the next lines mean "If we don't have an error we have a cart. Then fill cart with our 'fileContent' using the JSON.parse() function to store it as JSON data".
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            // Analyze the cart => find existing product
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id); // looks through products which is defined above on line 13. If the id matches an existing one it gets the index where it's located and runs the following code.
            const existingProduct = cart.products[existingProductIndex]; // takes the product at that index and adds it to the 'existingProduct' const.
            let updatedProduct; // creates a variable called 'updatedProduct'.
                // Add new product/ increase quantity if needed
                // the if statement below says, if there is an existing product use 'updatedProduct'
            if (existingProduct) {
                updatedProduct = { ...existingProduct }; // this is Next Generation JavaScript and is the Object Spread Operator. It takes all the properties of the existing product and adds them to a new JavaScript object as defined by the curly braces {}. 
                updatedProduct.qty = updatedProduct.qty + 1; // says the new updatedProduct.qty is equal to the old updatedProduct.qty + 1. It increases our cart quantity for a product.
                cart.products = [...cart.products]; // Object Spread Operator pulls all the cart.products data and puts it into the cart.products.
                cart.products[existingProductIndex] = updatedProduct; // says at this index position 'existingProductIndex' replace the element with my updated product.
            } else {
            // this gets executed if we have a new product in the cart and loads new info into the 'updatedProduct' variable.
            updatedProduct = { id: id, qty: 1 }; // updatedProduct is now equal to a new JavaScript object defined by the curly braces {}. It has the product id and sets the qty to 1.
            cart.products = [...cart.products, updatedProduct]; // Next Generation JavaScript Object Spread Operation that creates an array with all the old cart products and it adds the new product which is 'updatedProduct'.
            }
            cart.totalPrice = cart.totalPrice + +productPrice; // this line shows our new increased 'productPrice' and passes it clear back to the start of the static addProduct function.
                // we had to add the + to 'productPrice' like this '+productPrice' to convert that string to a number for our price.
            
            // we then write it to our file following the path (p) to 'cart' and writing in JSON format as a string.
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });
        });
        
    }

    static deleteProduct(id, productPrice) {
        // the next function read the file p which is our JSON file. If there's an error which means nothing in the cart it returns.
        //
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            }
            const updatedCart = { ...JSON.parse(fileContent) }; // takes all the properties of the old cart (found in our fileContent) and puts them in a updatedCart array.
            const product = updatedCart.products.find(prod => prod.id === id);
            // the following if statement says if there's no (!) product in the cart, simply return and stop executing.
            if (!product) {
                return;
            }
            const productQty = product.qty; // pulls the product quantity out of our product from the 'qty' field stored above in the updatedProduct.qty line at line 26.
            // next lines filter the old updatecCart.products array and if the id doesn't match it puts it in a new updatedCart.products array that will include all products except the one I'm removing.
            updatedCart.products = updatedCart.products.filter(
                prod => prod.id !== id
            );
            updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty; // the math to figure out cart.totalPrice. It multiplies productPrice by productQty and subtracts that from cart.totalPrice (remember the order of operations is multiplication before subtraction).
        
            // we then write it to our file following the path (p) to 'cart' and writing in JSON format as a string.
            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                console.log(err);
            });
        });
    }
 
    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            const cart = JSON.parse(fileContent); // looks at all our file content and adds them to the cart const. Sends it back to our getCart() function cb.
            if (err) { // says if there is nothing in the cart which results in err, then cb the value null.
                cb(null);
            } else {
            cb(cart);
            }
        });

    }

};