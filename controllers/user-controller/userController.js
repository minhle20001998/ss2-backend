const UsersDB = require("../../models/usersSchema");
const OrdersDB = require("../../models/orderSchema");

const mongoose = require("mongoose");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cartManagement = require('../cart-controller/cartManagement');
const COOKIE_LIFE_TIME = 1000000;
const cookie = require('cookie');
const encodedToken = (userID, userName, auth) => {
  return JWT.sign(
    {
      iss: "Minh Le",
      sub: userID,
      uname: userName,
      iat: new Date().getTime(),
      auth: auth,
      exp: new Date().setDate(new Date(Date.now() + COOKIE_LIFE_TIME)),
    },
    process.env.JWT_SCECRET
  );
};
// const schema = require('../helpers/helpers');
class userController {
  constructor() {
    this.saltRounds = 10;
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.hashPassword = this.hashPassword.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  register(req, res) {
    bcrypt.hash(req.body.password, this.saltRounds, async function (err, hash) {
      try {
        const user = new UsersDB({
          _id: new mongoose.Types.ObjectId().toHexString(),
          username: req.body.username,
          password: hash,
          contacts: { email: req.body.email },
          authority: "client",
        });
        const saveUser = await user.save();
        if (saveUser) {
          cartManagement.createCart({ body: { userID: saveUser._id } });
          res.json({ message: "register successfully" })
        } else {
          res.json({ err: "error" })
        }
      } catch (err) {
        res.json({ message: `${Object.keys(err.keyPattern)[0]} is existed` })
      }
    })

  }

  async login(req, res) {
    try {
      const userDB = await UsersDB.findOne({ username: `${req.body.username}` });
      const isSame = await bcrypt.compare(req.body.password, userDB.password);
      if (isSame) {
        if (userDB.authority === 'client') {
          const token = encodedToken(userDB._id, userDB.username, "client");
          res.cookie('login', token, { expires: new Date(Date.now() + COOKIE_LIFE_TIME) });
          res.status(201).json({
            message: "login successfully",
          })
        } else {
          const token = encodedToken(userDB._id, userDB.username, "admin");
          res.cookie('login', token, { expires: new Date(Date.now() + COOKIE_LIFE_TIME) });
          res.status(201).json({
            message: "login successfully",
            admin: true
          })
        }
      } else {
        res.json({
          message: "password incorrect",
        });
      }
    } catch (err) {
      res.json({
        message: "account not existed !!",
      });
    }
  }


  // async loginAdmin(req, res) {
  //   try {
  //     const userDB = await UsersDB.findOne({ username: `${req.body.username}` });
  //     const isSame = await bcrypt.compare(req.body.password, userDB.password);

  //   } catch (err) {
  //     res.json({
  //       message: err
  //     })
  //   }
  // }

  async getUserName(req, res, id) {
    const username = await UsersDB.findOne({ _id: id });
    if (!username) {
      res.json({ err: "user not found" })
      return null;
    } else { return username.username; }

  }


  async getUserNameByID(id) {
    const username = await UsersDB.findOne({ _id: id });
    if (username) {
      return username.username;
    } else {
      return null;
    }
  }

  async getCountUser(req, res) {
    try {
      const userDB = await UsersDB.find({});
      res.json({
        user: userDB.length
      })
    } catch (err) {
      res.json(err)
    }

  }

  async getAllUser(req, res) {
    try {
      const userDB = await UsersDB.find({ authority: { $ne: 'admin' } }, { password: 0, authority: 0 });
      res.json(userDB)
    } catch (err) {
      res.json({
        err: err
      })
    }
  }

  async getUser(req, res) {
    try {
      const userDB = await UsersDB.findOne({ _id: req.params.id }, { password: 0, authority: 0 });
      res.json(userDB);
    } catch (err) {
      res.json({
        err: err
      })
    }
  }

  async updateUser(req, res) {
    try {
      const { _id } = req.body;
      const bpass = await this.hashPassword(req.body.password);
      const updateBody = {};
      Object.keys(req.body).map((key) => {
        if (key != '_id' && key != 'password') {
          updateBody[key] = req.body[key]
        }
        if (key == 'password') {
          updateBody[key] = bpass;
        }
      })
      const userDB = await UsersDB.findOneAndUpdate({ _id: _id }, updateBody, {
        new: true
      });
      res.json(userDB)
    } catch (err) {
      res.json({
        err: err
      })
    }
  }

  async deleteUser(req, res) {
    try {
      const userDB = await UsersDB.deleteOne({ _id: req.params.id });
      if (userDB.n > 0) {
        cartManagement.deleteCart(req.params.id);
        res.json(userDB)
      }
      else { res.json(null) }
    } catch (err) {
      res.json({ err: err })
    }
  }

  async hashPassword(password) {
    const saltRounds = this.saltRounds;
    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) reject(err)
        resolve(hash)
      });
    })
    return hashedPassword
  }

  async getUserOrder(req, res) {
    const { id } = req.params;
    try {
      const userOrders = await OrdersDB.find({ userID: id })
      res.json(userOrders);
    } catch (error) {
      res.json(error)
    }
  }

  async updateUserInfo(req, res) {
    const { id } = req.params;
    const { email, address, phoneNumber } = req.body;
    try {
      const userInfo = await UsersDB.updateOne({ _id: id },
        {
          $set: {
            "contacts": {
              "email": email,
              "address": address,
              "phoneNumber": phoneNumber
            }
          }
        });
      (userInfo.n > 0 ? res.status(200).json("ok") : res.status(404).json("not ok"))
    } catch (error) {
      res.json(error);
    }
  }

}

module.exports = new userController();
