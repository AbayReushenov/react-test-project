import Button from './components/Button'
import MyTestButton from './components/MyTestButton'
import Profile from './components/Profile'

import './SimpleCounter.css'
import SynchronizedСounters from './components/SynchronizedСounters';

function SimpleCounter() {
    return (
        <>
            <div className='card'>
                <h4>Просто кнопка</h4>
                <MyTestButton />
            </div>

            <div className='card'>
                <h4>Счетчик №1</h4>
                <Button />
            </div>

            <div className='card'>
                <h4>Счетчик №2</h4>
                <Button />
            </div>

            <div className='card'>
                <h4>Счетчик №3 и Счетчик №4</h4>
                <SynchronizedСounters />
            </div>

            <div className='card'>
                <Profile />
            </div>
        </>
    )
}

export default SimpleCounter
