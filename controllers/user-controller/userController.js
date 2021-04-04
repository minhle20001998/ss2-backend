const UsersDB = require("../../models/usersSchema");
const mongoose = require("mongoose");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cartManagement = require('../cart-controller/cartManagement');
const encodedToken = (userID, userName) => {
  return JWT.sign(
    {
      iss: "Minh Le",
      sub: userID,
      uname: userName,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 3),
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
        res.cookie('login', token, { expires: new Date(Date.now() + process.env.COOKIE_LIFE_TIME) });
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
}

module.exports = new userController();
