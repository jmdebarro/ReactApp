// backend.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob
} from "./user-services.js";


const app = express();
const port = 8000;


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Mr. Tang...");
})

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  getUsers(name, job).then((users) => {
    res.send(users);
  }).catch((error) => {
    res.status(500).send("Internal Server Error");
  })
});


app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  findUserById(id)
    .then((user) => {
      if (user === undefined) {
        res.status(404).send("Resource not found.");
      } else {
        res.send(user);
      }
    }).catch((error) => {
      res.status(500).send("Internal Server Error");
    });

});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  mongoose.findByIdAndDelete(id).then((user) => {
    if (user === undefined) {
      res.status(404).send("User could not be found");
    } else {
      res.status(204).send("Deleted");
    }
  }).catch((error) => {
    res.status(500).send("Internal Server Error");
  })});


app.post("/users", (req, res) => {
  const userToAdd = req.body;
  var id = Math.floor(Math.random() * 100000).toString();
  userToAdd["id"] = id;
  addUser(userToAdd).then((user) => {
    if (user === undefined) {
      res.status(404).send("Unable to add user");
    } else {
      res.status(201).send(user);
    }
  }).catch((error) => {
    res.status(500).send("Internal Server Erro");
  })

});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
