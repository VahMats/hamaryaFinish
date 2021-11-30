const UserValidationService = require('../services/UserValidatorService')
const ResponseGenerator = require('../services/ResponseGenerator')
const knex = require("../modules/KnexModule")
const jwt = require("jsonwebtoken")
const {secret} = require ("../configs/tokenConfig")

const generateAccessToken = (Id) => {
    const payload = {
        Id
    }
    return jwt.sign(payload, secret, {expiresIn: "12h"})
}

const findUsername = 'SELECT * FROM `users` WHERE `username` = ?';
const findEmail = 'SELECT * FROM `users` WHERE `email` = ?';

exports.login = async (req, res) => {
    console.log(req.body)
    try{
        const data = {
            isValid: false,
            usernamIsAvalibe: false,
            passwordIsCorrect: false,
            token: '',
            isAdmin: false,
            information: {}
        }

        const validate = UserValidationService(req.body, 'login')
        if (!validate.isValid) {
            res.status(200).send(data).end()
        } else data.isValid = true;

        let user = await knex(findUsername, req.body.username)
        if (user.length === 0) {
            data.usernamIsAvalibe = false;
            res.status(200).send(data).end()
        } else {
            data.usernamIsAvalibe = true;
        }
        if (user[0].password === req.body.password) {
            data.usernamIsAvalibe = true;
            data.passwordIsCorrect = true;
            const token = generateAccessToken(user[0].Id)
            console.log(user[0])
            data.token = token;
            if (user[0].isAdmin){
                data.isAdmin = true;
                data.information = await knex("SELECT * FROM users")
            }
            else {
                data.information = user[0];
            }
        }
        res.status(200).send(data).end();
    }catch (e) {
        console.log(e)
    }
}


exports.register = async (req, res) => {
    try{
        const sqlFindUsername = 'SELECT * FROM `users` WHERE `username` = ?';
        const sqlFindEmail = 'SELECT * FROM `users` WHERE `email` = ?';
        const data = {
            isValid: false,
            isUniqeUsername: false,
            isUniqeEmail: false,
        }
        const {firstName, lastName, email, username, dateOfBirth, gender, password} = req.body

        const validate = UserValidationService(req.body, 'register')
        if (!validate.isValid) {
            data.isValid = false;
            res.status(200).send(data);
        }
        else data.isValid = true;

        let findUsername = await knex(sqlFindUsername, req.body.username)
        let findEmail = await knex(sqlFindEmail, req.body.email)
        if (findUsername.length !== 0) {
            data.isUniqeUsername = false;
            res.status(200).send(data)
        }
        else data.isUniqeUsername = true;
        if (findEmail.length !== 0) {
            data.isUniqeEmail = false;
            res.status(200).send(data)
        }
        else data.isUniqeEmail = true;
        if (data.isValid && data.isUniqeUsername && data.isUniqeEmail){
            await knex("INSERT INTO users (firstName,lastName, email, username, password, dateOfBirth, gender) VALUES(?,?,?,?,?,?,?)", [firstName, lastName, email, username, password, dateOfBirth, gender])
        }
        res.status(200).send(data).end();
    }catch (e) {
        console.log(e)
    }

}
