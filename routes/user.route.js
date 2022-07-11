const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const userSchema = require("../models/user.js");
const mail = require("../validation/mail");

// USER SIGNUP
router.post("/user-signup", async (req, res, next) => {
  try {
    const UserName = req.body.UserName;
    const EMail = req.body.EMail;
    const MobileNo = req.body.MobileNo;
    const Password = req.body.Password;

    if (UserName && EMail && MobileNo && Password) {
      let UserNameFind = await userSchema
        .findOne({ UserName: UserName })
        .exec();
      let EMailFind = await userSchema
        .findOne({ EMail: EMail })
        .exec();
      let MobileNoFind = await userSchema
        .findOne({ MobileNo: MobileNo })
        .exec();

      const userDetails = await (req, res);
      if (UserNameFind) {
        return res.json({
          status: "failure",
          message: "UserName already exist",
        });
      } else if (EMailFind) {
        return res.json({ status: "failure", message: "EMail already exist" });
      } else if (MobileNoFind) {
        return res.json({
          status: "failure",
          message: "MobileNo already exist",
        });
      } else {
      }

      let newUser = new userSchema(req.body);
      let salt = await bcrypt.genSalt(10);
      newUser.Password = bcrypt.hashSync(Password, salt);
      console.log(newUser.Password);
      let regUserDetails = await newUser.save();

      let mailData = {
        from: "ajay.platosys@gmail.com",
        to: EMail,
        subject: "verify mail",
        fileName: "verifyMail.ejs",
        details: {
          EMail: EMail,
        },
      };
      let data = mail.mailsending(mailData);
      console.log("data:", data);
      return res.status(200).json({
        status: "success",
        message: "EMail send and user registerd sucessfully",
        data: regUserDetails,
      });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ status: "failure", message: err.message });
  }
});

// GET ALL USERS LIST
router.get("/getall-userslist", async (req, res) => {
  try {
    const allUsers = await userSchema.find().exec();
    console.log("All users", allUsers);
    res.status(200).json({
      message: "all users list fecthed successfully",
      result: allUsers,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err);
  }
});

// EMail VERIFICATION
router.get("/verify-mail/:EMail", async (req, res) => {
  try {
    const userDetails = await userSchema
      .findOneAndUpdate(
        { EMail: req.params.EMail },
        { verfiedUser: true },
        { new: true }
      )
      .exec();
    return res.status(200).json({
      status: "success",
      message: "EMail id verfication successfull",
      data: userDetails.verfiedUser,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ status: "failure", message: err.message });
  }
});

// USER SIGNIN
router.post("/user-signin", async (req, res) => {
  try {
    const UserName = req.body.UserName;
    const Password = req.body.Password;
    let date = moment().toDate();
    console.log(date);

    let userDetails;
    let details = await userSchema
      .findOne({ UserName: UserName })
      .select("-UserName -_id ")
      .exec();

    if (UserName) {
      userDetails = await userSchema.findOne({ UserName: UserName }).exec();
      if (!UserName) {
        return res
          .status(400)
          .json({ status: "failure", message: "user not found" });
      } else if (userDetails) {
        let match = await bcrypt.compare(Password, userDetails.Password);
        console.log("Password match found");
        await userSchema
          .findOneAndUpdate(
            { UserName: req.body.UserName },
            { lastedVisited: date, LoginStatus: true },
            { new: true }
          )
          .exec();
        return res
          .status(200)
          .json({ status: "success", message: "Login successfull" });
        console.log(userDetails);
      } else {
      }
    } else {
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ status: "failure", message: err.message });
  }
});

// USER SIGNOUT
router.post("/user-signout", async (req, res) => {
  try {
    let date = moment().toDate();
    console.log(date);
    await userSchema
      .findOneAndUpdate(
        { uuid: req.query.uuid },
        { lastedVisited: date, LoginStatus: false },
        { new: true }
      )
      .exec();
    return res
      .status(200)
      .json({ status: "success", message: "Logout successfull" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ status: "failure", message: error.message });
  }
});

module.exports = router;
