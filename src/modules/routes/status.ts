import fp from "fastify-plugin";
import {Reservations} from "../../models/index"
import { ReservationsAttributes } from '../../types/api-rest';

export const findAll =  fp(async (server:any, opts:any, next:any) => {
  server.route({
    url: "/status",
    logLevel: "warn",
    method: ["GET", "HEAD"],
    handler: async (request: any, reply: any ) => {
      const reservations = await Reservations.findAll();
      console.log(JSON.stringify(reservations, null, 2))
      return reply.send( JSON.stringify(reservations, null, 2));
    }
  });
  next();
});

export const findById = fp(async (server:any, opts:any, next:any) => {
  server.route({
    url: "/status/:id",
    logLevel: "warn",
    method: ["GET", "HEAD"],
    handler: async (request: any, reply: any ) => {
      const _id = request.params.id;
      const { Op } = require("sequelize");
      const reservation = await Reservations.findOne({
        where:{
          id:{
            [Op.eq]: _id
          }
        }
      });

      if (reservation) {
        return reply.send( JSON.stringify(reservation, null, 2));
      } else {
        return reply.code(404).send(JSON.stringify({ 
          error: "Not Found" 
        }, null, 2));
      }
    }
  });
  next();
});

const overlaps = async(body: { startDate: Date; endDate: Date; })=>{
  const { Op } = require("sequelize");
  const output = await Reservations.findOne({where: {
    [Op.or]: [{
    [Op.and]: [
      { startDate: {[Op.gte]: body.startDate} },
      { endDate: {[Op.lte]: body.startDate} }
    ]},
    {
      [Op.and]: [
        { startDate: {[Op.gte]: body.endDate} },
        { startDate: {[Op.lte]: body.startDate} }
      ]
    }]
  }})

  return output
}

export const reserve = fp(async (server:any, opts:any, next:any) => {
  server.route({
    url: "/status",
    logLevel: "warn",
    method: ["POST"],
    handler: async (request:any, reply: any ) => {
      try{
        if (!request.body) {
          return reply.code(400).send(JSON.stringify({ 
            error: 'content missing' 
          }, null, 2));
        }
        
        // Check whether the reservation time overlaps
        const overl = await overlaps(request.body);
        if (overl){
          request.log.error("The reservation time is overlapping");
          return reply.code(400).send(JSON.stringify({ 
            error: "The reservation time is overlapping" 
          }, null, 2));
        }
        
        const reservation = await Reservations.create(request.body);

        return reply.code(201).send(JSON.stringify(reservation, null, 2));

      } catch (error) {
        request.log.error(error);
        return reply.code(500).end();
      }
      

      
    }
  });
  next();
});

export const deleteById = fp(async (server:any, opts:any, next:any) => {
  server.route({
    url: "/status/:id",
    logLevel: "warn",
    method: ["DELETE"],
    handler: async (request: any, reply: any ) => {
      const _id = request.params.id;
      const reservation = await Reservations.destroy({ where:{id: _id }});
      return reply.code(204).end();
    }
  });
  next();
});


export const update = fp(async (server:any, opts:any, next:any) => {
  server.route({
    url: "/status/:id",
    logLevel: "warn",
    method: ["PUT","PATCH"],
    handler: async (request: any, reply: any ) => {
      const _id = request.params.id;

      // Check whether the reservation time overlaps
      const overl = await overlaps(request.body);
      if (overl){
        request.log.error("The reservation time is overlapping");
        return reply.code(400).end();
      }

      const [,reservation] = await Reservations.update(request.body,{ where:{id: _id }});
      
      return reply.send( JSON.stringify(reservation, null, 2));
      // return reply.send( Reservations);
    }
  });
  next();
});