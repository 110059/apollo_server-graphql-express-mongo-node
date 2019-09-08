const { UserModel } = require('./models')

async function seedUsers() {
  await UserModel.deleteMany({});

  const user1 = new UserModel({
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Engineer'
  });

  const user2 = new UserModel({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'Supervisor'
  });

  await user1.save();
  await user2.save();

  console.log('INFO: User DB seeded')
}

module.exports = {
  seedUsers
}
