

const Prices = (props: { name: string,  price: string, unitOfMea: string }) => {
  return (
    <li className="flex justify-between mb-4 border-b-2 pb-2 items-center">
        <div>{props.name}</div>
        <div className="flex gap-2">
            <div>{props.price}</div>
            <div>{props.unitOfMea}</div>
        </div>
        

    </li>
  )
}

export default Prices