import { cacheLife, cacheTag } from 'next/cache'

import Price from '@/models/Price'
import Image from '@/models/Image'
import { Img, ImgWithoutBlob } from '@/typeScriptType/img'
import { MongoData } from '@/typeScriptType/price'
import { Categories } from '@/typeScriptType/price'
import { BSPRender } from '@/typeScriptType/blogServPlace'
import Blog from '@/models/Blog'
import Place from '@/models/Place'
import Service from '@/models/Service'
import { connectToMongo } from '@/lib/mongo'


export const getPriceData = async () => {
    'use cache'
    cacheLife('hours')
    cacheTag('price-data')

    await connectToMongo()

    const docs: MongoData[] = await Price.find({}, { _id: 1, name: 1, price: 1, category: 1, unitOfMea: 1 })
        .sort({ category: 1 })
        .lean()

    return docs.map(doc => ({
        ...doc,
        _id: String(doc._id),
    }))

}


export const getCategory = async () => {
    'use cache'
    cacheLife('hours')
    cacheTag('price-cat')

    await connectToMongo()

    const docs: Categories[] = await Price.aggregate([
        { $group: { _id: "$category" } }
    ])


    return docs.map(doc => ({ _id: String(doc._id) }))
}

export const getAllImg = async () => {

    const imgs: Img[] = await Image.find({}, { _id: 1, show: 1, newUrl: 1, detail: 1 }).lean();

    return imgs.map(img => ({
        ...img,
        _id: String(img._id)
    }))
}


export const getNumbOfImag = async () => {
    'use cache'
    cacheLife('hours')
    cacheTag('img-numb')

    await connectToMongo()

    const numb = await Image.estimatedDocumentCount();

    return Math.ceil(numb / 20);
}


export const getTwentyImg = async (page: number) => {
    'use cache'
    cacheLife('hours')
    cacheTag('img-data-'+String(page))

    await connectToMongo()

    const imgs: ImgWithoutBlob[] = await Image.find({}, { _id: 1, show: 1, newUrl: 1, detail: 1 }).skip((page - 1) * 20).limit(20).lean();

    return imgs.map(img => ({
        ...img,
        _id: String(img._id)
    }))
}


export const getBlogByHeading = async (heading: string): Promise<BSPRender | null> => {
    'use cache'
    cacheTag(`blog-${heading}`)
    cacheLife('days')

    await connectToMongo()


    return Blog.findOne({
        heading: heading.replaceAll('-', ' ')
    })
}


export const getPlaceByHeading = async (heading: string): Promise<BSPRender | null> => {
    'use cache'
    cacheTag(`place-${heading}`)
    cacheLife('days')

    await connectToMongo()


    return Place.findOne({
        heading: heading.replaceAll('-', ' ')
    })
}

export const getServiceByHeading = async (heading: string): Promise<BSPRender | null> => {
    'use cache'
    cacheTag(`service-${heading}`)
    cacheLife('days')

    await connectToMongo()


    return Service.findOne({
        heading: heading.replaceAll('-', ' ')
    })
}


export const getPlaceFooter = async () => {
    'use cache'
    cacheTag('place-footer')
    cacheLife('days')

    await connectToMongo()

    return Place.find({visibility: true}, {_id: 1, heading: 1, visibility: 1})
}


export const getServiceFooter = async () => {
    'use cache'
    cacheTag('service-footer')
    cacheLife('days')

    await connectToMongo()

    return Service.find({visibility: true}, {_id: 1, heading: 1, visibility: 1}).limit(10)
}

export const getServiceTopBar = async() => {
    'use cache'
    cacheTag('service-topbar')
    cacheLife('days')

    await connectToMongo()

    return Service.find({visibility: true}, {_id: 1, heading: 1, visibility: 1}).limit(4)
}


export const getBlogMainPage = async () => {
    'use cache'
    cacheTag('main-page-blogs')
    cacheLife('days')

    await connectToMongo()

    return Blog.find({visibility: true},{_id:1, heading:1, visibility:1, image: 1}).limit(5)

}


export const getServiceMainPage = async () => {
    'use cache'
    cacheTag('main-page-services')
    cacheLife('days')

    await connectToMongo()

    return Service.find({visibility: true},{_id:1, heading:1, visibility:1, image: 1}).limit(5)

}

export const getImagesMainPage = async () => {
    'use cache'
    cacheTag('main-page-images')
    cacheLife('days')

    await connectToMongo()

    const imgs: ImgWithoutBlob[]  = await Image.find({},{_id: 1, newUrl: 1, detail: 1, show: 1}).limit(5).lean();

    return imgs.map(img => ({
        ...img,
        _id: String(img._id)
    }))
 
}


export const getGoogleReview = async () => {
    'use cache'
  cacheLife('max')
  const placeId = process.env.PLACE_ID;
  const apiKey = process.env.GOOGLE_PLACE_API;
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}&language=hu`
  );
  return res.json();
}