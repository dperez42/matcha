const bcrypt = require("bcrypt")

// hash password 
async function hashPassword(plaintextPassword) {
    const hash = await bcrypt.hash(plaintextPassword, 10);
    return hash;
}
 
// compare password
async function comparePassword(plaintextPassword, hash) {
    const hash1 = await bcrypt.hash(plaintextPassword, 10);
    console.log(plaintextPassword)
    console.log(hash1)
    const result = await bcrypt.compare(plaintextPassword, hash);
    return result;
}

module.exports = {
    hashPassword,
    comparePassword
}