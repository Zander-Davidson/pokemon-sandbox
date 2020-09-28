const { queryNeo4j } = require("../utilities/utilities");
const { userModel } = require("./models/returnModels");

/* params: {
    username: <string>,
    email: <string>,
    password: <string>
}*/
const createUser = async (params) => {
    let model = userModel(['u.']);
    let query = `
        MATCH(i:Icon) WHERE i.name = $icon_name
        CREATE(u:User {
            created_at: datetime(),
            username: $username,
            email: $email,
            password: $password
        })
        MERGE(u)-[:HAS_ICON]-(i)
        
        RETURN ${model}
    `;
    return await queryNeo4j(query, params);
};

/* params {
    username: <string>
} */
const getUser = async (params) => {
    let query = `
        MATCH (u:User {username: $username})-[:HAS_ICON]->(i:Icon)
        RETURN {
            user_id: id(u),
            username: u.username,
            email: u.email,
            icon_url: i.image_url,
            password: u.password
        }`;    
    return await queryNeo4j(query, params);
};

// returns true if an account already exists with the provided username
/* params = {
    username: <string>
}*/
const getMatchingUsername = async (params) => {
    // check for existing username
    let query = `MATCH (u:User) WHERE u.username = $username RETURN { username: u.username }`;
    return await queryNeo4j(query, params);
};

// returns true if an account already exists with the provided email
/* params = {
    email: <string>
}*/
const getMatchingEmail = async (params) => {
    // check for existing email
    let query = `MATCH (u:User) WHERE u.email = $email RETURN { email: u.email }`;
    return await queryNeo4j(query, params);   
};

const authCtx = {    
    createUser: createUser,
    getUser: getUser,
    getMatchingUsername: getMatchingUsername,
    getMatchingEmail: getMatchingEmail
};

module.exports = authCtx;