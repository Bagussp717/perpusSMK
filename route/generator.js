const crypto = require('crypto');

function generateSalt() {
    return crypto.randomBytes(16).toString('hex');
  }
  
  function hashPassword(password, salt, pepper) {
    const hash = crypto.createHmac('sha256', salt + pepper);
    hash.update(password);
    const hashedPassword = hash.digest('hex');
    return hashedPassword;
  }

module.exports = { generateSalt, hashPassword };