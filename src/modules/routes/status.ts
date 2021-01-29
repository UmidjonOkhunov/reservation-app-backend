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
      const reservations = await Reservations.findAll({
        where:{
          id:{
            [Op.eq]: _id
          }
        }
      });

      return reply.send( JSON.stringify(reservations, null, 2));
      // return reply.send( Reservations);
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
    handler: async (request: any, reply: any ) => {
      try{
        // const body = JSON.parse(request.body);
        
        // Check whether the reservation time overlaps
        const overl = await overlaps(request.body);
        if (overl){
          request.log.error("The reservation time is overlapping");
          return reply.send(400);
        }
        
        const reservation = await Reservations.create(request.body);

        return reply.code(201).send(JSON.stringify(reservation, null, 2));

      } catch (error) {
        request.log.error(error);
        return reply.send(500);
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
      return reply.send( JSON.stringify(reservation, null, 2));
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
        return reply.send(400);
      }

      const [,reservation] = await Reservations.update(request.body,{ where:{id: _id }});
      
      return reply.send( JSON.stringify(reservation, null, 2));
      // return reply.send( Reservations);
    }
  });
  next();
});