const { queryNeo4j } = require("../utilities/utilities");

// return array of all nature names
const getNatures = async () => {
    let query = `MATCH(n:Nature) WITH n ORDER BY n.name RETURN {name: n.name, multipliers: n.multipliers}`;
    let natures = await queryNeo4j(query);
    return natures;
}

const natureCtx = {
    getNatures
};

module.exports = natureCtx;
