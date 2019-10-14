import "reflect-metadata";
import { createConnection, Connection } from 'typeorm';

const connection: Promise<Connection> = createConnection();

/*
Note that if we need to override the ormconfig.json entries, 
we have to import ConnectionOption as well from typeorm, create
a ConnectionOption and pass it to createConnection()
E.g.
const connectionOptions: ConnectionOptions = {
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'bookexampledbpassword',
    database: 'bookexample',
    synchronize: true, //only use in development environment. Use migration for upgrades in production
    logging: false
};

const connection: Promise<Connection> = createConnection(connectionOptions);
*/

export default connection;


