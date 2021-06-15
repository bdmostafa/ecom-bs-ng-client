export interface IProduct {
    _id: string;
    title: string;
    category: string;
    description: string;
    price: number;
    image: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    images: string;
  }
  
  export interface ServerResponse {
    count: number;
    products: IProduct[];
  }