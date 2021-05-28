import { IProductServer } from './product.model';

export interface ICartServer {
  total: number;
  data: [
    {
      product: IProductServer;
      numInCart: number;
    }
  ];
}

export interface ICartPublic {
  total: number;
  productInfo: [
    {
      _id: string;
      inCart: number;
    }
  ];
}
