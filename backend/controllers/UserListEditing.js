const knex = require("../modules/KnexModule")
const UserValidationService = require('../services/UserValidatorService')
const {userDataFind} = require("../services/ResponseGenerator")

exports.userAdd = async (req,res)=>{
    try{
        const sqlFindUsername = 'SELECT * FROM `users` WHERE `username` = ?';
        const sqlFindEmail = 'SELECT * FROM `users` WHERE `email` = ?';
        const data = {
            isValid: false,
            isUniqeUsername: false,
            isUniqeEmail: false,
            teamIsFull: false,
            userData: []
        }
        const {firstName, lastName, email, username, dateOfBirth, gender, password, teamId} = req.body

        const validate = UserValidationService(req.body, 'register')
        if (!validate.isValid) {
            data.isValid = false;
                res.status(200).send(data).end();
        }
        else data.isValid = true;

        let findUsername = await knex(sqlFindUsername, req.body.username)
        let findEmail = await knex(sqlFindEmail, req.body.email)
        if (findUsername.length !== 0) {
            data.isUniqeUsername = false;
            res.status(200).send(data).end();
        }
        else data.isUniqeUsername = true;
        if (findEmail.length !== 0) {
            data.isUniqeEmail = false;
            res.status(200).send(data).end();
        }
        else data.isUniqeEmail = true;

        const teamInfo = await knex("SELECT * FROM teams WHERE Id = ?", [teamId])
        if (teamInfo){
            if (teamInfo[0].countOfMembers === teamInfo[0].maxCountOfMembers){
                data.teamIsFull = true;
                res.status(200).send(data).end();
            }else {
                await knex("UPDATE teams SET countOfMembers = countOfMembers + 1 WHERE Id = ?", [teamId])
            }

        }
        if (data.isValid && data.isUniqeUsername && data.isUniqeEmail){
            await knex("INSERT INTO users (firstName,lastName, email, username, password, dateOfBirth, gender, team, teamId) VALUES(?,?,?,?,?,?,?,?,?)", [firstName, lastName, email, username, password, dateOfBirth, gender, teamInfo[0].name, teamInfo[0].Id])
            const allUsers = await knex('SELECT Id, firstName, lastName, email, username, dateOfBirth, gender, deleted, isAdmin, team FROM users');
            const notDeletedUseres = allUsers.filter(el => !el.deleted)
            data.userData = notDeletedUseres;
        }

        res.status(200).send(data).end();
    }catch (e) {
        console.log(e)
    }
}

exports.userEdit = async (req,res)=>{
    try
    {
        const {Id, firstName, lastName, email, username, dateOfBirth, gender, teamId} = req.body
        data = {
            isExist: false,
            userData: []
        }

        const editingUser = await knex("SELECT * FROM users WHERE Id = ?", [Id])
        if (editingUser.length === 0) {
            res.status(200).send(data).end();
        }
        else data.isExist = true;
        const teamInfo = await knex("SELECT * FROM teams WHERE Id = ?", [teamId])
        if (teamInfo){
            if (teamInfo[0].countOfMembers === teamInfo[0].maxCountOfMembers){
                data.teamIsFull = true;
                res.status(200).send(data).end();
            }else{
                await knex("UPDATE teams SET countOfMembers = countOfMembers + 1 WHERE Id = ?", [teamId])
            }

        }
        await knex('UPDATE `users` SET `firstName` = ?, `lastName` = ?, `email` = ?, `username` = ?, `dateOfBirth` = ?, `gender` = ?, `team` = ?, `teamId` = ? WHERE Id = ?', [firstName, lastName, email, username, dateOfBirth, gender, teamInfo[0].name, teamInfo[0].Id, Id])
        const allUsers = await knex('SELECT Id, firstName, lastName, email, username, dateOfBirth, gender, deleted, isAdmin, team FROM users');
        const notDeletedUseres = allUsers.filter(el => !el.deleted)
        data.userData = notDeletedUseres;
        res.status(200).send(data).end();
    }catch (e) {
        console.log(e)
    }

}

exports.userDelete = async (req,res)=>{
    try
    {
        data = {
            isExist: false,
            userData: []
        }

        const deletingUser = await knex(`SELECT teamId, username FROM users WHERE Id = ?`, [req.body.Id])
        if (deletingUser) {
            res.status(200).send(data).end();
        }
        else data.isExist = true;

        if (deletingUser[0].teamId){
            const teamInfo = await knex("SELECT * FROM teams WHERE Id = ?", [deletingUser[0].teamId])
            if (teamInfo){
                await knex("UPDATE teams SET countOfMembers = countOfMembers - 1 WHERE Id = ?", [deletingUser[0].teamId])
            }
        }



        await knex('UPDATE `users` SET `deleted`= 1, team = "-", teamId = null WHERE Id = ?', [req.body.Id])
        const allUsers = await knex('SELECT Id, firstName, lastName, email, username, dateOfBirth, gender, deleted, isAdmin, team FROM users');
        const notDeletedUseres = allUsers.filter(el => !el.deleted)
        data.userData = notDeletedUseres;
        res.status(200).send(data).end();
    }catch (e) {
        console.log(e)
    }

}
