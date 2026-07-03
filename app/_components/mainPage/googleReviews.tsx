
import { cacheLife } from 'next/cache';
import Heading from './heading'



const GoogleReviews = async() => {
  'use cache'
  cacheLife('days')
  const placeId = process.env.PLACE_ID;
  const apiKey = process.env.GOOGLE_PLACE_API;
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}&language=hu`
  );
   const data = await res.json();
   console.log(data)
   const reviews = data.result?.reviews || [];
  return (
    <section >
      <Heading text='Néhány vélemény rólam'/>
      {reviews.length === 0 ? (
        <p>Még nincsenek megjeleníthető vélemények.</p>
      ) : (
        reviews.map((review: any, i: number) => (
          <div key={'review' + i}>
            <strong>{review.author_name}</strong>
            <span>{'⭐'.repeat(review.rating)}</span>
            <p>{review.text}</p>
          </div>
        ))
      )}
    </section>
  )
}

export default GoogleReviews