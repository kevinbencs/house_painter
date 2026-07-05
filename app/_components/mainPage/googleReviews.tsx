
import { cacheLife } from 'next/cache';
import Heading from './heading'
import Reviews from './reviews';
import {  ReviewType } from '@/typeScriptType/review';
import { Suspense } from 'react';


const GoogleReviews = async () => {
  'use cache'
  cacheLife('days')
  const placeId = process.env.PLACE_ID;
  const apiKey = process.env.GOOGLE_PLACE_API;
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}&language=hu`
  );
  const data = await res.json();

  const reviews:  ReviewType[] = data.result?.reviews || [];
  return (
    <section >
      <Heading text='Néhány vélemény rólam' />
      <Suspense fallback={`Loading...`}>
        {reviews.length === 0 ? (
          <p>Még nincsenek megjeleníthető vélemények.</p>
        ) : <Reviews data={reviews} />}
      </Suspense>


    </section>
  )
}

export default GoogleReviews