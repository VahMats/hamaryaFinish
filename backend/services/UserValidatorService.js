const validationFunctions = {
    email: ({email})=> emailValidation(email),
    username: ({username}) => usernameValidation(username),
    password: ({password, confirmPassword}) => passwordValidation(password, confirmPassword),
    firstName: ({firstName}) => nameValidation(firstName),
    lastName: ({lastName}) => nameValidation(lastName),
}

module.exports = (data, validationType) => {
    const resultData = {
        fields: {},
        isValid: false,
        error: ''
    }

    if(!data) {
        resultData.error = 'Invalid Data.'
        return resultData
    }

    const isFieldsValid = contentValidation(data, validationType);

    if(!isFieldsValid.valid) {
        resultData.error = 'Please fill all required fields.'
        resultData.valid = isFieldsValid.valid
        return resultData
    }

    isFieldsValid.fieldData.forEach(type => {
        const validationFunction = validationFunctions[type];
        resultData.fields[type] = validationFunction(data)
    })

    const falseCurrent = Object.keys(resultData.fields).filter(e=>!resultData.fields[e].valid)
    console.log(falseCurrent);
    resultData.isValid = falseCurrent.length ? false : true
    let lastmassege = []
    falseCurrent.forEach(elem=>{lastmassege.push(`Please fill ${elem} field `) })
    resultData.error =  lastmassege
    return resultData

}

function contentValidation(data, type) {
    let isValid = false;
    const requiredRegister = ['email', 'username', 'password', 'firstName', 'lastName'];
    const requiredLogin = ['username', 'password'];

    const fieldData = type === 'login' ? requiredLogin : requiredRegister

    const fields = Object.keys(data)

    const filtered = fieldData.filter(elem => fields.includes(elem))

    isValid = type === "login" ? filtered.length === requiredLogin.length : filtered.length === requiredRegister.length


    return {
        valid: isValid,
        fieldData
    };
}

function nameValidation(name) {
    if (name.length > 2) {
        return {
            valid: true,
            error: ''
        }
    }
    else return {
        valid: false,
        error: 'incorrect entered data'
    }
}

function emailValidation(email) {
    const sampleForEmail = /\S+@\S+\.\S+/
    if (sampleForEmail.test(email)) {
        return {
            valid: true,
            error: ''
        }
    }
    else return {
        valid: false,
        error: 'incorrect email'
    }
}

function usernameValidation(username) {
    if (username.length > 3) {
        return {
            valid: true,
            error: ''
        }
    }
    else return {
        valid: false,
        error: 'incorrect entered data'
    }
}

function passwordValidation(password, confirmPassword) {
    const sampleForPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/

    if (confirmPassword) {
        if (sampleForPassword.test(password) && confirmPassword === password) {
            return {
                valid: true,
                error: ''
            }
        }
        else return {
            valid: false,
            error: 'incorrect password'
        }
    }

    if (sampleForPassword.test(password))  {
        return {
            valid: true,
            error: ''
        }
    }

    else return {
        valid: false,
        error: 'incorrect password'
    }
}
