const UsersDB = require("../../models/usersSchema");
const mongoose = require("mongoose");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cartManagement = require('../cart-controller/cartManagement');
const COOKIE_LIFE_TIME = 100000;
const cookie = require('cookie');
const encodedToken = (userID, userName) => {
  return JWT.sign(
    {
      iss: "Minh Le",
      sub: userID,
      uname: userName,
      iat: new Date().getTime(),
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
          console.log(saveUser)
          cartManagement.createCart({
            body: {
              userID: saveUser._id
            }
          });
          res.json({
            message: "register successfully"
          })
        } else {
          res.json({
            err: "error"
          })
        }
      } catch (err) {
        res.json({
          message: `${Object.keys(err.keyPattern)[0]} is existed`
        })
      }
    })

  }

  async login(req, res) {
    try {
      const userDB = await UsersDB.findOne({ username: `${req.body.username}` });
      const isSame = await bcrypt.compare(req.body.password, userDB.password);
      if (isSame) {
        const token = encodedToken(userDB._id, userDB.username);
        res.cookie('login', token, { expires: new Date(Date.now() + COOKIE_LIFE_TIME), sameSite: 'none'});
        res.status(201).json({
          message: "login successfully",
        })
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

  async getUserName(req, res, id) {
    const username = await UsersDB.findOne({ _id: id });
    if (!username) {
      res.json({
        err: "user not found"
      })
      return null;
    } else {
      return username.username;
    }
  }

  async getAllUser(req, res) {
    try {
      const userDB = await UsersDB.find({}, { password: 0, authority: 0 });
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
          console.log("aaa")
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
      const userDB = await userDB.deleteOne({ _id: req.params.id });
      if (userDB.n > 0)
        res.json(userDB)
      else
        res.json({
          err: "no user found"
        })
    } catch (err) {
      res.json({
        err: err
      })
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
}

module.exports = new userController();
