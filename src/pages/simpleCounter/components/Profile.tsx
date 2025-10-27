import { user } from '../data/user'

import "./Profile.css"

export default function Profile() {
    return (
        <div className='profile-container'>
            <h1>{user.name}</h1>
            <img
                className='avatar_image'
                src={user.imageUrl}
                alt={'Photo of ' + user.name}
                style={{
                    width: user.imageSize,
                    height: user.imageSize,
                }}
            />
        </div>
    )
}
