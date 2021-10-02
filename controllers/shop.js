/********* This is the Shop Controller  **************/

const Product = require('../models/product'); // we import the class 'Product' from the models folder product.js file. We use a capital starting character for classes, hence 'Product'.
const Cart = require('../models/cart'); // import the class 'Cart' from the models folder cart.js file.

exports.getProducts = (req, res, next) => {
    // this next line creates it's own callback process and we render in the function we wrote in teh models/product.js to fetchAll
    Product.fetchAll((products) => {
        console.log("called from shop.js", products); // shows us all the objects in the array products
        // this response says to render a view using the shop.ejs template file that's the 1st argument. The 2nd argument {} is a javascript object and it's filled with JavaScript wariables.
        // In the JavaScript object we map it to a key name which we can then use in the template to refer to a keyname to refer to the data we are passing in.
        // in the first line we use 'prods' as the keyword for the data from the 'products' const.
        res.render('shop/product-list', {
            prods: products, // keyname is 'prods' for the value of our 'products' array which is defined above with global scope. All the rest follow the same syntax.
            pageTitle: 'All Products',
            path: '/products'
        });
    });
 
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId; // this uses 'params' to pull the 'productId' out of our routes/shop.js file.
    Product.findById(prodId, product => {
        // the next lines send a render response to the views/shop/product-detail.ejs view. It sends key: value pairs pulled from our prodId parameters earlier in this function.
        // for the 'path:' value we use '/products' because that is what we want to mark as the active link in our navigation
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products'
        });
    });
}; 

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        console.log("called from shop.js ", products); // shows us all the objects in the array products
        // this response says to render a view using the shop.ejs template file that's the 1st argument. The 2nd argument {} is a javascript object and it's filled with JavaScript wariables.
        // In the JavaScript object we map it to a key name which we can then use in the template to refer to a keyname to refer to the data we are passing in.
        // in the first line we use 'prods' as the keyword for the data from the 'products' const.
        res.render('shop/index', {
            prods: products, // keyname is 'prods' for the value of our 'products' array which is defined above with global scope. All the rest follow the same syntax.
            pageTitle: 'Shop',
            path: '/'
        });
    });
};

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(
                    prod => prod.id === product.id
                );
                if (cartProductData) {
                    cartProducts.push({ productData: product, qty: cartProductData.qty });
                }
            }
        res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: cartProducts // this is sent to our views/shop/cart.ejs view.
            });
        });
    });
};

// the following code pulls the productId from our post request when the Add-To-Cart button is pressed.
exports.postCart = (req, res, next) => {
    const prodId = req.body.productId; // it gets the productId from our hidden input under our Add-To-Cart button
    // we then use that prodId to find our product by it's Id.
    Product.findById(prodId, (product) => {
        Cart.addProduct(prodId, product.price); //this passes the prodId and product.price to the Cart model. It pulls the product.price from the (product) info defined at the start of this function. 
    });
    res.redirect('/cart'); // this line loads the Get route to pull up the Cart page.
};

// the following is a POST command to delete an item in the cart
exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/Orders', {
        path: '/Orders',
        pageTitle: 'Your Orders'
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};