const knex = require("../modules/KnexModule")

exports.teamAdd = async (req,res)=>{
    const data = {
        nameIsValid: false,
        maxCountOfMembersIsValid: false,
        teamData: []
    }

    const {name, maxCountOfMembers} = req.body
    if (name.length > 0){
        data.nameIsValid = true;
    }
    else res.status(200).send(data).end();

    if (maxCountOfMembers > 0){
        data.maxCountOfMembersIsValid = true;
    }
    else res.status(200).send(data).end();

    await knex("INSERT INTO teams (name, maxCountOfMembers) VALUES (?, ?)", [name,maxCountOfMembers]);
    const allTeams = await knex('SELECT * FROM teams');
    const notDeletedTeams = allTeams.filter(el => !el.deleted);
    data.teamData = notDeletedTeams
    res.status(200).send(data).end();
}

exports.teamEdit = async (req,res)=>{
    const data = {
        nameIsValid: false,
        maxCountOfMembersIsValid: false,
        teamData: []
    }
    const {Id, name, maxCountOfMembers} = req.body
    if (name.length > 0){
        data.nameIsValid = true;
    }
    else res.status(200).send(data).end();

    if (maxCountOfMembers > 0){
        data.maxCountOfMembersIsValid = true;
    }
    else res.status(200).send(data).end();

    await knex("UPDATE teams SET name=?, maxCountOfMembers=? WHERE Id=?", [name, maxCountOfMembers, Id])
    const allTeams = await knex('SELECT * FROM teams');
    const notDeletedTeams = allTeams.filter(el => !el.deleted);
    data.teamData = notDeletedTeams
    res.status(200).send(data).end();

}

exports.teamDelete = async (req,res)=>{
    const {Id} = req.body;

    const data = {
        isExist: false,
        teamData: []
    }

    const deletingTeam = await knex("SELECT * FROM teams WHERE Id=?", [Id])
    if (deletingTeam.length) {
        data.isExist = true;
        await knex("UPDATE teams SET deleted=? WHERE Id=?", [true, Id])
        const allTeams = await knex('SELECT * FROM teams');
        const notDeletedTeams = allTeams.filter(el => !el.deleted);
        data.teamData = notDeletedTeams;
        res.status(200).send(data).end();
    }
    else res.status(200).send(data).end();

}