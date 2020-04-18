const {getFilterOption, getConfigOption} = require("../cli");

module.exports = options => {
    const filter = getFilterOption(options);
    const config = getConfigOption(options);

    console.log(filter, config);
};