import { BuildOptions, Model } from "sequelize";

export interface ReservationsAttributes {
  id?: number;
  title: string;
  location:string;
  startDate: Date;
  endDate: Date;
  notes:string;
}
export interface ReservationsModel extends Model<ReservationsAttributes>, ReservationsAttributes {}
export class Reservations extends Model<ReservationsModel, ReservationsAttributes> {}
export type ReservationsStatic = typeof Model & {
   new (values?: object, options?: BuildOptions): ReservationsModel;
};