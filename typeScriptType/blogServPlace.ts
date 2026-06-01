export interface BSP {
    heading: string,
    text: string, 
    keywords: string[],
    detail: string,
    image: string,
    hide: boolean
}


export interface BSPAdmin {
    heading: string,
    _id: string
    hide: boolean
}


export interface BSPClientList {
  id: string,
  title: string,
  year: number,
  month: number,
  day: number,
  hide: boolean
}

export interface BSPGetUpdateList {
    _id: string,
    hide: boolean,
    createdAt: Date,
    heading: string
}


export interface BSPPublicPagesList {
    _id: string,
    hide: boolean,
    image: Date,
    heading: string
}