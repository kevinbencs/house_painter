"use client"

import Link from "next/link"
import { MdDelete } from "react-icons/md";

interface List {
  id: string,
  title: string,
  year: string,
  month: string,
  day: string
}

const UpdatePagesList = (props: { lists: List[], page: string }) => {

  const deleteItem = async () => { }


  return (
    <section>
      {props.lists.map((item) => <Link href={`dashboard/update/${props.page}/${item.year}/${item.month}/${item.day}/${item.title.toLowerCase().replaceAll(' ', '-')}`} key={item.id}>
        <div>{item.title}</div>
        <div onClick={deleteItem}><MdDelete /></div>
      </Link>)}
    </section>
  )
}

export default UpdatePagesList