import { registerAs } from '@nestjs/config';
import { UserSubscriber } from "../utils/subscribers/user.subscriber";

export default registerAs('database', () => {
  return {
    type: 'mariadb',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    autoLoadEntities: true,
    cache: false,
    subscribers: [UserSubscriber],
    migrations: ['dist/db/migrations/*.{ts,js}'],
    cli: {
      migrationsDir: 'src/migrations',
    },
  };
});
