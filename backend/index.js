require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser")
const morgan = require("morgan")
const Routes = require("./router")
const knex = require("./modules/KnexModule")
const jwt = require("jsonwebtoken")
const {secret} = require ("./configs/tokenConfig")
const app = express();
const {userDataFind, teamDataFind} = require("./services/ResponseGenerator")

app.use(bodyParser.json());
app.use(morgan('tiny'));

app.get("/", async (req,res)=>{
    res.send("Hello i am you'r backend")
})

app.post("/token", async (req,res)=>{
    const token = req.headers['x-access-token'];
    const decodetData = jwt.verify(token,secret);
    const user = await knex("SELECT Id, firstName, lastName, email, username, dateOfBirth, gender, deleted, isAdmin, team FROM users WHERE Id = ?", [decodetData.Id])
    const data = {
        isAdmin: user[0].isAdmin,
        userData: [],
        teamData: [],
    }
    const allUsers = await knex('SELECT Id, firstName, lastName, email, username, dateOfBirth, gender, deleted, isAdmin, team FROM users');
    const notDeletedUseres = allUsers.filter(el => !el.deleted)
    data.userData = notDeletedUseres
    data.teamData = await teamDataFind(user[0])
    res.status(200).send(data).end();
})

app.use("/api", Routes)
app.listen(process.env.PORT, ()=>{console.log("Server has been started on port 5000" )})
