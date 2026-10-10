import Step1 from '@/app/_components/dashboard/main/chart';
import PieChartDefaultIndex from '@/app/_components/dashboard/main/pie';
import { checkAuth } from '@/lib/checkAuth';
import { getDashboardData } from '@/lib/data';
import { ChartType, ChartType2, PieType } from '@/typeScriptType/dashboard';
import { redirect } from 'next/navigation';

const page = async () => {

  const auth = await checkAuth()

  if (auth.error) redirect('/');

  const res = await getDashboardData()


  const perDay: ChartType[] = Object.entries(
    res[0].reduce((acc, { _id, count }: { _id: { date: string }, count: number }) => {
      acc[_id.date] = (acc[_id.date] ?? 0) + count;
      return acc;
    }, {} as Record<string, number>)
  ).map(([date, count]) => ({ date, count })) as ChartType[];

  const perReferrer: PieType[] = Object.entries(
    res[0].reduce((acc, { _id, count }: { _id: { referrer: string }, count: number }) => {
      acc[_id.referrer] = (acc[_id.referrer] ?? 0) + count;
      return acc;
    }, {} as Record<string, number>)
  ).map(([referrer, count]) => ({ referrer, count })) as PieType[];



  return (
    <div className='w-full'>
      <div className='flex gap-10'>
        <Step1 data={perDay.map((item) => ({ name: item.date, amt: 2400, Látogatottság: item.count }))} />
        <PieChartDefaultIndex data={perReferrer.map((item) => ({ name: (item.referrer === null || item.referrer === 'null') ? "Keresők" : item.referrer, value: item.count }))} />
      </div>
      <section>
        <h2>Utoljára elkészített oldalak</h2>
        <div className='flex gap-2 flex-col'>
          <div>
            {res[1].map((item) => <a href={"/blog/" + item.heading.replaceAll(" ", "-")} target='_blank' key={String(item._id) + 'dashboard'}>{item.heading}</a>)}
          </div>

          <div>
            {res[2].map((item) => <a href={"/helyek/" + item.heading.slice(0, item.heading.indexOf('.') + 9).replaceAll(' ', '-')} target='_blank' key={String(item._id) + 'dashboard'}>{item.heading}</a>)}
          </div>
          <div>
            {res[3].map((item) => <a href={"/szolgaltatas/" + item.heading.replaceAll(" ", "-")} target='_blank' key={String(item._id) + 'dashboard'}>{item.heading}</a>)}
          </div>
        </div>
      </section>
    </div>
  )
}

export default page