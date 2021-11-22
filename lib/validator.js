//Currently it is a simple validation
//Def not a production ready validation :) But should be good for now.

const validateInput = (input) =>
    (input.split('"').length - 1) % 2 === 0 && (input.split("'").length - 1) % 2 === 0


module.exports = { validateInput }