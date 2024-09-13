import { ConnectionOptions } from "typeorm";

const entities = [__dirname + "/entity/*.*"];
export const databaseConfig: ConnectionOptions = {
  type: "mysql",
  host: "",
  port: 3306,
  username: "",
  password: "",
  database: "",
  entities: entities,
  synchronize: true,
  timezone: "Z",
};
