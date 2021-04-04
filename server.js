const express = require("express");
const app = express();
const mongo = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const route = require(`./routes`);
const cookieParser = require('cookie-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
app.use(express.json());
// 

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Bitis API",
            description: "Bitis API information",
            contact: {
                name: "Le Minh"
            },
            servers: ["http://localhost:3030"]
        },
    },
    apis: ["./routes/admin.route/*.js", "./routes/cart.route/*.js"]
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// 
require('dotenv').config();
const JWT = require("jsonwebtoken");

// 
const mongopath = `mongodb+srv://bitis:${process.env.MONGODB_PASSWORD}@bitis.oo9yu.mongodb.net/bitis?retryWrites=true&w=majority`
mongoose.connect(mongopath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// 
app.use(cors({
    origin: true,
    credentials: true
}));
app.use('/uploads', express.static('uploads'));
app.use(cookieParser());
// 
route(app);
app.listen(process.env.SERVER_PORT, () => {
    console.log(`Listening on port ${process.env.SERVER_PORT}`)
})

// const UserController = require('./controllers/user-controller/userController');
// async function test() {
//     const a = await UserController.getUserName('6061fbdac39e1f712a03cde9');
//     console.log(a)
// }
// test();




