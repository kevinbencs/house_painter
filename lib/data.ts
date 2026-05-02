import { cacheLife,cacheTag } from 'next/cache'

import Price from '@/models/Price'

export const getPriceData = async () => {
    'use cache'
    cacheLife('hours')
    cacheTag('price-data')

    const docs = await Price.find({}, { _id: 1, name: 1, price: 1, category: 1, unitOfMea: 1 })
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

    const docs = await Price.aggregate([
        { $group: { _id: "$category" } }
    ])


    return docs.map(doc => ({ _id: String(doc._id) }))
}