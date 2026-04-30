"use client"

const Element = (props: { name: string, category: string, price: number }) => {
    return (
        <li>
            <div>
                <div>{props.name}</div>
                <div>{props.category}</div>
                <div>{props.price}</div>
            </div>
            <form>
                <input type="text" name="name" id="name" />
                <input type="text" name="category" id="category" />
                <input type="number" name="price" id="price" />
            </form>
        </li>

    )
}

export default Element