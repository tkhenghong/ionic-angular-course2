import { PlaceLocation } from "./location.model";

// His way to create Place object
export class Place {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public imageUrl: string,
    public price: number,
    public availableFrom: Date,
    public availableTo: Date,
    public userId: string,
    public location: PlaceLocation
  ) {}
}

// Our way to create Place object
// export interface Place2 {
//   id: string;
//   title: string;
//   description: string;
//   imageUrl: string;
//   price: number;
// }
