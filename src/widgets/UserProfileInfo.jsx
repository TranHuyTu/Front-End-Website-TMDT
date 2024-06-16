import Spring from '@components/Spring';

const UserProfileInfo = ({profile}) => {
    return (
        <Spring className="card flex items-center">
            <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4">
                    <span className="icon-wrapper mt-1">
                        <i className="icon icon-envelope-solid"/>
                    </span>
                    {profile.usr_email}
                </div>
                <div className="flex items-start gap-4">
                    <span className="icon-wrapper mt-1.5">
                        <i className="icon icon-location-dot-solid"/>
                    </span>
                    <span className="max-w-[156px]">
                        {profile.usr_address} {profile.usr_state} {profile.usr_city} 
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="icon-wrapper mt-1">
                        <i className="icon icon-mobile-solid"/>
                    </span>
                    {profile.usr_phone}
                </div>
                <div className="flex items-center gap-4">
                    <span className="icon-wrapper mt-1">
                        <i className="icon icon-whatsapp"/>
                    </span>
                    {profile.usr_phone}
                </div>
                <button className="flex items-center gap-4 w-fit">
                        <span className="icon-wrapper mt-1">
                            <i className="icon icon-file-arrow-down-solid"/>
                        </span>
                    Profile Information file
                </button>
            </div>
        </Spring>
    )
}

export default UserProfileInfo