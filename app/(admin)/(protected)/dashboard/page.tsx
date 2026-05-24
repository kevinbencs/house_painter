import Step1 from '@/app/_components/dashboard/main/chart';
import PieChartDefaultIndex from '@/app/_components/dashboard/main/pie';
import { checkAuth } from '@/lib/checkAuth';
import Blog from '@/models/Blog';
import PageView from '@/models/PageView';
import Place from '@/models/Place';
import Service from '@/models/Service';
import { redirect } from 'next/navigation';
import { connection } from 'next/server'

const page = async () => {
  await connection();
  /*const auth = await checkAuth()

  if (auth.error) redirect('/');*/



  const res = await Promise.all([
    PageView.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            referrer: "$referrer"
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]),
    Blog.find({}, { _id: 1, heading: 1, createdAt: 1 }).limit(2),
    Place.find({}, { _id: 1, heading: 1, createdAt: 1 }).limit(2),
    Service.find({}, { _id: 1, heading: 1, createdAt: 1 }).limit(2)
  ])

  console.log(res)

  const perDay = Object.entries(
    res[0].reduce((acc, { _id, count }) => {
      acc[_id.date] = (acc[_id.date] ?? 0) + count;
      return acc;
    }, {} as Record<string, number>)
  ).map(([date, count]) => ({ date, count }));

  const perReferrer = Object.entries(
    res[0].reduce((acc, { _id, count }) => {
      acc[_id.referrer] = (acc[_id.referrer] ?? 0) + count;
      return acc;
    }, {} as Record<string, number>)
  ).map(([referrer, count]) => ({ referrer, count }));

  console.log(perReferrer)

  return (
    <div className='w-full'>
      <div className='flex gap-10'>
        <Step1 />
        <PieChartDefaultIndex />
      </div>

    </div>
  )
}

export default page