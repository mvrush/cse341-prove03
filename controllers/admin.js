/********* This is the Admin Controller  **************/

// we import the class from the models folder, the product.js file. We use a capital starting character for classes, hence 'Product'.
const Product = require('../models/product');

// this next functions exports 'getAddProduct' to our routes/admin.js file
exports.getAddProduct = (req, res, next) => {
    // res.render tells router.get to render our 'edit-product.ejs' page. Then it gives it a JavaScript object filled with keynames that have data assigned to them.
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product', // this is the path the user types in the browser address
        editing: false // this sets the editing parameter to 'false' which means you will not be in 'editMode' as defined in getEditProduct so the 'Add Product' button is then displayed.
    });
};

// this next functions exports 'postAddProduct' to our routes/admin.js file
exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(null, title, imageUrl, description, price); // the const 'product' becomes a new local constant and it is filled with data from the Product class. Pulled from the body and filled with the title and other info entered by the user. It becomes our product array.
    console.log(product, " will be added to the array"); // lets me see in the console what is added to the array.
    product.save(); // we use the save() function to load the freshly filled 'product' constant to the array.
    res.redirect('/'); // this redirects the user to '/' after extracting their input. redirect() is a built-in express function.
};

// this next functions exports 'getEditProduct' to our routes/admin.js file
exports.getEditProduct = (req, res, next) => {
    // res.render tells router.get to render our 'edit-product.ejs' page. Then it gives it a JavaScript object filled with keynames that have data assigned to them.
    const editMode = req.query.edit; // this says to look for a query in the url and look at the key/value pair for 'edit'. The key is 'edit' and if the value is 'true' then enable editing.
    if (!editMode) { // this says if it's not (!) editMode then send a response to redirect back to '/'.
        return res.redirect('/');
    }
    const prodId = req.params.productId; // this pulls the product id from the URL. That product id was added to the url in our routes/admin.js file on line 24.
    Product.findById(prodId, product => { // the parameter 'prodId' is sent to the Product model and then the found product is called back here to fill the 'product' parameter in this function.
        if (!product) { // this if statment says, if there is no (!) product then redirect to '/' and return out of this function.
            return res.redirect('/');
        }
    res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product', // this is the path the user types in the browser address
        editing: editMode,
        product: product
        });
    });
};

exports.postEditProduct = (req, res, next) => {
    // the following const's pulls the hidden value for name="productId" out of our hidden input on the edit-product.ejs. name="whateverTheNameIs" on the rest of the consts.
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    // the next const passa the updated values to our product.js model file.
    const updatedProduct = new Product(
        prodId,
        updatedTitle,
        updatedImageUrl,
        updatedDesc,
        updatedPrice
    );
    updatedProduct.save(); // this calls the save() function in our product.js model file and it should save everything and override the existing one.
    res.redirect('/admin/products'); // after the save() function the user is redirected to the '/admin/products' page.
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        console.log("called from admin.js ", products); // shows us all the objects in the array products
        // this response says to render a view using the shop.ejs template file that's the 1st argument. The 2nd argument {} is a javascript object and it's filled with JavaScript wariables.
        // In the JavaScript object we map it to a key name which we can then use in the template to refer to a keyname to refer to the data we are passing in.
        // in the first line we use 'prods' as the keyword for the data from the 'products' const.
        res.render('admin/products', {
            prods: products, // keyname is 'prods' for the value of our 'products' array which is defined above with global scope. All the rest follow the same syntax.
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    });
};

// the following exports deletes a product
exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId); // the function deleteById() is found in the models/product.js file.
    res.redirect('/admin/products');
};