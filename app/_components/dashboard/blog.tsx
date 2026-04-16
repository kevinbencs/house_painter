"use client"

import { writeBlog } from "@/action/writeBlog";
import DynamicPagesForm from "./dynamicPagesForm";
import * as z from 'zod';


const Blog = (props: {
    params: { year: string, month: string, day: string, title: string }, res: {
        error: string,
        failed: undefined,
        data: undefined,
    } | {
        failed: z.ZodIssue[],
        error: undefined,
        data: undefined,
    } | {
        data: {
            title: string,
            text: string,
            cover_img_id: string,
            keyword: string[],
            id: string,
            detail: string,
        };
        error: undefined,
        failed: undefined,
    }
}) => {



    return (
        <DynamicPagesForm params={props.params} res={props.res} serverAction={writeBlog} />
    )
}

export default Blog