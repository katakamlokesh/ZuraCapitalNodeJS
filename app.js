const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();

const dbPath = path.join(__dirname, "zuraCapitalAssignment.db");

app.use(express.json());

app.use(cors());

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    console.log(process.env.PORT);
    app.listen(process.env.PORT || 3004, () => {
      console.log("Server Running at http://localhost:3004/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

//Insert data into data table

app.post("/offersdata", async (request, response) => {
  try {
    const dataDetails = request.body;

    const values = dataDetails.map(
      (eachDataId) =>
        `(${eachDataId.id}, '${eachDataId.title}', '${eachDataId.brand}',${eachDataId.price},'${eachDataId.imageUrl}',${eachDataId.rating})`
    );

    const valuesString = values.join(",");

    const addDataQuery = `
    INSERT INTO
      offers (id,title,brand,price,image_url,rating)
    VALUES
       ${valuesString};`;

    const dbResponse = await db.run(addDataQuery);
    response.send("Uploaded successfully");
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    response.send("Uploading Failed");
  }
});

const convertDataDetailsToResponseDetails = (dataDetails) => {
  return dataDetails.map((each) => ({
    id: each.id,
    title: each.title,
    brand: each.brand,
    price: each.price,
    imageUrl: each.image_url,
    rating: each.rating,
  }));
};

//API2
app.get("/offers", async (request, response) => {
  const selectQuery = `SELECT * FROM offers;`;
  const dataDetails = await db.all(selectQuery);
  response.send(convertDataDetailsToResponseDetails(dataDetails));
});

//API 3
app.post("/productsdata", async (request, response) => {
  try {
    const dataDetails = request.body;

    const values = dataDetails.map(
      (eachDataId) =>
        `(${eachDataId.id},'${eachDataId.title}','${eachDataId.brand}',${eachDataId.price},'${eachDataId.imageUrl}',${eachDataId.rating},'${eachDataId.options}')`
    );

    const valuesString = values.join(",");

    const addDataQuery = `
    INSERT INTO
      products (id,title,brand,price,image_url,rating,options)
    VALUES
       ${valuesString};`;

    console.log(addDataQuery);

    const dbResponse = await db.run(addDataQuery);
    console.log(dbResponse);
    response.send("Uploaded successfully");
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    response.send("Uploading Failed");
  }
});

const convertProductsDetailsToResponseDetails = (productDetails) => {
  return productDetails.map((each) => ({
    id: each.id,
    title: each.title,
    brand: each.brand,
    price: each.price,
    imageUrl: each.image_url,
    rating: each.rating,
    options: each.options,
  }));
};

//API 4
app.get("/products", async (request, response) => {
  const selectQuery = `SELECT * FROM products;`;
  const dataDetails = await db.all(selectQuery);
  console.log(dataDetails);
  response.send(convertProductsDetailsToResponseDetails(dataDetails));
});

//API 5

app.delete("/products", async (request, response) => {
  try {
    const deleteQuery = `DELETE FROM products;`;
    const deleteResponse = await db.run(deleteQuery);
    response.send("Deleted");
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    response.send("Delete Failed");
  }
});

module.exports = app;
