export interface Img {
  _id: string,
  newUrl: string,
  detail: string,
  show: boolean,
  blobUrl: string
}


export interface ImgWithoutBlob {
  _id: string,
  newUrl: string,
  detail: string,
  show: boolean,
}
