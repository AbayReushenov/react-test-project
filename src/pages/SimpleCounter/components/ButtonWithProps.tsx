interface Props {
    count: number
    onClick: () => void
}

function ButtonWithProps({ count, onClick }: Props) {
    return <button onClick={onClick}>count is {count}</button>
}

export default ButtonWithProps
