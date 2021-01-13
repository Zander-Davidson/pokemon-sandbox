const itemCtx = require("../contexts/itemCtx");

exports.getItemNames = async (req, res) => {
    let itemNames = await itemCtx.getItemNames();

    if (itemNames && Array.isArray(itemNames)) {
        res.status(200).json({
            message: `Returned ${itemNames.length} item names.`,
            itemNames: itemNames
        });
    }  else {
        res.status(500).json({
            message: 'An unexpected internal error occurred.'
        });
    }
}

exports.getItem = async (req, res) => {
    let params = { name: req.params.name ? req.params.name.toLowerCase() : null };
    let items = await itemCtx.getItem(params);

    if (items && Array.isArray(items)) {
        res.status(200).json({ 
            message: `Returned ${items.length} item(s).`,
            items: items
        });
    } else if (!items) {
        res.status(400).json({
            message: 'That item could not be found.'
        });
    } else {
        res.status(500).json({
            message: 'An unexpected internal error occurred.'
        });
    }
};