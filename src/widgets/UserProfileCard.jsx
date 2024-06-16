// components
import Spring from '@components/Spring';

// utils
import dayjs from 'dayjs';

// assets

import { useNavigate } from 'react-router-dom';


const UserProfileCard = ({profile, role}) => {
    const navigate = useNavigate();

    const imgLink = "https://cdn.pixabay.com/photo/2014/04/02/17/07/user-307993_1280.png"  

    const handleLogout = () => {
        navigate('/login');
    };
    return (
        <Spring className="card flex flex-col items-center justify-center" id="userProfileCard">
            <div className="relative mb-3.5">
                <img className="relative rounded-full w-[110px] h-[110px]" src={profile.usr_avatar || imgLink} alt={profile.usr_id}/>
                <button className="absolute z-10 right-0 bottom-0 h-10 w-10 bg-green text-widget rounded-full border-[3px]
                        border-widget border-solid transition hover:bg-green-darker"
                        aria-label="Change profile picture">
                    <i className="inline-block icon-camera-solid mt-1"/>
                </button>
            </div>
            <h4>{profile.usr_first_name} {profile.usr_last_name}</h4>
            <span className="badge badge--square bg-red min-w-[96px] mt-2.5">{role}</span>
            <p className="subheading-2 mt-6 mb-[18px]">
                last visit {dayjs().format('DD/MM/YYYY')}
            </p>
            <button className="btn btn--secondary w-full md:max-w-[280px]" onClick={handleLogout}>Log Out</button>
        </Spring>
    )
}

export default UserProfileCard