

import { getGoogleReview } from '@/lib/data';
import Heading from './heading'
import Reviews from './reviews';
import { ReviewType } from '@/typeScriptType/review';
import { Suspense } from 'react';


const GoogleReviews = async () => {
  const data = await getGoogleReview()

  const reviews: ReviewType[] = data.result?.reviews || [];
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