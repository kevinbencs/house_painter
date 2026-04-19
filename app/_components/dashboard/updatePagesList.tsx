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

  const deleteItem = async (id: string) => { }


  return (
    <section>
      {props.lists.map((item) => <li className="flex justify-between w-full mb-2 border-b-2" key={item.id}>
        <Link href={`/dashboard/update/${props.page}/${item.year}/${item.month}/${item.day}/${item.title.toLowerCase().replaceAll(' ', '-')}`}  className="w-full" >{item.title}</Link>
        <button onClick={() => deleteItem(item.id)} className="p-2"><MdDelete /></button>
      </li>)}
    </section>
  )
}

export default UpdatePagesList