const bcrypt = require('bcryptjs');

async function gen() {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('Admin@123', salt);
  console.log(hash);
}

gen();
