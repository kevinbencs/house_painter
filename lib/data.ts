import { cacheLife, cacheTag } from 'next/cache'

import Price from '@/models/Price'
import Image from '@/models/Image'
import { Img } from '@/typeScriptType/img'
import { MongoData } from '@/typeScriptType/price'
import { Categories } from '@/typeScriptType/price'


export const getPriceData = async () => {
    'use cache'
    cacheLife('hours')
    cacheTag('price-data')

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

    const docs: Categories[] = await Price.aggregate([
        { $group: { _id: "$category" } }
    ])


    return docs.map(doc => ({ _id: String(doc._id) }))
}

export const getAllImg = async () => {
    'use cache'
    cacheLife('hours')
    cacheTag('img-data')

    const imgs: Img[] = await Image.find({}, {_id: 1, show: 1, newUrl:1, detail: 1}).lean();

    return imgs.map(img => ({
        ...img,
        _id: String(img._id)
    }))
}