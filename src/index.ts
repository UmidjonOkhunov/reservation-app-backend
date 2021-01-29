import fastify, {FastifyInstance} from "fastify";
import fastifyBlipp from "fastify-blipp";
import { Server, IncomingMessage, ServerResponse } from "http";
import {findAll, findById, reserve, deleteById, update} from "./modules/routes/status";
import { dbConfig } from "./models";


const server: FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify();

server.register(require('fastify-cors'))
server.register(fastifyBlipp);
server.register(findAll);
server.register(findById);
server.register(reserve);
server.register(deleteById);
server.register(update);

const start = async () => {
  try {
    await server.listen(3001, "0.0.0.0");
    server.blipp();
  } catch (err) {
    console.log(err);
    server.log.error(err);
    process.exit(1);
  }
};

dbConfig
    .sync().then(() => console.log("connected to db"))            
    .catch(() => {            
        throw "error";       
     });

process.on("uncaughtException", error => {
  console.error(error);
});
process.on("unhandledRejection", error => {
  console.error(error);
});

start();
