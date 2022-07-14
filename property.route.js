const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const multer = require("multer");
const path = require("path");

const propertySchema = require("../models/property");
const categorySchema = require("../models/category");
const userSchema = require("../models/user");
const authVerfy = require("../validation/auth");
const isAdmin = require("../validation/auth");
const storageMulter = require("../files/multer");

// const upload = multer({ storage: storageMulter.storage });

//CREATE PROPERTY
router.post("/create-property", async (req, res) => {
  try {
    const newproperty = new propertySchema(req.body);
    console.log(newproperty);
    const savedproperty = await newproperty.save();
    res.status(200).json(savedproperty);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE PROPERTY
router.put("/update-property", async (req, res) => {
  try {
    let condition = { uuid: req.query.uuid };
    //console.log(req.body.uuid);
    let propertyDetails = req.body.propertyDetails;
    console.log("property_detail", propertyDetails);
    let option = { new: true };

    const updatedproperty = await propertySchema
      .findOneAndUpdate(condition, propertyDetails, option)
      .exec();
    //console.log(updatedproperty);
    res.status(200).json(updatedproperty);
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err);
  }
});

//DELETE PROPERTY
router.delete("/delete-property", async (req, res) => {
  try {
    await propertySchema.findOneAndDelete({ uuid: req.query.uuid }).exec();
    res.status(200).json("property deleted successfully");
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err);
  }
});

//GET ALL PROPERTY
router.get("/getall-property", async (req, res) => {
  try {
    const allpropertys = await propertySchema.find().exec();
    console.log("All Prod", allpropertys);
    res.status(200).json({
      message: "all propertys fecthed successfully",
      result: allpropertys,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err);
  }
});

//GET PROPERTY BY TYPE
router.get("/property-by-type", async (req, res) => {
  try {
    const itemByType = await propertySchema
      .findOne({ name: req.body.type })
      .exec();
    res
      .status(200)
      .json({ message: "property fecthed successfully", result: itemByType });
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err);
  }
});

//GET PROPERTY BY CATEGORY
router.get("/all-category", async (req, res) => {
  try {
    const allCateg = await categorySchema.find().exec();
    res
      .status(200)
      .json({ message: "category fecthed successfully", result: allCateg });
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err);
  }
});

//FETCH PROPERTY TYPE BY CHARACTERS
router.get("/property-by-char", async (req, res) => {
  try {
    let searchProp = {};
    console.log("search_Prop", searchProp);
    if (searchProp) {
      searchProp.name = {
        $regex: req.query.name,
        $options: "i",
      };
    } else {
    }

    let propByChar = await propertySchema.find(searchProp).exec();
    res.status(200).json({
      message: "propertys by character fetched successfully",
      result: propByChar,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err);
  }
});

//FILTER
router.get("/filter-by-price", async (req, res) => {
  try {
    let minPrice = req.query.minPrice;
    let maxPrice = req.query.maxPrice;

    const filteredPrice = await propertySchema.aggregate([
      {
        $match: {
          $and: [
            {
              price: {
                $gte: minPrice,
                $lte: maxPrice,
              },
            },
          ],
        },
      },
      {
        $sort: { price: 1 },
      },
      {
        $project: {
          _id: 0,
          desc: 0,
          categ: 0,
          createdAt: 0,
          updatedAt: 0,
          uuid: 0,
          __v: 0,
        },
      },
    ]);
    console.log("filteredPrice", filteredPrice);
    res.status(200).json({
      message: "property filtered by price sucessfully",
      result: filteredPrice,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err);
  }
});

//AGGREGATE
router.get("/user-based-property", async (req, res) => {
  try {
    let details = await userSchema.aggregate([
      {
        $match: {
          $and: [{ uuid: req.query.uuid }],
        },
      },
      {
        $lookup: {
          from: "property",
          localField: "uuid",
          foreignField: "userUuid",
          as: "propertyDetails",
        },
      },
      {
        $unwind: {
          path: "$propertyDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          username: 1,
          "propertyDetails.name": 1,
        },
      },
    ]);

    console.log(details);
    if (details.length >= 1) {
      return res.status(200).json({
        status: "success",
        message: "user based property details fetched sucessfully",
        result: details,
      });
    } else {
      return res.status(404).json({
        status: "failure",
        message: "property details not found for the user",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ status: "failure", message: error.message });
  }
});

// //BULKUPLOAD
// router.post("/bulk-upload", upload.single("file"), async (req, res) => {
//   try {
//     let path = "./bulkuploads/" + req.file.filename;
//     console.log(path);
//     let fileDetails = xlsx.readFile(path);
//     let sheetDetails = fileDetails.SheetNames;
//     let result = xlsx.utils.sheet_to_json(fileDetails.Sheets[sheetDetails[0]]);

//     console.log("result:", result);

//     for (let data of result) {
//       let resultData = await propertySchema.findOne({ name: data.name });
//       if (resultData) {
//         updateData = await propertySchema.findOneAndUpdate(
//           { name: data.name },
//           { new: true }
//         );
//       } else {
//         const newData = new propertySchema(data);
//         const newpropertyDetails = await newData.save();
//         console.log("newpropertyDetails:", newpropertyDetails);
//       }
//     }
//     return res
//       .status(200)
//       .json({ status: "success", message: "bulk upload successfull" });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ status: "failure", message: error.message });
//   }
// });

// IMAGES UPLOAD
router.post("/images-upload", async (req, res) => {
  try {
    const upload = multer({ storage: storageMulter.storage }).array("file", 5);

    upload(req, res, function (err) {
      if (!req.file) {
        return res.send("Please select an image to upload");
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      }

      const classifiedsadd = {
        image: req.file.filename,
      };

      console.log(classifiedsadd);
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
