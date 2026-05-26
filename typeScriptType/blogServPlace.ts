export interface BSP {
    heading: string,
    text: string, 
    keywords: string[],
    detail: string,
    image: string,
    hide: boolean
}


export interface BSPClientList {
  id: string,
  title: string,
  year: string,
  month: string,
  day: string,
  hide: boolean
}