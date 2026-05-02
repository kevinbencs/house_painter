import { cacheLife } from 'next/cache'
import Price from '@/models/Price'

export const getPriceData = async () => {
    'use cache'
    cacheLife('hours')

    return Price.find({}, { _id: 1, name: 1, price: 1, category: 1 }).sort({ category: 1 });

}


export const getCategory = async () => {
    'use cache'
    cacheLife('hours')

    return Price.aggregate(
        [
            {
                $group: {
                    _id: "$category",
                }
            }
        ]
    )
}