function parsedErrorMessage(err){
    let output = ""

    try{
        let objectKey = Object.keys(err.keyPattern)
        let objectValue = Object.values(err.keyValue)
        output = `${objectKey[0]} ${objectValue[0]} already exists`
    }catch{
        output = "Something went wrong, please contact support"
    }

    return output
}

function errorHandler(err){
    console.log(err.code)
    let message = "";

    if(err.code){
        switch(err.code){
            case 11000:
            case 11001:
                message = parsedErrorMessage(err)
                break
            default:
                message = "Something went wrong, please contact support"
        }
    }else if(err.message){
        return err.message
    }

    return message
}

module.exports = errorHandler