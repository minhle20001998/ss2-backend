const userRouter = require("./userRoute");
const adminProductRouter = require("./admin.route/manageProducts");
const cartRoute = require("./cart.route/cartRoute");
const orderRoute = require("./order.route/orderRoute");
const commentRoute = require("./comment.route/commentRoute");

const checkAdminAuthority = require("../middlewares/checkAuthority");

function route(app) {
  app.use("/", userRouter);
  app.use("/product", adminProductRouter);
  app.use("/cart", cartRoute);
  app.use("/order", orderRoute);
  app.use("/comment", commentRoute);


}

module.exports = route;
