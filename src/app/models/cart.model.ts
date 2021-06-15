import { IProduct } from './product.model';

export interface ICartServer {
  total: number;
  data: [
    {
      product: IProduct;
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
