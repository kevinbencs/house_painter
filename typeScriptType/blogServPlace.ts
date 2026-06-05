export interface BSP {
    heading: string,
    text: string, 
    keywords: string,
    detail: string,
    image: string,
    visibility: boolean
}


export interface BSPAdmin {
    heading: string,
    _id: string
    visibility: boolean
}


export interface BSPClientList {
  id: string,
  title: string,
  year: number,
  month: number,
  day: number,
  visibility: boolean
}

export interface BSPGetUpdateList {
    _id: string,
    visibility: boolean,
    createdAt: Date,
    heading: string
}


export interface BSPPublicPagesList {
    _id: string,
    visibility: boolean,
    image: Date,
    heading: string
}