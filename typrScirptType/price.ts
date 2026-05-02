export interface ElementOfPrice {
  _id: string,
  name: string,
  category: string,
  price: string,
  categories: string[]
}

export interface MongoData {
  _id: string,
  name: string,
  category: string,
  price: number,
}


export interface Categories {
  _id: string
}