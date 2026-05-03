export interface ElementOfPrice {
  _id: string,
  name: string,
  category: string,
  price: string,
  categories: string[],
  unitOfMea: string
}

export interface MongoData {
  _id: string,
  name: string,
  category: string,
  price: number,
  unitOfMea: string
}


export interface Categories {
  _id: string
}