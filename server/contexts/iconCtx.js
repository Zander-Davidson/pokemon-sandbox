const { queryNeo4j } = require("../utilities/utilities");

// return specified Icon (or return all Icons if no name supplied)
const getIcon = async (params) => {
    let query = `
        MATCH (i:Icon) ${params.name ? 'WHERE i.name = $name' : ''}
        RETURN {
            name: i.name,
            image_url: i.image_url
        }`;
    return await queryNeo4j(query, params);
};

const iconCtx = {
    getIcon: getIcon
};

module.exports = iconCtx;