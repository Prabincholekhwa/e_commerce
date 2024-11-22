import sequelize from 'sequelize';
import { generateRandomHex } from '../../utils/helpers';

export class Database {
  public sequelize: sequelize.Sequelize;
  private static instance: Database;
  private dialect: sequelize.Dialect;
  private dbname: string;
  private username: string;
  private password: string;
  private host: string;
  private port: number;
  private maxPool: number;
  private minPool: number;

  private constructor() {
    this.dialect = process.env.POSTGRES_DIALECT as sequelize.Dialect;
    this.dbname = process.env.POSTGRES_NAME!;
    this.username = process.env.POSTGRES_USER!;
    this.password = process.env.POSTGRES_PASS!;
    this.host = process.env.POSTGRES_HOST!;
    this.port = +process.env.POSTGRES_PORT!;
    this.maxPool = 10;
    this.minPool = 1;

    this.sequelize = new sequelize.Sequelize(
      this.dbname,
      this.username,
      this.password,
      {
        host: this.host,
        dialect: this.dialect,
        dialectOptions: {
          encrypt: true,
          ssl: {
            require: true,
          },
        },
        port: this.port,
        logging: false,
        pool: {
          max: this.maxPool,
          min: this.minPool,
          acquire: 30000,
          idle: 10000,
        },
        define: {
          timestamps: true,
          createdAt: 'inserted',
          updatedAt: 'updated',
        },
      }
    );

    this.sequelize.beforeValidate((instance: any, options: any) => {
      instance.id = generateRandomHex();
    });
  }

  static get(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }

  async connection() {
    try {
      await this.sequelize.authenticate();
      console.log('Database connected successfully!');
    } catch (error: any) {
      console.log(error);
      throw new Error('Connection failed!');
    }
  }
}

export const database = Database.get();
