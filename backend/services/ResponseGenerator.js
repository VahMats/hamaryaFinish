const knex = require("../modules/KnexModule")

exports.userDataFind = async (user) => {
    if (user.isAdmin){
        const allUsers = await knex('SELECT Id, firstName, lastName, email, username, dateOfBirth, gender, deleted, isAdmin, team FROM users');
        const notDeletedUseres = allUsers.filter(el => !el.deleted)
        return notDeletedUseres
    }
    else {
        return user
    }


}

exports.teamDataFind = async (user) => {
    if (user.isAdmin){
        const allTeams = await knex('SELECT * FROM teams');
        const notDeletedTeams = allTeams.filter(el => !el.deleted);
        return notDeletedTeams
    }
    else {
        console.log(user)
           if (user.team === "-") {return [];}
           else teamMembers = await knex("SELECT Id, firstName, lastName, email, username, dateOfBirth, gender FROM users WHERE team = ?", [user.team])
        return teamMembers;
    }

}
