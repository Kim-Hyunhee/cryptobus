import { createConnection } from "typeorm";
import app from "./app";
import { databaseConfig } from "./database";
import { swaggerUi, specs } from "./swagger";

const port = 8008;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.listen(port, () => {
  console.log(`Leading Server listening on port ${port}`);
  createConnection(databaseConfig);
});
