"use client"


import FormElement from "./fomtElement"
import { Button } from "@/components/ui/button"
import Section from "./section"
import { v4 as uuid } from "uuid"


const MainElement = () => {
    const kell = [
        [
            { name: "Tsizatsági", category: "Festés", price: "1200", _id: "aioshnfueiafiaohnewu", categories: ["Festés", "Glett"] },
            { name: "Színes", category: "Festés", price: "1200", _id: "aioshnfueiafiaohnesefsefwu", categories: ["Festés", "Glett"] }
        ],
        [
            { name: "Q2", category: "Glett", price: "1330", _id: "aioshnfueiafiaohefesnewu", categories: ["Festés", "Glett"] },
            { name: "Q1", category: "Glett", price: "1300", _id: "aioshnfueiafiaohsaffeenewu", categories: ["Festés", "Glett"] }
        ]
    ]

    return (
        <>
            <FormElement />
            <form action="" className="mt-20">
                {kell.map((item) => <Section key={uuid()} arrOfEl={item} />)}
                <Button type="submit">
                    Mentés
                </Button>
            </form>
        </>
    )
}

export default MainElement