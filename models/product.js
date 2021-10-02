const fs = require('fs'); // this allows us to use the computers file system. fs is a Nodejs core module.
const path = require('path'); // this brings in the 'path' module so we can construct a path to save our file. 'path' is a core module.

const Cart = require('./cart'); // calls the Cart class for use on this page.

// this is how we create our path to save our file. It calls our 'path' const from the above line and joins it to the path to our root directory.
// There we created a folder named 'data' the 2nd argument sends it to. The 3rd argument creates a file called 'products.json'. It is a global constant because it's not in any of the functions below.
const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

const getProductsFromFile = cb => {

        // this will read our file at our defined path of 'p', if there's an error it will return an empty array and if not, it will read the file content.
        fs.readFile(p, (err, fileContent) => {
            if (err) {
               cb([]); // this is a function, it's our cb() function which passes an empty array '[]' back up to 'fetchAll(cb).
            } else {          
                cb(JSON.parse(fileContent)); // we use JSON.parse() to read the fileContent and return it as an array using our (cb) function which passes the array back up to our 'fetchAll(cb)' function.
            }
        });
};

// the next line in Next Gen JavaScript using a class. This class in named Product and this exports it.
module.exports = class Product {
    // this next bit of code defines the shape of a product. The constructor has an argument or arguments (argument, argument, argument, etc...), in this case 'title, imageUrl, description, price' are our arguments.
    // And then store data in properties. Property is 'this.property' and data is what follows the = sign. Example 'this.title = title;'. The names don't have to match but it makes it easier to follow.
    // With the info below, products that we add will have all that data.
    constructor(id, title, imageUrl, description, price) {
        // the argument 'title' is defined by 'this.title', 'id' is defined by 'this.id' and etc.
        // here we give this.id = id a null value for a new product, the actual id will be assigned during the save() function below.
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    // this is a save() function without the function keyword. function save() is the same as just typing save(). This is now a method available in the class Product.
    save() { 
        getProductsFromFile(products => {
            // the following if says, if there is already an id, use the findIndex() function to search prod and find the id. If it matches 'this.id' from the Product class then update it with 'this' value.
            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products]; // the spread operator ... pulls all of the existing products out of the array and stores them in a new array called upatedProducts.
                updatedProducts[existingProductIndex] = this; // We then replace the existing product index with 'this' which is defined in the constructor above which is part of the class "Product".
                fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                    console.log(err);
                });
            } else { // this else creates a new product with random number for an id and writes it to the file if the above if statement is not true.
                this.id = Math.random().toString(); // This will assign a random number as an ID to each saved product. Math.random() is not guaranteed to be unique but for now it works. toString() converts the number to a string for us. You could use the number if you want.
                products.push(this); // pushes our new product that was entered by the user onto the array. 'this' refers to the class. We have to write an arrow function '=>' or 'this' won't have context anymore and won't refer to the class.
                // writes the file to our path defined by 'p' and it writes our 'products' array using JSON converted to a string using the 'stringify()' function.
                // if there's an err it will show it in the console log.
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log(err);
                }); 
            }
        });

    }

    // the static keyword to call from the Product class and the argument (id) looking for the product id.
    static deleteById(id) { // we use the static keyword to call from the Product class. Static methods have no access to data stored in specific objects so they use the class.
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id); // gets our product details by id and puts them in the 'updatedProducts' const.
            // 'find()' is a default JavaScript method to search the 'products' parameter from getProductsFromFile.
            // inside the find() method we execute a function to find every element in the array and will return the element for which this function returns true.
            const updatedProducts = products.filter(prod => prod.id !== id); // This one-line shorthand function 'prod => prod.id === id' basicalls says, for each product 'prod', use the filter() method and look at the product id 'prod.id' and if it does not (!) equal the id 'id' return it and store it in the 'updatedProducts' constant so we can keep all those items.
            // after it saves all products into a new array except for the one with the matching id, we save the new array using fs.writeFile. It also checks to see if there was an error.
            fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                if (!err) {
                    Cart.deleteProduct(id, product.price); // pulls the price out of our product details found in the 'product' const defined on line 64.
                }
            }); 
        });
    }

    // this is a fetchAll() function that is like a utility function. It fetches all existing products. The 'static' keyword makes sure I can call the method directly on the class itself (Product) and not on an instantiated object.
    // The value (cb) is an argument in fetch that will accept the callback data from our fs.readFile() line in the getProductsFromFile constant. In this case the (cb) will be a function.
    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    // again, a static keyword to call from the Product class and a callback (the 'cb' argument).
    static findById(id, cb) {
        getProductsFromFile(products => {
            // 'find()' is a default JavaScript method to search the 'products' parameter from getProductsFromFile.
            // inside the find() method we execute a function to find every element in the array and will return the element for which this function returns true.
            const product = products.find(p => p.id === id); // This one-line shorthand function 'p => p.id === id' basicalls says, for each product 'p' look at the product id 'p.id' and if it equals the id 'id' return it and store it in the 'product' constant.
            cb(product); // this then fills the callback argument 'cb' with the data from our 'product' constant.
        });
    }
};