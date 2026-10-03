

import { getGoogleReview } from '@/lib/data';
import Heading from './heading'
import Reviews from './reviews';
import { ReviewType } from '@/typeScriptType/review';


const GoogleReviews = async () => {
  //const data = await getGoogleReview()

  const data = [
    {
      profile_photo_url: "https://lh3.googleusercontent.com/a/ACg8ocKNkaHor3A-ieg6XaOGrbcnstZqpc50eq1YMSoNVJdOMWqS0A=w72-h72-p-rp-mo-br100",
      author_name: "Rita Horváth",
      rating: 5,
      text: "Pontos,megbízható, gyors,alapos és korrekt áron dolgozó szakember. Jó szívvel ajánlom mindenkinek!",
    }, {
      profile_photo_url: "https://lh3.googleusercontent.com/a/ACg8ocJpBzcK819HKtV61UT4ovgh3i1uYyKkK78fQb_K610c1yIc6A=w72-h72-p-rp-mo-br100",
      author_name: "Gyula Jakab",
      rating: 5,
      text: "Minden rendben ment, teljesen elégedett vagyok.",
    }, {
      profile_photo_url: "https://lh3.googleusercontent.com/a/ACg8ocJGfbQBWkn9D5buIQXmrHc-Adaa6zYYbQofEukEVuQvACJ2uQ=w72-h72-p-rp-mo-br100",
      author_name: "Balázs Vantulek",
      rating:5,
      text: "Gyors, precíz, becsületes. Nagyon szépen dolgozik. Jó szívvel ajánlom.",
    }, {
      profile_photo_url: "https://lh3.googleusercontent.com/a-/ALV-UjXwihpbKrzxVnqEgN-LIoY4tfpf1d2saXFSXLYlk5ij182Z0Qbe=w72-h72-p-rp-mo-br100",
      author_name: "Tibor Takács",
      rating: 5,
      text: "Tiszta precize munkát végez.csak ajánlani tudom mindenkinek.",
    }, {
      profile_photo_url: "https://lh3.googleusercontent.com/a/ACg8ocInsYB00NWu6lL3LkD7kd32hmsRaYJdxra4mVQcP1NzyvBn9Q=w72-h72-p-rp-mo-br100",
      author_name: "Sanyi",
      rating: 5,
      text: "Korrekt, becsületes, tiszta munka. Jó áron.",
    }
  ]

  /*if (data.error) {
    return (
      <section >
        <Heading text='Néhány vélemény rólam' />
        <div className='text-center'>Hiba a vélemények lekérdezése során</div>
      </section>
    )
  }*/

  const reviews: ReviewType[] = data;
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