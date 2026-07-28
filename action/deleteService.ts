"use server"

import { checkAuth } from "@/lib/checkAuth";
import { handleMongooseError } from "@/lib/mongo";
import Service from "@/models/Service";
import { deleteSchema } from "@/schema/schema";
import { updateTag } from "next/cache";

export const deleteService = async (_id: string) => {
    try {

        const authRes = await checkAuth();

        if (authRes.error) return { error: "Kérlek jelentkezz be." };

        const res = deleteSchema.safeParse(_id);
        if (res.error?.issues) {
            console.log(res.error.issues)
            return { failed: res.error.issues.map((item) => item.message) }
        }

        const serv = await Service.findByIdAndUpdate(_id,{
            visibility: true
        })

        updateTag('service-list');
        updateTag('main-page-services');
        updateTag('service-page-'+serv.heading.replaceAll(" ", "-"))
        updateTag('service-topbar')
        updateTag('service-footer')
        updateTag(`service-${serv.heading.replaceAll(" ", "-")}`)

        return { message: "Szolgáltatás törölve." }

    } catch (error) {
        const Error = await handleMongooseError(error);

        return { error: Error }
    }
}