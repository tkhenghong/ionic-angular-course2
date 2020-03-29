// His way to create Place object
export class Place {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public imageUrl: string,
    public price: number,
    public dateFrom?: string,
    public dateTo?: string,
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
