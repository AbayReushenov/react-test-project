import { useState } from 'react'
import ButtonWithProps from './ButtonWithProps'

function SynchronizedСounters() {
    const [count, setCount] = useState(0)

    const handleClick = () => {
        setCount(count + 1)
    }

    return (
        <>
            <ButtonWithProps count={count} onClick={handleClick} />

            <ButtonWithProps count={count} onClick={handleClick} />
        </>
    )
}

export default SynchronizedСounters
