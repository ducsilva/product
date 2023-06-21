export type Product = {
  title?: string;
  price?: number;
  thumbnail?: string;
  id: number;
  description?: string;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  category?: string;
  images?: Array<string>;
};

export type UserApiResponse = {
  data: Array<Product>;
  total: number;
};
