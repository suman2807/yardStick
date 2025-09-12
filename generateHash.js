const bcrypt = require('bcryptjs');

const password = 'password';
const saltRounds = 10;

bcrypt.hash(password, saltRounds).then(hash => {
  console.log('Hashed password:', hash);
});