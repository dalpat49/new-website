const express = require("express");
const fs = require("fs");
const mongo = require("mongo");
const path = require("path");
const multer = require("multer");
const cookieparser = require("cookie-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const route = express.Router();
const session = require("express-session");
const user = require("../models/userModel");
const product = require("../models/productModel");
const review = require("../models/productReviews");
const nodemailer = require("nodemailer");
const cart = require("../models/Cart");
const orders = require("../models/Deliverymodel");
const query = require("../models/customerQueriesmodel");
const hbs = require("nodemailer-express-handlebars");
const flash = require("connect-flash");
const subscribe = require("../models/newsLetter");
const coupan = require("../models/coupan");
require("dotenv").config();
const MongoStore = require('connect-mongo');
const admin = require("../models/adminModel");
const address = require("../models/addressModel");
const category = require("../models/categoryModel");

//multer setup
const storage = multer.diskStorage({
    destination: "static/img",
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

//uplaod image to database
const upload = multer({
    storage: storage,
});

//hashed password
async function securedPassword(password) {
    try {
        let passwordHash = await bcrypt.hash(password, 4);
        return passwordHash;
    } catch (err) {
                return res.status(400).render("errorPage");
;
    }
}

//setup middlewares
const app = express();
route.use(cookieparser());
route.use(express.urlencoded({ extended: true }));
route.use(express.static("./static"));
app.set("view engine", `pug`);
app.set(`views`, path.join(__dirname, `views`));
route.use(flash());
mongoose.set("strictQuery", false);


//database connections
const url = process.env.DB;
mongoose
    .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("connection successfull to database");
    })
    .catch((err) =>  res.status(400).send("error occured"));

//session setup
route.use(
    session({
        store: MongoStore.create({ mongoUrl:url}),
        secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
        saveUninitialized: true,
        resave: true,
        cookie: {
            secure: false,
            maxAge: 8*60*60*1000 ,
        },
    })
);


//auth login
const isLogin = async (req, res, next) => {
    try {
        if (req.session.user_sid) {
        } else {
            return res.redirect("/");
        }
        next();
    } catch (err) {
        res.status(400).send(err);
    }
};


//auth logout
const isLogout = async (req, res, next) => {
    {
        try {
            if (req.session.user_sid) {
                return res.redirect("/Home");
            }
            else{}
            next();
        } catch (err) {
                    return res.status(400).render("errorPage");
;
        }
    }
};

//admin login page
const isAdminLogin = async (req, res, next) => {
    try {
        if ( req.session.admin_id) { }
        else {
            return res.redirect("/")

        }
        next();
    }
    catch (err) {
                return res.status(400).render("errorPage");

    }
}
//Admin logout
const isAdminLogout = async (req, res, next) => {
    {
        try {
            if (req.session.admin_id) {
                return res.redirect("/Home")
            }
            next();
        }
        catch (err) {
                    return res.status(400).render("errorPage");

        }
    }
}


//Homem page
route.get("/", async (req, res) => {
    try {
        if (req.session.user_sid) {
            return res.redirect("/Home");
        } else {
            const new_categories = await category.aggregate([
                { $match: { status: "active" } },
            ]);
            const productDetails = await product
                .find({})
                .sort({ length: -1 })
                .limit(6);

            return res.render("index", {
                category: new_categories,
                products: productDetails,
            });
        }
    } catch (err) {
                return res.status(400).render("errorPage");
;
    }
});
//login form
route.get("/login", (req, res) => {
    try {
        if (req.session.user_sid) {
            return res.redirect("/Home");
        } else {
            const newMessage = req.flash("login");
            const newAlert = req.flash("alert");
            return res.render("login", { message: newMessage, alert: newAlert });
        }
    } catch (err) {
                return res.status(400).render("errorPage");
;
    }
});



//Dashboard
route.get("/Home", isLogin, async (req, res) => {
    try {
        const data = req.cookies.email;
        const userDetails = await user.findOne({ _id: data });
        const categories = await category.find({});
        const new_categories = await category.aggregate([
            { $match: { status: "active" } },
        ]);

        const productDetails = await product.find({}).sort({ length: -1 }).limit(6);
        const womenProducts = await product
            .find({ category: "Women" })
            .sort({ length: -1 })
            .limit(8);
        const cartdata = await cart.find({ user_id: data });
        var numberOfProductsInCart = 0;

        cartdata.forEach((e) => {
            numberOfProductsInCart = e.products.length;
        });
        categories.forEach((e) => {
            allsubcategories = e.subcategory;
        });

        const subscribeUser = req.flash("subscribed");
        res.render("Home", {
            userData: userDetails,
            category: new_categories,
            products: productDetails,
            womenproducts: womenProducts,
            productsInCart: numberOfProductsInCart,
            allsubcategories: allsubcategories,
            title: "G-ShOppers Home page",
            message: subscribeUser,
        });
    } catch (err) {
        return res.status(400).render("errorPage");
    }
});
//login data
route.post("/checkLogin", async (req, res) => {
    try {
        const userEmail = req.body.email;
        const userPassword = req.body.password;

        const isEmail = await user.findOne({ email: userEmail });
        const isPasswordMatch = await bcrypt.compare(userPassword, isEmail.password);
        if (!isEmail) {
            req.flash("login", "user not registered");
            req.flash("alert", "rose");
            return res.redirect("/login")

        } else {
            if (isPasswordMatch) {
                req.session.user_sid = isEmail._id;

                res.cookie("email", isEmail._id, { expire: 1000 * 60 * 60 * 24 });

                return res.redirect("/Home");
            } else {
                req.flash("login");
                req.flash("alert", "rose");
                req.flash("login", "Invalid email or password");
                return res.redirect('/login')

            }
        }
    } catch (err) {
        return res.status(400).render("errorPage");

    }
});

route.get("/error", (req, res) => {
    return   res.render("errorPage");
});

//forgot password page
route.get("/forgotPassword", isLogout,(req, res) => {
    try {
        return res.render("updatePassword", { title: "Forgot password page" });
    } catch (err) {
                return res.status(400).render("errorPage");
;
    }
});

//password updated
route.post("/passwordChange", async (req, res) => {
    try {
        const userEmail = req.body.email;
        const userPassword = req.body.password;
        const newHashedPassword = await securedPassword(userPassword);

        const newPassword = await user.updateOne(
            { email: userEmail },
            {
                $set: {
                    password: newHashedPassword,
                },
            }
        ).then(() => {

            return  res.render("login", {
                alert: "green",
                message: "password Updated",
            })
        });
    } catch (error) {
        return res.status(400).render("errorPage");

    }
});

//products by category
route.get("/category/:categoryName",isLogin, async (req, res) => {
    try {
        const data = req.cookies.email;
        const productCategory = req.params.categoryName;
        const userDetails = await user.findOne({ _id: data });
        const categories = await category.find({});
        const Subcategories = await category.find({
            categoryName: productCategory,
        });
        const new_categories = await category.aggregate([
            { $match: { status: "active" } },
        ]);

        const cartdata = await cart.find({ user_id: data });
        var numberOfProductsInCart = 0;
        cartdata.forEach((e) => {
            newCartData = e.products;
            numberOfProductsInCart = e.products.length;
        });
        const product_by_category = await product.find({
            category: productCategory,
        });

        Subcategories.forEach((e) => {
            allsubcategories = e.subcategory;
        });

        return res.render("productsByCategory", {
            userData: userDetails,
            categoryName: productCategory,
            category: new_categories,

            productsInCart: numberOfProductsInCart,
            productsByCategory: product_by_category,
            allsubcategories: allsubcategories,
            title: `Products by ${productCategory} G-Shoppers`,
        });
    } catch (err) {
        return res.status(400).render("errorPage");

    }
});

//filter products by price in category
route.get(
    "/category/:categoryName/productByRangeInCategory",isLogin,
    async (req, res) => {
        try {
            const data = req.cookies.email;
            const productCategory = req.params.categoryName;
            const userDetails = await user.findOne({ _id: data });
            const categories = await category.find({});
            const Subcategories = await category.find({
                categoryName: productCategory,
            });
            const new_categories = await category.aggregate([
                { $match: { status: "active" } },
            ]);

            const cartdata = await cart.find({ user_id: data });
            var numberOfProductsInCart = 0;
            cartdata.forEach((e) => {
                newCartData = e.products;
                numberOfProductsInCart = e.products.length;
            });

            Subcategories.forEach((e) => {
                allsubcategories = e.subcategory;
            });

            const priceRangeId = req.params.categoryName;

            const pricefromcustomer = req.query.priceRange;
            const priceRange = await product.find({
                $and: [
                    { category: priceRangeId },
                    { price: { $gt: 0, $lt: pricefromcustomer } },
                ],
            });

            return res.render("productsByPriceRange", {
                userData: userDetails,
                categoryName: productCategory,
                category: new_categories,
                productsInCart: numberOfProductsInCart,
                productsByRange: priceRange,
                allsubcategories: allsubcategories,
                title: "Products by price range in G-shoppers",
            });
        } catch (err) {
            return res.status(400).render("errorPage");

        }
    }
);

//allproducts by price
route.get("/products/productByRangeInCategory",isLogin, async (req, res) => {
    try {
        const data = req.cookies.email;
        const productCategory = req.params.categoryName;
        const userDetails = await user.findOne({ _id: data });
        const categories = await category.find({});

        const new_categories = await category.aggregate([
            { $match: { status: "active" } },
        ]);

        const cartdata = await cart.find({ user_id: data });
        var numberOfProductsInCart = 0;
        cartdata.forEach((e) => {
            newCartData = e.products;
            numberOfProductsInCart = e.products.length;
        });
        var allsubcategories;

        const pricefromcustomer = req.query.priceRange;
        const priceRange = await product.find({
            price: { $gt: 0, $lt: pricefromcustomer },
        });

        return res.render("allPoruductsByPrice", {
            userData: userDetails,
            categoryName: productCategory,
            category: new_categories,
            productsInCart: numberOfProductsInCart,
            productsByRange: priceRange,
            title: "Products by price range in G-shoppers",

        });
    }
    catch (err) {
        return res.status(400).render("errorPage");

    }
});

//pruducts by size in a category
route.get("/categories/:categoryName/",isLogin, async (req, res) => {
    try {
        const data = req.cookies.email;
        const productCategory = req.params.categoryName;
        const userDetails = await user.findOne({ _id: data });
        const categories = await category.find({});
        const Subcategories = await category.find({
            categoryName: productCategory,
        });
        const new_categories = await category.aggregate([
            { $match: { status: "active" } },
        ]);

        const cartdata = await cart.find({ user_id: data });
        var numberOfProductsInCart = 0;
        cartdata.forEach((e) => {
            newCartData = e.products;
            numberOfProductsInCart = e.products.length;
        });
        const product_by_category = await product.find({
            category: productCategory,
        });

        Subcategories.forEach((e) => {
            allsubcategories = e.subcategory;
        });
        const productBySize = req.params.categoryName;

        const sizeRange = await product.find({
            $and: [{ category: productBySize }, { size: req.query.size }],
        });

        return  res.render("productsBySize", {
            userData: userDetails,
            categoryName: productCategory,
            category: new_categories,
            productsInCart: numberOfProductsInCart,
            productsBySize: sizeRange,
            allsubcategories: allsubcategories,
            title: "Products by size in G-shoppers",

        });
    } catch (err) {
        return res.status(400).render("errorPage");

    }
});


//all products by sizxe range
route.get("/productsBySize/",isLogin, async (req, res) => {
    try {
        const data = req.cookies.email;
        const productCategory = req.params.categoryName;
        const userDetails = await user.findOne({ _id: data });
        const categories = await category.find({});
        const Subcategories = await category.find({
            categoryName: productCategory,
        });
        const new_categories = await category.aggregate([
            { $match: { status: "active" } },
        ]);

        const cartdata = await cart.find({ user_id: data });
        var numberOfProductsInCart = 0;
        cartdata.forEach((e) => {
            newCartData = e.products;
            numberOfProductsInCart = e.products.length;
        });
        const product_by_category = await product.find({
            category: productCategory,
        });

        Subcategories.forEach((e) => {
            allsubcategories = e.subcategory;
        });
        const productBySize = req.params.categoryName;

        const sizeRange = await product.find({ size: req.query.size });

        return res.render("allPoruductsBySize", {
            userData: userDetails,
            categoryName: productCategory,
            category: new_categories,
            productsInCart: numberOfProductsInCart,
            productsBySize: sizeRange,
        });
    } catch (err) {
        return res.status(400).render("errorPage");

    }
});

//subscripton users
route.post("/subscription/to/G-Shoppers/", async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const checkUser = await subscribe.findOne({ email: email });
        if (checkUser) {
            req.flash("subscribed", "You have already subscribed.");
            return res.redirect("/Home");
        } else {
            const newSubscriber = new subscribe({
                name: name,
                email: email,
            });
            const subscribed = await newSubscriber.save().then(() => {
                req.flash("subscribed", "Thanks for Subscription");
                return res.redirect("/Home");
            });
        }
    } catch (err) {
        return res.status(400).render("errorPage");

    }
});

//order history
route.get("/orderHistory",isLogin, async (req, res) => {
    try {
        const data = req.cookies.email;
        const productCategory = req.params.categoryName;
        const userDetails = await user.findOne({ _id: data });
        const categories = await category.find({});
        const Subcategories = await category.find({
            categoryName: productCategory,
        });
        const new_categories = await category.aggregate([
            { $match: { status: "active" } },
        ]);

        const cartdata = await cart.find({ user_id: data });
        var numberOfProductsInCart = 0;
        cartdata.forEach((e) => {
            newCartData = e.products;
            numberOfProductsInCart = e.products.length;
        });
        const product_by_category = await product.find({
            category: productCategory,
        });
        var productNamess;
        var productPricess;
        var productQuantitys;
        var orderHistory;
        const allOrders = await orders.find({customer_email: userDetails.email });
        allOrders.forEach((e) => {
            orderHistory = e.product_details;
            orderHistory.forEach((e) => {
                productNamess = e.product_Name;
                productPricess = e.product_price;
                productQuantitys = e.product_quantity;
            });

        });


        return  res.render("orderHistory", {
            userData: userDetails,
            categoryName: productCategory,
            category: new_categories,
            productsInCart: numberOfProductsInCart,
            allorders: allOrders,

            productname: productNamess,
            productPrices: productPricess,
            productQuantity: productQuantitys,
            title: "User order history",

        });
    }
    catch (err) {
                return res.status(400).render("errorPage");


    }
});

//Shop page
route.get("/shop",isLogin, async (req, res) => {
    try {
        const data = req.cookies.email;
        const userDetails = await user.findOne({ _id: data });
        const new_categories = await category.aggregate([
            { $match: { status: "active" } },
        ]);

        const cartdata = await cart.find({ user_id: data });
        var numberOfProductsInCart = 0;
        cartdata.forEach((e) => {
            newCartData = e.products;
            numberOfProductsInCart = e.products.length;
        });
        const allProducts = await product
            .find({ price: { $exists: 1 } })
            .sort({ price: 1 });

            return  res.render("shop", {
            userData: userDetails,
            category: new_categories,
            allProducts: allProducts,
            productsInCart: numberOfProductsInCart,
            title: "Shopping page",

        });
    } catch (err) {
        return res.status(400).render("errorPage");

    }
});

// Detail page
route.get("/product_detail/:id",isLogin, async (req, res) => {
    try {
        const data = req.cookies.email;
        const product_id = req.params.id;
        const userDetails = await user.findOne({ _id: data });
        var productReviewsNumber = 0;
        const product_details = await product.findOne({ _id: product_id }).limit(1);
        productReviewsNumber = await review.count({ productId: product_id });
        const productReviews = await review.findOne({ productId: product_id }).sort({ length: -1 }).limit(1) || 0;
        const new_categories = await category.aggregate([{ $match: { status: "active" } }]);
        const cartdata = await cart.find({ user_id: data });
        var numberOfProductsInCart = 0;
        cartdata.forEach((e) => {
            newCartData = e.products;
            numberOfProductsInCart = e.products.length;
        });

        return res.render("detail", {
            userData: userDetails,
            productDetails: product_details,
            numberOfReviews: productReviewsNumber,
            review: productReviews,
            category: new_categories,
            productsInCart: numberOfProductsInCart,
            title: "Products Detail",

        });
    } catch (err) {
        return res.status(400).render("errorPage");
        

    }
});

//review about the product
route.post(
    "/customerReviews",
    upload.single("reviewImage"),
    async (req, res) => {
        try {
            const customerId = req.body.customerId;
         
            const productId = req.body.productId;
            
            const productName = req.body.productName;
            const customerImage = req.file.filename;
           

            const new_review = new review({
                review: req.body.review,
                name: req.body.name,
                email: req.body.email,
                customerId: customerId,
                image: customerImage,
                productname: productName,
                productId: productId,
                date: Date.now(),
            });

            const reviewAdded = await new_review.save().then(() => {
                return  res.redirect("/Home");
            });
        } catch (error) {
            return res.status(400).render("errorPage");

        }
    }
);

//shoopig cart page
route.post("/addToCart", async (req, res) => {
    try {
        const data = req.cookies.email;
        const productID = req.body.productId;
        const userDetails = await user.findOne({ _id: data });
        const categories = await category.find({});

        let user_id = userDetails._id;
        let Cart = await cart.findOne({ user_id: userDetails._id });
        if (Cart) {
            //cart exists for user
            let product_id_exists = await cart.findOne({
                "products.product_id": productID,
            });

            if (product_id_exists) {
                //product exists in the cart, update the quantity

                cart
                    .updateOne(
                        {
                            user_id: userDetails._id,
                            "products.product_id": req.body.productId,
                        },
                        {
                            $set: {
                                "products.$.product_quantity": req.body.quantity,
                                "products.$.product_size": req.body.sizes,
                            },
                        }
                    )
                    .then(() => {
                        return res.redirect("/cart");
                    });
            } else {
                //product does not exists in cart, add new item
                Cart.products.push({
                    product_id: req.body.productId,
                    product_quantity: req.body.quantity,
                    product_name: req.body.productName,
                    product_price: req.body.productPrice,
                    product_size: req.body.sizes,
                });

                updatedCart = await Cart.save();
                // res.render("cart",{userDetails,category:categories,product_data:Cart.products})
                res.redirect("/cart");
            }
        } else {
            //no cart for user, create new cart
            const newCart = new cart({
                user_id: userDetails._id,
                products: [
                    {
                        product_id: req.body.productId,
                        product_quantity: req.body.quantity,
                        product_name: req.body.productName,
                        product_price: req.body.productPrice,
                        product_size: req.body.size,
                    },
                ],
            })
                .save()
                .then(() => {
                    return     res.redirect("/cart");
                });
        }
        
    } catch (err) {
        return res.status(400).render("errorPage");
        

    }
});

//cart
route.get("/cart",isLogin, async (req, res) => {
    try {
        const data = req.cookies.email;
        var newCartData;
        const userDetails = await user.findOne({ _id: data });
        const new_categories = await category.aggregate([
            { $match: { status: "active" } },
        ]);

        const cartdata = await cart.find({ user_id: data });
        var numberOfProductsInCart = 0;
        cartdata.forEach((e) => {
            newCartData = e.products;
            numberOfProductsInCart = e.products.length;
        });
        let message = req.flash("message");
        return  res.render("cart", {
            userData: userDetails,
            category: new_categories,
            product_data: newCartData,
            productsInCart: numberOfProductsInCart,
            message: message,
            title: "Product cart",

        });
    } catch (err) {
        return res.status(400).render("errorPage");

    }
});

//delete product from cart
route.get("/dltProductFromCart/:id",isLogin, async (req, res) => {
    try {
        const dltProductId = req.params.id;
        const cartdata = await cart.find({ user_id: req.cookies.email });

        const dlt_product = await cart
            .updateOne(
                { user_id: req.cookies.email },
                {
                    $pull: {
                        products: {
                            product_id: dltProductId,
                        },
                    },
                }
            )
            .then(() => {
                req.flash("message", "product deleted");
                return res.redirect("/cart");
            });
    } catch (err) {
        return res.status(400).render("errorPage");

    }
});

//apply coupan
route.get("/coupanCheckIfValidForProducts", async (req, res) => {
    try {
        const coupancode = req.query.coupan_code;
        const coupanMatch = await coupan.findOne({ coupan_code: coupancode });
        return   res.redirect("/cart");
    } catch (err) {
        return res.status(400).render("errorPage");

    }
});

//Shop page
route.get("/checkout",isLogin, async (req, res) => {
    try {
        const data = req.cookies.email;
        const userDetails = await user.findOne({ _id: data });
        const new_categories = await category.aggregate([
            { $match: { status: "active" } },
        ]);

        const cartdata = await cart.find({ user_id: data });
        var numberOfProductsInCart = 0;
        cartdata.forEach((e) => {
            newCartData = e.products;
            numberOfProductsInCart = e.products.length;
        });

        return   res.render("checkout", {
            userData: userDetails,
            category: new_categories,
            productsInCart: numberOfProductsInCart,
            product_data: newCartData,
            title: "Checkout page ",

        });
    } catch (err) {
        return res.status(400).render("errorPage");

    }
});

//Customer orders deatils
route.post("/customerDeliveryAddress", async (req, res) => {
    try {
        const userCartData = await cart.find({ user_id: req.cookies.email });
        const product_names = req.body.productName;
        const product_prices = req.body.productPrize;
        const product_quanties = req.body.productQuantity;
        const customer_name = req.body.name;
        const customer_email = req.body.email;
        const customer_number = req.body.number;
        const customer_addressLine1 = req.body.address_line1;
        const customer_addressLine2 = req.body.address_line2;
        const customer_city = req.body.city;
        const customer_state = req.body.state;
        const customer_country = req.body.country;
        const customer_zipcode = req.body.zipcode;
        const product_NAME = req.body.productName;
        const product_PRICE = req.body.productPrize;
        const product_QUANTITY = req.body.productQuantity;
        const subtotalAmount = req.body.subtotal;
        const shipping = req.body.shipping_charge_of_all_products;
        const totalAmount = req.body.total_ammount_of_all_products;

        const ordersDetails = new orders({
            order_id: "order#",
            customer_name: req.body.name,
            customer_email: req.body.email,
            customer_number: req.body.number,
            customer_addressLine1: req.body.address_line1,
            customer_addressLine2: req.body.address_line2,
            customer_country: req.body.country,
            customer_city: req.body.city,
            customer_state: req.body.state,
            customer_zipcode: req.body.zipcode,
            subtotal_of_products: req.body.subtotal,
            shipping_charge: req.body.shipping_charge_of_all_products,
            total_ammount: req.body.total_ammount_of_all_products,
            method_of_payment: req.body.mode,
            product_details: [
                {
                    product_Name: req.body.productName,
                    Product_size: req.body.productSize,
                    product_price: req.body.productPrize,
                    product_quantity: req.body.productQuantity,
                },
            ],
            date: Date.now(),
        });
        const customerDeliveryAddressAdded = await ordersDetails
            .save()
            .then(async () => {
                const updateCartAfterDelivery = await cart
                    .updateOne(
                        { user_id: req.cookies.email },
                        {
                            $pull: {
                                products: {},
                            },
                        }
                    )
                    .then(() => {
                        var transporter = nodemailer.createTransport({
                            service: "gmail",
                            auth: {
                                user: "herobanna1@gmail.com",
                                pass: "ybqiwyoddfdkbrng",
                            },
                        });

                        const handlebarOptions = {
                            viewEngine: {
                                partialsDir: path.resolve("./views/"),
                                defaultLayout: false,
                            },
                            viewPath: path.resolve("./views/"),
                        };

                        transporter.use("compile", hbs(handlebarOptions));

                        var mailOption = {
                            from: "herobanna1@gmail.com",
                            to: req.cookies.email,
                            subject: "to check the nodemailer",
                            text: `this  is a email using nodemailer`,
                            template: "invoiceEmail",
                            context: {
                                customer_name: customer_name,
                                customer_email: customer_email,
                                customer_number: customer_number,
                                customer_addressLine1: customer_addressLine1,
                                customer_addressLine2: customer_addressLine2,
                                customer_city: customer_city,
                                customer_state: customer_state,
                                customer_country: customer_country,
                                customer_zipcode: customer_zipcode,
                                product_Name: product_NAME,
                                product_quantity: product_QUANTITY,
                                product_price: product_PRICE,
                                subtotal_of_products: subtotalAmount,
                                shipping_charge: shipping,
                                total_ammount: totalAmount,
                            },
                        };

                        transporter.sendMail(mailOption, function (err, info) {
                            if (err) {
                               console.log(err);
;
                            } else {
                                console.log(`email sent :` + info.response);
                            }
                        });

                       
                        return  res.redirect("/orderDone");
                    });
            });
    } catch (err) {
        return res.status(400).render("errorPage");

    }
});

route.get("/orderDone", (req, res) => {
    try{
    return  res.render("orderSucess")
    }
    catch(err)
    {
        return res.status(400).render("errorPage");

    }
})

//email template
route.get("/invoice", async (req, res) => {
    return   res.render("invoiceEmail");
});

//contact page
route.get("/contact", isLogin,async (req, res) => {
    try {
        const data = req.cookies.email;
        const userDetails = await user.findOne({ _id: data });
        const new_categories = await category.aggregate([
            { $match: { status: "active" } },
        ]);
        const cartdata = await cart.find({ user_id: data });
        var numberOfProductsInCart = 0;
        cartdata.forEach((e) => {
            newCartData = e.products;
            numberOfProductsInCart = e.products.length;
        });
        const messageSent = req.flash("querySent");
        return res.render("contact", {
            userData: userDetails,
            category: new_categories,
            productsInCart: numberOfProductsInCart,
            message: messageSent,
            title: "Contact page",

        });
    } catch (err) {
        return res.status(400).render("errorPage");

    }
});

//customer queries
route.post("/customerQueries", async (req, res) => {
    try {
        const userDetails = await user.findOne({ _id: req.cookies.id });

        const new_query = new query({
            customer_name: req.body.name,
            customer_email: req.body.email,
            customer_subject: req.body.subjectOfQuery,
            customer_message: req.body.Query,
        });
        const querySent = await new_query.save().then(() => {
            var transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "herobanna1@gmail.com",
                    pass: "ybqiwyoddfdkbrng",
                },
            });

            var mailOption = {
                from: "herobanna1@gmail.com",
                to: req.body.email,
                subject: "For your query confirmation",
                text: `Your query has been sent to the company. Your query is "${req.body.Query}". We are sorry for your inconvinence and our support team will come to your query and try to solve it as soon as possible. 
                    Team G-Shoppers.`,
            };
            transporter.sendMail(mailOption, function (err, info) {
                if (err) {
                   console.log(err)
;
                } else {
                    console.log(`email sent :` + info.response);
                }
            });
            req.flash("querySent", "Your message sent successfully.");
            return res.redirect("/contact");
        });
    } catch (err) {
        return res.status(400).render("errorPage");

    }
});

//register page
route.get("/register", isLogout, (req, res) => {
    try {
       
       return res.render("registration");
    } catch (err) {
        return res.status(400).render("errorPage");

    }
});

//new User registration route
route.post(
    "/newUserRegistration",
    upload.single("userImage"),
    async (req, res) => {
        try {
            const passwordByUser = req.body.password;
            new_Hased_Password = await securedPassword(passwordByUser);
            const email_already_registerd = await user.findOne({
                email: req.body.email,
            });
            if (email_already_registerd) {
                return res.render("registration", {
                    alert: "rose",
                    message: "User already registered.Please Login.",
                });
            } else {
                const newUser = new user({
                    fullname: req.body.name,
                    email: req.body.email,
                    number: req.body.number,
                    addressLine1: req.body.addressline1,
                    addressLine2: req.body.addressline2,
                    country: req.body.country,
                    state: req.body.state,
                    city: req.body.city,
                    zipcode: req.body.zipcode,
                    password: new_Hased_Password,
                    photo: req.file.filename,
                });
                const user_registered = await newUser.save().then(() => {
                  
                    req.flash("alert", "green");
                    req.flash("login", "new user registered");
                    return res.redirect("/login");
                });
            }
        } catch (err) {
            return res.status(400).render("errorPage");

        }
    }
);




//userProfile page
route.get("/userProfile", isLogin, async (req, res) => {
    try {
        const data = req.cookies.email;
        const userDetails = await user.findOne({ _id: data });
        const new_categories = await category.aggregate([
            { $match: { status: "active" } },
        ]);

        const cartdata = await cart.find({ user_id: data });
        var numberOfProductsInCart = 0;
        cartdata.forEach((e) => {
            newCartData = e.products;
            numberOfProductsInCart = e.products.length;
        });
        return res.render("userProfile", {
            userData: userDetails,
            category: new_categories,
            productsInCart: numberOfProductsInCart,
            title: "User profile page",

        });
    } catch (err) {
        return res.status(400).render("errorPage");

    }
});

//update USER profile
route.get("/updatdeUserProfile/:id",isLogin, async (req, res) => {
    try {
        const data = req.params.id;
        const userDetails = await user.findById({ _id: data });
        const new_categories = await category.aggregate([
            { $match: { status: "active" } },
        ]);

        const cartdata = await cart.find({ user_id: data });
        var numberOfProductsInCart = 0;
        cartdata.forEach((e) => {
            newCartData = e.products;
            numberOfProductsInCart = e.products.length;
        });
        const newProfileMessage = req.flash("userMessage");

        return    res.render("updateUserProfile", {
            userData: userDetails,
            category: new_categories,
            productsInCart: numberOfProductsInCart,
            title: "Update user profile page",
            message: newProfileMessage,

        });
    } catch (err) {
        return res.status(400).render("errorPage");

    }
});

//updating user data
route.post(
    "/updatedUserProfile",isLogin,
    upload.single("userImage"),
    async (req, res) => {
        let new_image = "";
        let userId = req.body.userID;
        try {
            
            const updatedData = await user
                .updateMany(
                    { _id: userId },
                    {
                        $set: {
                            fullname: req.body.name,
                            number: req.body.number,
                            addressLine1: req.body.addressline1,
                            addressLine2: req.body.addressLine2,
                            city: req.body.city,
                            state: req.body.state,
                            country: req.body.country,
                            zipcode: req.body.zipcode,
                            photo: req.file.filename,
                        },
                    }
                )
                .then(() => {
                    return res.redirect("/userProfile");
                });
        } catch (err) {
            return res.status(400).render("errorPage");

        }
    }
);

//change user password
route.post("/changeUserPassword/:id", async (req, res) => {
    try {

        const userID = req.params.id;
        const confirmUserPassword = req.body.confirmPassword;
        const userPasswordHasshed = await securedPassword(confirmUserPassword)
        const updatePasswordOfUser = await user.findByIdAndUpdate({ _id: userID }, {
            $set: {
                password: userPasswordHasshed,
            }
        }).then(() => {
            req.flash("userMessage", "Password has been changed successfully.")
            return  res.redirect("/userProfile")
        })

    } catch (err) {
        return res.status(400).render("errorPage");

    }
});

//logout
route.get("/logout", isLogin, async (req, res) => {
    try {
        req.session.destroy();
        res.clearCookie("email");
        res.clearCookie("id");
        res.clearCookie("connect.sid");
        res.clearCookie("user_sid");
        res.redirect("/");
    } catch (err) {
        return res.status(400).render("errorPage");

    }
});





//********************************************admin  pages************ */
//admin Login page
route.get("/    ", (req, res) => {
    if (req.session.admin_id) {
        return res.redirect("/admin/adminHome");
    } else {
        return res.render(`adminLogin`)
    }

});

//adminlogincheck
route.post("/admin/adminLoginCheck" , async(req, res) => {

    try {
        const email = req.body.email;
        const password = req.body.password;
        const adminEmail = await admin.findOne({email:email});
        const adminPasswordMatch =  await bcrypt.compare(password, adminEmail.password)
 
                if(adminPasswordMatch){
                     req.session.admin_id = email
                     res.cookie("id", adminEmail._id, { expire: 1000 * 60 * 60 * 24 });
                     
                     return res.redirect('/admin/adminHome')
                    
                }
                else
                {
                    return res.render("adminLogin",{
                        type:"red",
                        err:"Invalid email or password"
                    })
                }

   
    }
    
      
    
    catch (err) {
                return res.status(400).render("errorPage");
;
    }


});


//new adminRegistration
route.get("admin/newAdminRegistration", isAdminLogin ,async(req,res)=>{
    try{
    const admin_data= await admin.findOne({_id:req.cookies.id});

    return  res.render("adminRegistration",{adminDetails:admin_data})
    }
    catch(err){
        return res.status(400).render("errorPage");

    }
});

//new admin registration
route.post("/admin/addNewAdmin",isAdminLogin,upload.single("adminImage"),async(req,res)=>{
    const adminPassword = req.body.password;
    const newHashedPasswordForAdmin = await securedPassword(adminPassword)
    try{

        const newadmin = new admin({
            name:req.body.name,
            email:req.body.email,
            number:req.body.number,
            company:req.body.Company,
            role:"admin",
            password:newHashedPasswordForAdmin,
            image:req.file.filename
        })

        const newAdminRegistered = await newadmin.save().then(()=>{
            
            return    res.redirect("/admin/adminProfile")
           
        })

    }
    catch(err)
    {
                return res.status(400).render("errorPage");

    }
});

//update admin password
route.post("/admin/updateAdminPassword",isAdminLogin,async(req,res)=>{
    try{
        const adminEmail = req.body.passswordEmail;
        const  adminPassword = req.body.Cpassword;
        const new_admin_updated_hassed_password = await securedPassword(adminPassword);
        const adminPasswordUpdteId = req.cookies.id;
        const adminUpdatePassword = await admin.findByIdAndUpdate({_id:adminPasswordUpdteId},{
            $set:{
                password:new_admin_updated_hassed_password,
            }
        }).then(()=>{
            return     res.redirect("/admin/admin/adminProfile")
        })
        

    }
    catch(err)
    {
                return res.status(400).render("errorPage");

    }
});

//admin home page
route.get("/admin/adminHome", isAdminLogin, async (req, res) => {
    try {
        const mydata = await user.find({});
        const customerCount = await user.count({});
        const productCount = await product.count({});
        const categoryCount = await category.count({});
        const ordersCount = await orders.count({});
        const admin_data= await admin.findOne({_id:req.cookies.id});
        const tenOrders = await orders.find({}).sort({ length: -1 }).limit(10);
        const ordersAll = await orders.aggregate([{$project:
            {year:{$year:"$date"},
            month:{$month:"$date"},
            date:{$dayOfMonth:"$date"}
        }}]);
        var orderID;
        var newOrderId;
        ordersAll.indexOf((e)=>{
          orderID= e.year + "" + e.month + ""+e.date;
        })
        

        return   res.render("adminHome", { x: mydata,
             customerNumber: customerCount,
              productNumber: productCount,
               categoryNumber: categoryCount ,
                adminDetails:admin_data,
                orders:ordersCount,
                orderID:newOrderId,
                tenOrders:tenOrders
            });
    }
    catch (err) {
                return res.status(400).render("errorPage");

    }




});

//admin profile
route.get("/admin/adminProfile",isAdminLogin,async(req,res)=>{
    try{
        const admin_profile  = await admin.findOne({_id:req.cookies.id});

        return   res.render("adminProfile",{
            admin:admin_profile,

        })

    }
    catch(err)
    {
                return res.status(400).render("errorPage");

    }
});


//update admin profile
route.post("/admin/update_admin_profile",isAdminLogin,upload.single("admin_image"),async(req,res)=>{
    try{
        const adminId = req.cookies.id;
        admin_new_image = "";
        const admin_profile  = await admin.findOne({_id:req.cookies.id});

       
        const updatedAdmin = await  admin.findByIdAndUpdate({_id:adminId},{
            $set:{
                name:req.body.name,
                email:req.body.email,
                number:req.body.number,
                company:req.body.company,
                image:req.file.filename
            }
        }).then(()=>{
          

            return    res.render("adminProfile",{
                updateSuccess:"Admin succesfully updated"
            })
        })

    }
    catch(err)
    {
                return res.status(400).render("errorPage");

    }
})

//all customers/ user routes 
route.get("/admin/users",isAdminLogin, async (req, res) => {
    try {
        const mydata = await user.find({});
        const admin_data= await admin.findOne({_id:req.cookies.id});
        let allUsers = req.flash("user")
        return   res.render("users", { x: mydata,
            adminDetails:admin_data,message:allUsers })
    }
    catch (err) {
                return res.status(400).render("errorPage");

    }
})



//Add new user in admin dashboard
route.post('/admin/addNewUser',isAdminLogin, upload.single("image"), async (req, res) => {
    const fullname = req.body.name;
    const email = req.body.email;
    const number = Number(req.body.number);
   const addressLine1 = req.body.Addressline1; 
   const addressLine2 = req.body.Addressline2; 
   const city = req.body.City;
   const state = req.body.State;
   const country = req.body.Country;
   const zipcode = req.body.zipcode;
    let cpassword = req.body.cpassword;
     const photo = req.file.filename;

    let newPassword = await securedPassword(cpassword)
    const existEmail = await user.findOne({email:req.body.email});
    try {
        if (existEmail) {
            
            
            req.flash("user", "User already registered")
            return   res.redirect("/admin/users")
            
        }
        else {
            
                        const newUser = new user({
                            fullname: fullname,
                            email: email,
                            number: number,
                            addressLine1:addressLine1,
                            addressLine2:addressLine2,
                            country:country,
                            state:state,
                            city:city,
                            zipcode:zipcode,
                            password: newPassword,
                            status:req.body.radio,
                            photo: photo
                        });
            
                        const added = await newUser.save().then(() => {
                            
                              req.flash("user" , "New user added succesfully." )
                              return   res.redirect('/admin/users');
                        })
        }
    }
    catch (err) {
                return res.status(400).render("errorPage");

    }

});



//EditUser page in admin dashboard
route.get("/admin/editUser/:id",isAdminLogin, async (req, res) => {
    try {
        editUserId = req.params.id;
        const allData = await user.findOne({ _id: editUserId });
        const admin_data= await admin.findOne({_id:req.cookies.id});
        return   res.render("editUser", { UserDetails: allData, adminDetails:admin_data })
    }
    catch (err) {
                return res.status(400).render("errorPage");

    }
});

//user updated
route.post("/admin/updateUser",isAdminLogin, upload.single("image"), async (req, res) => {


    const id = req.body.userid;
     const fullname = req.body.name;
     const email = req.body.email;
     const number = req.body.number;
     const addressLine1 = req.body.Addressline1; 
     const addressLine2 = req.body.Addressline2; 
     const city = req.body.City;
     const state = req.body.State;
     const country = req.body.Country;
     const zipcode = req.body.zipcode;
    
 
     try {
        
         let updatedData = async (id) => {
             await user.findOneAndUpdate({ _id: id },
                 {
                     $set: {
                         fullname: fullname,
                         email: email,
                         number: number,
                         addressLine1:addressLine1,
                         addressLine2:addressLine2,
                         country:country,
                         state:state,
                         city:city,
                         zipcode:zipcode,
                         photo:req.file.filename,
                     }
                 }).then(() => {
                     
                       req.flash("user","User Updated successfully")
                       return  res.redirect("/admin/users")
                 })
         }
         updatedData(id);
     }
     catch (error) {
        // return res.status(400).send(error);
        console.log(error)

     }
 
 
 
 });


 //delete user from admin dashboard
route.get("/admin/dltUser/:id",isAdminLogin, async (req, res) => {
    dltid = req.params.id;

    try {
        
        await user.findByIdAndDelete({ _id: dltid }).then(() => {
            req.flash("user","User removed successfully")

            return res.redirect("/admin/users");
        })
    }


    catch (err) {
                return res.status(400).render("errorPage");

    }
});


//chnage user status in admin dashboard
route.get("/admin/changeStatusOfUser/:id",isAdminLogin ,async(req,res)=>{
    try{
        const changeUserStatus = req.params.id;
      
        const change_user_status = await user.findById({_id:changeUserStatus});
        if(change_user_status.status === "active"){
            const deactiveStatus = await user.updateOne({_id:changeUserStatus},{
                $set:{
                    status:"deactivate"
                }
            }).then(()=>{
                req.flash("user", "Status Changed")

                return  res.redirect("/admin/users")

            })
        }
        else{

            let  activeStatus = await user.updateOne({_id:changeUserStatus},{
                $set:{
                    status:"active"
                }
            }).then(()=>{
                req.flash("user", "Status Changed")
                return  res.redirect("/admin/users")
            })
        }
    }
    catch(err)
    {
                return res.status(400).render("errorPage");

    }
});


//change the users password  in admin dashboard
route.post("/admin/changeUserPassword",isAdminLogin,async(req,res)=>{
    try{
        const changePasswordOfUser =  req.body.UserID;
        const cnfrmPassword = req.body.confirmPassword;
        const new_password_of_user = securedPassword(cnfrmPassword);
        const newUpdatedPassword = await user.findByIdAndUpdate({_id:changePasswordOfUser},{
            $set:{
                password:new_password_of_user,
            }
        }).then(()=>{
            req.flash("user","Password updated successfully")
            return  res.redirect("/admin/users")
        })
    }
    catch(err)
    {
                return res.status(400).render("errorPage");

    }
});


//retirving all addresses in admin dashboard
route.get("/admin/userAllAddress/:email",isAdminLogin, async (req, res) => {
    try {
        const userAddressId = req.params.email;
        const addressData = await address.find({ email: userAddressId });
        const admin_data= await admin.findOne({_id:req.cookies.id});

        return  res.render(`userAddress`, { allAddress: addressData,  adminDetails:admin_data })
    }
    catch (err) {
                return res.status(400).render("errorPage");

    }
});

//deleting a address in admin dashboard
route.get("/admin/dltAddress/:id",isAdminLogin, async (req, res) => {
    const dltAddressId = req.params.id;
    try {
        await address.findByIdAndDelete({ _id: dltAddressId }).then(() => {
            return  res.redirect("/admin/adminHome")
        });

    }
    catch (err) {
                return res.status(400).render("errorPage");

    }
});

//updatating address page in admin dashnoard
route.get(`/admin/updateAddress/:id`, isAdminLogin,async (req, res) => {
    try {
        const updateAddressId = req.params.id;
        const addressData = await address.findById({ _id: updateAddressId });
                   const admin_data= await admin.findOne({_id:req.cookies.id});

                   return  res.render("updatingAddress", { updatingAddress: addressData ,   adminDetails:admin_data })
    }
    catch (err) {
                return res.status(400).render("errorPage");

    }

});

//updated address in admin dahsboard
route.post(`/admin/updatedAddress/`,isAdminLogin, async (req, res) => {
    const userId = req.body.userId;

    const housenumber = req.body.housenumber;
    const colony = req.body.colony;
    const landmark = req.body.landmark;
    const city = req.body.city;
    const District = req.body.district;
    const state = req.body.state;
    const zipcode = req.body.zipcode;

    try {
        address.findByIdAndUpdate({ _id: userId }, {
            housenumber: housenumber,
            colony: colony,
            landmark: landmark,
            city: city,
            district: District,
            state: state,
            zipcode: zipcode
        }).then(() => {
            return  res.redirect(`/admin/adminHome`);
        })
    }
    catch (err) {
                return res.status(400).render("errorPage");
;
    }

});


// add new address in admin  panel
route.post("/admin/addNewAddress",isAdminLogin, async (req, res) => {

    const email = req.body.email;
    const housenumber = req.body.housenumber;
    const colony = req.body.colony;
    const landmark = req.body.landmark;
    const city = req.body.city;
    const District = req.body.district;
    const state = req.body.state;
    const zipcode = req.body.Zipcode;

    try {


        const newAddress = new address({
            email: email,
            housenumber: housenumber,
            colony: colony,
            landmark: landmark,
            city: city,
            district: District,
            state: state,
            zipcode: zipcode
        });

        const added = await newAddress.save().then(() => {
            return res.redirect('/admin/adminHome');
        });




    }
    catch (err) {
                return res.status(400).render("errorPage");

    }

});


//item category
route.get("/admin/admin/itemCategory", isAdminLogin,async (req, res) => {
    try {
        const categorys = await category.find({});
        const category_count = await category.count({})
        const admin_data= await admin.findOne({_id:req.cookies.id});

        return  res.render("itemCategory", { category: categorys,catCount:category_count,   adminDetails:admin_data  })
    }
    catch (err) {
                return res.status(400).render("errorPage");

    }
});
//allproducts in admin panel
route.get("/admin/allProducts",isAdminLogin, async (req, res) => {
    try {
        const all_product = await product.find({});
        const categorys = await category.find({});
        const admin_data= await admin.findOne({_id:req.cookies.id});

      return  res.render("allProducts", { products: all_product, category: categorys,   adminDetails:admin_data  })
    }
    catch (err) {
                return res.status(400).render("errorPage");

    }
});

route.get("/admin/addProduct",isAdminLogin, async (req, res) => {
    try {
        const categories = await category.find({});
        const admin_data= await admin.findOne({_id:req.cookies.id});
        const newProductNofification = req.flash("product")
        return  res.render("add_product", { category: categories,   adminDetails:admin_data ,message:newProductNofification });
    }
    catch (err) {
                return res.status(400).render("errorPage");

    }
});


//add new oproduct from admin panel
route.post("/admin/addedProduct",isAdminLogin, upload.array("productImage", 4), async (req, res) => {

    try {
        const { size } = req.body
        const body = (req.body, ['size'])


        const addProduct = new product({
            productName: req.body.productName,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            discription: req.body.description,
            additionalInformation:req.body.aditionalInformation,
            size: req.body.size || 0,
            image: req.files.map(file => file.filename),
            status: req.body.radio
        })

        const productSAdded = await addProduct.save().then(() => {
         
              req.flash("product","Product added")
           return res.redirect("/admin/allProducts");
        })

    }
    catch (err) {
                return res.status(400).render("errorPage");

    }


});

//update product fro admin panel
route.post("/admin/updatedProduct", isAdminLogin,upload.single("productImage"), async (req, res) => {
    
  
    try {
        
        const addProduct = new product({
            productName: req.body.productName,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            additionalInformation:req.body.aditionalInformation,
            discription: req.body.description,
            image: req.file.filename,
            status: req.body.radio
        })
        const productSAdded = await addProduct.save().then(() => {
            
            res.redirect("/admin/allProducts");
        })

    }
    catch (err) {
                return res.status(400).render("errorPage");

    }


});



//change product status 
route.get("/admin/changeStatus/:id", isAdminLogin,async(req,res)=>{
    try{
        const changeStatusId = req.params.id;
        const change_status = await product.findById({_id:changeStatusId});
        if(change_status.status === "active"){
            const deactiveStatus = await product.updateOne({_id:changeStatusId},{
                $set:{
                    status:"deactivate"
                }
            }).then(()=>{
                res.redirect("/admin/allProducts")

            })
        }
        else{

            let  activeStatus = await product.updateOne({_id:changeStatusId},{
                $set:{
                    status:"active"
                }
            }).then(()=>{
                res.redirect("/admin/allProducts")
            })
        }

    }
    catch(err)
    {
                return res.status(400).render("errorPage");

    }

});
//add new admin
route.post("/admin/addCategory",isAdminLogin, async (req, res) => {
    try {


        const additemcategory = new category({
            categoryName: req.body.Cname,
            category_id: req.body.Category_id,
            description: req.body.description,
            status:req.body.radio,
            subcategory: [{
                parent_id: req.body.Category_id,

                subcategory_name: req.body.subcategoryname,
            }]


        }).save().then(
            res.redirect("/admin/itemCategory")
        )


    }
    catch (err) {
                return res.status(400).render("errorPage");
;
    }
});








//change category status in  admin panel
route.get("/admin/changeCategoryStatus/:id",isAdminLogin,async(req,res)=>{

    try{
        const changeStatusOfCategory = req.params.id;
        const change_category_status = await category.findOne({_id:changeStatusOfCategory});
        
        if(change_category_status.status === "active"){
            const ChangeToDeactive = await  category.findByIdAndUpdate({_id:changeStatusOfCategory},{
                $set:{
                    status:"deactivate"
                }
            }).then(()=>{
                res.redirect("/admin/itemCategory")
            })
        }
        else
        {
            const toActive = await category.findByIdAndUpdate({_id:changeStatusOfCategory},{
                $set:{
                    status:"active"
                }
            }).then(()=>{
                res.redirect("/admin/itemCategory")
            })
        }



    }
    catch(err){
                return res.status(400).render("errorPage");

    }

});



//dlt caytegory in admin panel
route.get("/admin/dltCategory/:id",isAdminLogin, async (req, res) => {
    try {
        let dltId = req.params.id;
        const dltCategory = await category.findByIdAndDelete({ _id: dltId }).then(() => {
            res.redirect("/admin/itemCategory")
        })
    }
    catch (err) {
                return res.status(400).render("errorPage");

    }
});

//dlt product in admin panel
route.get("/admin/dltProduct/:id",isAdminLogin, async (req, res) => {
    try {
        let dltProductId = req.params.id;
        const dltProducts = await product.findByIdAndDelete({ _id: dltProductId }).then(() => {
            res.redirect("/admin/allProducts");
        });
    }
    catch (err) {
                return res.status(400).render("errorPage");

    }
})


//edit product in admin panel
route.get("/admin/editProduct/:id",isAdminLogin, async (req, res) => {
    try {
        const detailsProduct = await product.findOne({ _id: req.params.id })
        const categorys = await category.find({});
        const admin_data= await admin.findOne({_id:req.cookies.id});

        res.render("editProduct", { productDetails: detailsProduct, category: categorys ,   adminDetails:admin_data })
    }
    catch (err) {
        return res.status(400).render("errorPage");

    }
});

//products by category
route.get("/admin/allProducts/:id",isAdminLogin, async (req, res) => {
    try {
        let productId = req.params.id;

        const categorys = await category.find({});
        const newProducts = await product.find({ category: productId });
        const admin_data= await admin.findOne({_id:req.cookies.id});

        res.render("allProducts", { products: newProducts, category: categorys,   adminDetails:admin_data })
    }
    catch (err) {
                return res.status(400).render("errorPage");

    }
});

//edit category
route.get("/admin/editCategory/:id",isAdminLogin, async (req, res) => {
    try {

        const categorys = await category.findOne({ _id: req.params.id });
        const admin_data= await admin.findOne({_id:req.cookies.id});

        res.render("editCategory", { category: categorys,   adminDetails:admin_data })
    }
    catch (err) {
                return res.status(400).render("errorPage");

    }
});

//update category
route.post("/admin/updatedCategory", isAdminLogin,async (req, res) => {

    try {

        const id = req.body.id;
        const update = await category.findByIdAndUpdate({ _id: id }, {
            categoryName: req.body.Cname,
            category_id: req.body.Category_id,
            description: req.body.description,
            subcategory: [{
                parent_id: req.body.Category_id,
                subcategory_name: req.body.subcategory
            }]
        }).then(() => {
            res.redirect("/admin/itemCategory")
        })
    }
    catch (err) {
                return res.status(400).render("errorPage");

    }
});

//all subcatogires
route.get("/admin/allSubCategories/:id", isAdminLogin,async (req, res) => {
    try {
        var subcategory_all;
        const subcategoryId = req.params.id;
        const all_categories = await category.find({ _id: subcategoryId });
        const categories = await category.findById({ _id: subcategoryId });
        const admin_data= await admin.findOne({_id:req.cookies.id});

        all_categories.map((e) => {
            subcategory_all = e.subcategory;
        })
        res.cookie("product_id", subcategoryId, { expire: 1000 * 60 * 60 * 24 });

        res.render("subcategories", { category: all_categories, subcat: subcategory_all, cat: categories ,       adminDetails:admin_data});
    }
    catch (err) {
                return res.status(400).render("errorPage");

    }

});


//add new subcategory
route.post("/admin/addSubCategory",isAdminLogin, async (req, res) => {
    try {
        const catId = req.body.categoryId;
        // const new_id = JSON.stringify(catId)
        const subcat = await category.findById({ _id: catId });
        subcat.subcategory.push({
            parent_id: req.body.categoryID,
            subcategory_name: req.body.subcatname,
        })
        const updatedsubcat = await subcat.save().then(() => {


            res.redirect(`/admin/allSubCategories/${subcat._id}`)
        })
    }
    catch (err) {
                return res.status(400).render("errorPage");

    }
});

//delete subcategory
route.get("/admin/dltSubCategory/:id", isAdminLogin, async (req, res) => {
    try {
        const subcatID = req.params.id;
        const mainCategoryId = req.cookies.product_id;
        const dltSubCategory = await category.findOne({ _id: mainCategoryId });

        const dltsubcat = await category.updateOne({ _id: mainCategoryId }, {

            $pull: {
                subcategory: {
                    _id: subcatID
                }
            }
        }).then(() => {
            res.clearCookie("product_id");
            return res.redirect(`/admin/allSubCategories/${dltSubCategory._id}`)
        })
    }
    catch (err) {
                return res.status(400).render("errorPage");

    }
});

//review section
route.get("/admin/reviews", async (req, res) => {
    try {
        const allReviews = await review.find({})
        const admin_data= await admin.findOne({_id:req.cookies.id});

        res.render("reviews", { reviews: allReviews,   adminDetails:admin_data  });
    }
    catch (err) {
                return res.status(400).render("errorPage");

    }
});

//dlt any review
route.get("/admin/dltreview/:id", async (req, res) => {
    try {

        const dltReviewId = req.params.id;
        const dlt_Review = await review.findByIdAndDelete({ _id: dltReviewId }).then(() => {
            res.redirect("/admin/reviews")
        })
    }
    catch (err) {
        return res.status(400).render("errorPage");

    }
});

//all orders
route.get("/admin/allOrders", async (req, res) => {
    try {
        const allOrders = await orders.find({});
        const admin_data= await admin.findOne({_id:req.cookies.id});

        res.render("orders", { orders: allOrders,       adminDetails:admin_data})
    }
    catch (err) {
        return res.status(400).render("errorPage");

    }
});

//delete order 
route.get("/admin/dltOrder/:id",isAdminLogin, async (req, res) => {
    try {
        const dltOrderId = req.params.id;
        const dltOrders = await orders.findByIdAndDelete({ _id: dltOrderId }).then(() => {
            res.redirect("/admin/allOrders")
        })
    }
    catch (err) {
        return res.status(400).render("errorPage");

    }
});

//invoice
route.get("/admin/orders/invoice/:id",isAdminLogin, async (req, res) => {
    try {
        const invoiceId = req.params.id;
        const allOrders = await orders.findOne({ _id: invoiceId });
        const invoiceData = await orders.find({ _id: invoiceId });
        const admin_data= await admin.findOne({_id:req.cookies.id});

        var invoiceDetails;
        var productNames;
        var productPrice;
        var productQuantity;
        invoiceData.forEach((e) => {
            invoiceDetails = e.product_details;
            invoiceDetails.forEach((e) => {
                productNames = e.product_Name;
                productPrice = e.product_price;
                productQuantity = e.product_quantity;
            })
        })
        
        res.render("invoice", { orders: allOrders, invoiceData: invoiceDetails, productNames: productNames, productPrice: productPrice, productQuantity: productQuantity,   adminDetails:admin_data  })
    }
    catch (err) {
        return res.status(400).render("errorPage");

    }
});

//all Coupans
route.get("/admin/allCoupans",isAdminLogin,async(req,res)=>{
    try{
        const admin_data= await admin.findOne({_id:req.cookies.id});
        const all_coupans = await coupan.find({});
        const categorys = await category.find({});
        const newMessage = req.flash("coupanAdded")
        const coupans = await coupan.aggregate([{$project:
            {year:{$year:"$creation_date"},
            month:{$month:"$creation_date"},
            date:{$dayOfMonth:"$creation_date"}
        }}]);
        var coupanDate ;
        coupans.forEach((e)=>{
            coupanDate=e.date  + ":" + e.month + ":"+e.year;
          })
        res.render("allCoupans",{
            adminDetails:admin_data,
            allCoupan:all_coupans,
            coupan_dates:coupanDate,
            category:categorys,
            message:newMessage
        })
    }
    catch(err){
        return res.status(400).render("errorPage");

    }


})


//creating new cooupan
route.post("/admin/addNewCoupan",isAdminLogin, async(req,res)=>{
    try{
        const newCoupans = new coupan({
            coupan_code:req.body.coupanCode,
            coupan_description:req.body.coupanDescription,
            coupan_type:req.body.coupanType,
            coupan_ammount:req.body.coupanAmmount,
            coupan_category:req.body.category,
            creation_date: Date.now(),
            status:req.body.radio,
           
        })

        const coupanAdded = await newCoupans.save().then(()=>{
            req.flash("coupanAdded" , "newCoupanAdded");
            res.redirect("/admin/allCoupans")
        })

    }
    catch(err)
    {
        return res.status(400).render("errorPage");

    }
});


//coupan change status
route.get("/admin/changeCoupanStatus/:id",async(req,res)=>{
    try{
        const changeStatusOfCoupan = req.params.id;
        const change_coupan_status = await coupan.findOne({_id:changeStatusOfCoupan});
        
        if(change_coupan_status.status === "active"){
            const ChangeToDeactive = await  coupan.findByIdAndUpdate({_id:changeStatusOfCoupan},{
                $set:{
                    status:"deactivate"
                }
            }).then(()=>{
                req.flash("coupanAdded","Status updated")
                res.redirect("/admin/allCoupans")
            })
        }
        else
        {
            const toActive = await coupan.findByIdAndUpdate({_id:changeStatusOfCoupan},{
                $set:{
                    status:"active"
                }
            }).then(()=>{
                req.flash("coupanAdded","Status updated")
                res.redirect("/admin/allCoupans")
            })
        }



    }
    catch(err){
        return res.status(400).render("errorPage");

    }
});


//delete the coupan
route.get("/admin/dltCoupan/:id",async(req,res)=>{
    try{
        const dltCoupanId = req.params.id;
        const dlt_coupan = await coupan.findByIdAndDelete({_id:dltCoupanId}).then(()=>{
            req.flash("coupanAdded","Coupan deleted successfully.")
            res.redirect("/allCoupans")
        })

    }
    catch(err)
    {
        return res.status(400).render("errorPage");

    }
})


//coupans  by category
route.get("/admin/allCoupans/:id",isAdminLogin, async (req, res) => {
    try {
        let coupanId = req.params.id;

        const categorys = await category.find({});
        const newcoupans = await coupan.find({coupan_category: coupanId });
        const admin_data= await admin.findOne({_id:req.cookies.id});
        const newMessage = req.flash("coupanAdded")
        var newcoupanDate;
        newcoupans.forEach((e)=>{
           newcoupanDate=e.date  + ":" + e.month + ":"+e.year;
          })
        res.render("allCoupans",{
            adminDetails:admin_data,
            allCoupan:newcoupans,
            coupan_dates:newcoupanDate,
            category:categorys,
            message:newMessage
        })
    }
    catch (err) {
        return res.status(400).render("errorPage");

    }
});

//admin logout route
route.get("/adminLogout", isAdminLogin, (req, res) => {
    try {
        req.session.destroy();
        res.clearCookie("product_id");
        res.clearCookie("connection.sid");
        res.clearCookie("user_sid");
       
        res.clearCookie("id")
        res.redirect("/admin/adminLogin")
    }
    catch (err) {
        return res.status(400).render("errorPage");

    }
})





module.exports = route;
