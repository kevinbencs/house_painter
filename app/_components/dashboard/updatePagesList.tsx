"use client"

import { deleteBlog } from "@/action/deleteBlog";
import { deletePlace } from "@/action/deletePlace";
import { deleteService } from "@/action/deleteService";
import { BSPClientList } from "@/typeScriptType/blogServPlace";
import Link from "next/link"
import { MdDelete } from "react-icons/md";
import { FaPlusCircle } from "react-icons/fa";
import { displayBlog } from "@/action/displayBlog";
import { displayService } from "@/action/displayService";




const UpdatePagesList = (props: { list: BSPClientList[], page: string, }) => {

  const deleteItem = async (id: string) => {
    switch (props.page) {
      case "blog":
        const res = await deleteBlog(id);
        if (res.error) alert(res.error);
        if (res.failed) alert(res.failed.join(" "));
        break;
      case "service":
        const resSer = await deleteService(id);
        if (resSer.error) alert(resSer.error);
        if (resSer.failed) alert(resSer.failed.join(" "));
        break;
      case "place":
        const resPla = await deletePlace(id);
        if (resPla.error) alert(resPla.error);
        if (resPla.failed) alert(resPla.failed.join(" "));
        break;
    }
  }

  const displayItem = async (id: string) => {
    switch (props.page) {
      case "blog":
        const res = await displayBlog(id);
        if (res.error) alert(res.error);
        if (res.failed) alert(res.failed.join(" "));
        break;
      case "service":
        const resSer = await displayService(id);
        if (resSer.error) alert(resSer.error);
        if (resSer.failed) alert(resSer.failed.join(" "));
        break;
      case "place":
        const resPla = await dispalyPlace(id);
        if (resPla.error) alert(resPla.error);
        if (resPla.failed) alert(resPla.failed.join(" "));
        break;
    }
  }


  return (
    <section>
      {props.list.map((item) => <li className="flex justify-between w-full mb-2 border-b-2" key={item.id}>
        <Link href={`/dashboard/update/${props.page}/${item.year}/${item.month}/${item.day}/${item.title.toLowerCase().replaceAll(' ', '-')}`} className="w-full" >{item.title}</Link>
        {item.hide === false && < button onClick={() => deleteItem(item.id)} className="p-2 text-red-600"><MdDelete /></button>}
        {item.hide === true && < button onClick={() => displayItem(item.id)} className="p-2 text-green-600"><FaPlusCircle /></button>}
      </li>)
      }
    </section >
  )
}

export default UpdatePagesList