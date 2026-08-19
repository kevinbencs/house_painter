import { cacheLife, cacheTag } from 'next/cache'

import Price from '@/models/Price'
import Image from '@/models/Image'
import { Img, ImgWithoutBlob } from '@/typeScriptType/img'
import { MongoData } from '@/typeScriptType/price'
import { Categories } from '@/typeScriptType/price'
import { BSPHeading, BSPRender, PlaceRender } from '@/typeScriptType/blogServPlace'
import Blog from '@/models/Blog'
import Place from '@/models/Place'
import Service from '@/models/Service'
import { connectToMongo, handleMongooseError } from '@/lib/mongo'


export const getPriceData = async () => {
    try {
        'use cache'
        cacheLife('hours')
        cacheTag('price-data')

        await connectToMongo()

        const docs: MongoData[] = await Price.find({}, { _id: 1, name: 1, price: 1, category: 1, unitOfMea: 1 }).sort({ category: -1 }).lean()

        return docs.map(doc => ({
            ...doc,
            _id: String(doc._id),
        }))
    } catch (error) {
        const err = await handleMongooseError(error);
        return { error: err }
    }


}


export const getCategory = async () => {
    try {
        'use cache'
        cacheLife('hours')
        cacheTag('price-cat')

        await connectToMongo()

        const docs: Categories[] = await Price.aggregate([
            { $group: { _id: "$category" } }
        ]).sort({ _id: -1 })

        return docs.map(doc => ({ _id: String(doc._id) }))
    } catch (error) {
        const err = await handleMongooseError(error);
        return { error: err }
    }

}

export const getAllImg = async () => {
    try {
        const imgs: Img[] = await Image.find({}, { _id: 1, show: 1, newUrl: 1, detail: 1, createdAt: 1 }).sort({ createdAt: -1 }).lean();

        return imgs.map(img => ({
            ...img,
            _id: String(img._id)
        }))
    } catch (error) {
        const err = await handleMongooseError(error);
        return { error: err }
    }


}


export const getNumbOfImagPage = async () => {
    try {
        'use cache'
        cacheLife('hours')
        cacheTag('img-numb')

        await connectToMongo()

        const numb = await Image.estimatedDocumentCount();

        return Math.ceil(numb / 20);
    } catch (error) {
        const err = await handleMongooseError(error);
        return { error: err }
    }

}


export const getTwentyImg = async (page: number) => {
    try {
        'use cache'
        cacheLife('hours')
        cacheTag('img-data-' + String(page))

        await connectToMongo()

        const imgs: ImgWithoutBlob[] = await Image.find({ show: true }, { _id: 1, show: 1, newUrl: 1, detail: 1, createdAt: 1 }).sort({ createdAt: -1 }).skip((page - 1) * 20).limit(20).lean();

        return imgs.map(img => ({
            ...img,
            _id: String(img._id)
        }))
    } catch (error) {
        const err = await handleMongooseError(error);
        return { error: err }
    }

}


export const getBlogByHeading = async (heading: string): Promise<BSPRender | null> => {
    try {
        'use cache'
        cacheTag(`blog-${heading}`)
        cacheLife('days')

        await connectToMongo()

        const data: BSPRender = await Blog.findOne({
            heading: heading.replaceAll('-', ' ')
        }).lean()

        if (!data) {
            return null
        }

        data._id = String(data._id)

        return data;
    } catch (error) {
        const err = await handleMongooseError(error);
        return { error: err }
    }

}


export const getPlaceByHeading = async (heading: string): Promise<PlaceRender | null> => {
    try {
        'use cache'
        cacheTag(`place-${heading}`)
        cacheLife('days')

        await connectToMongo()

        const data: PlaceRender = await Place.findOne({
            heading: { $regex: heading.replaceAll('-', ' ').replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" }
        }).lean();


        if (!data) {
            return null
        }

        return {
            ...data,
            _id: String(data._id),
        }
    } catch (error) {
        const err = await handleMongooseError(error);
        return { error: err }
    }

}

export const getServiceByHeading = async (heading: string): Promise<BSPRender | null> => {
    try {
        'use cache'
        cacheTag(`service-${heading}`)
        cacheLife('days')

        await connectToMongo()

        const data: BSPRender = await Service.findOne({
            heading: heading.replaceAll('-', ' ')
        }).lean()

        if (!data) {
            return null
        }

        data._id = String(data._id)

        return data
    } catch (error) {
        const err = await handleMongooseError(error);
        return { error: err }
    }

}


export const getPlaceFooter = async () => {
    try {
        'use cache'
        cacheTag('place-footer')
        cacheLife('days')

        await connectToMongo()

        const data: BSPHeading[] = await Place.find({ visibility: true }, { _id: 1, heading: 1, visibility: 1 }).lean()

        return data.map(item => ({
            ...item,
            _id: String(item._id)
        }))
    } catch (error) {
        const err = await handleMongooseError(error);
        return { error: err }
    }

}


export const getServiceFooter = async () => {
    try {
        'use cache'
        cacheTag('service-footer')
        cacheLife('days')

        await connectToMongo()

        const data = await Service.find({ visibility: true }, { _id: 1, heading: 1, visibility: 1 }).limit(10).lean()

        return data.map(item => ({
            ...item,
            _id: String(item._id)
        }))
    } catch (error) {
        const err = await handleMongooseError(error);
        return { error: err }
    }

}

export const getServiceTopBar = async () => {
    try {
        'use cache'
        cacheTag('service-topbar')
        cacheLife('days')

        await connectToMongo()

        const data = await Service.find({ visibility: true }, { _id: 1, heading: 1, visibility: 1 }).limit(4).lean()

        return data.map(item => ({
            ...item,
            _id: String(item._id)
        }))
    } catch (error) {
        const err = await handleMongooseError(error);
        return { error: err }
    }

}


export const getBlogMainPage = async () => {
    try {
        'use cache'
        cacheTag('main-page-blogs')
        cacheLife('days')

        await connectToMongo()

        const data = await Blog.find({ visibility: true }, { _id: 1, heading: 1, visibility: 1, image: 1 }).limit(5).lean()

        return data.map(item => ({
            ...item,
            _id: String(item._id)
        }))

    } catch (error) {
        const err = await handleMongooseError(error);
        return { error: err }
    }

}


export const getServiceMainPage = async () => {
    try {
        'use cache'
        cacheTag('main-page-services')
        cacheLife('days')

        await connectToMongo()

        const data = await Service.find({ visibility: true }, { _id: 1, heading: 1, visibility: 1, image: 1 }).limit(5).lean()

        return data.map(item => ({
            ...item,
            _id: String(item._id)
        }))

    } catch (error) {
        const err = await handleMongooseError(error);
        return { error: err }
    }

}

export const getImagesMainPage = async () => {
    try {
        'use cache'
        cacheTag('main-page-images')
        cacheLife('days')

        await connectToMongo()

        const imgs: ImgWithoutBlob[] = await Image.find({ show: true }, { _id: 1, newUrl: 1, detail: 1, show: 1 }).limit(5).lean();

        return imgs.map(img => ({
            ...img,
            _id: String(img._id)
        }))
    } catch (error) {
        const err = await handleMongooseError(error);
        return { error: err }
    }


}


export const getGoogleReview = async () => {
    try {
        'use cache'
        cacheLife('max')
        const placeId = process.env.PLACE_ID;
        const apiKey = process.env.GOOGLE_PLACE_API;
        const res = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}&language=hu`
        );
        return res.json();
    } catch (error) {
        const err = await handleMongooseError(error);
        return { error: err }
    }

}


export const getImgById = async (id: string) => {
    try {
        'use cache'
        cacheLife('max')
        cacheTag('img-id-' + id)

        const image = await Image.findById(id).lean();
        image['_id'] = String(image._id)
        return image
    } catch (error) {
        const err = await handleMongooseError(error);
        return { error: err }
    }

}