import bcrypt from 'bcrypt';
import { User } from '../models/user'; // Asegúrate de que la ruta sea correcta
import sequelize from '../db/connection';

export const seedUsers = async () => {
  try {
    //await sequelize.sync({ force: true }); // Esto eliminará y recreará las tablas

    const users = [
      {
        username: 'admin',
        password: '123'
      }
    ];

    // Encriptar las contraseñas
    const saltRounds = 10;
    for (const user of users) {
      user.password = await bcrypt.hash(user.password, saltRounds);
    }

    await User.bulkCreate(users);
    console.log('Users have been seeded');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    // await sequelize.close();
  } 
};

seedUsers();