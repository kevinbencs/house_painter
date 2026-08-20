

import { getGoogleReview } from '@/lib/data';
import Heading from './heading'
import Reviews from './reviews';
import { ReviewType } from '@/typeScriptType/review';


const GoogleReviews = async () => {
  const data = await getGoogleReview()

  const reviews: ReviewType[] = data.result?.reviews || [];
  return (
    <section >
      <Heading text='Néhány vélemény rólam' />
        {reviews.length === 0 ? (
          <p>Még nincsenek megjeleníthető vélemények.</p>
        ) : <Reviews data={reviews} />}


    </section>
  )
}

export default GoogleReviews