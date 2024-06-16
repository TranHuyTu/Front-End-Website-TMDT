// components
import PageHeader from '@layout/PageHeader';
import UserProfileCard from '@widgets/UserProfileCard';
import UserProfileDetails from '@widgets/UserProfileDetails';
import UserProfilePanel from '@widgets/UserProfilePanel';
import UserProfileInfo from '@widgets/UserProfileInfo';
import { useEffect, useState } from 'react';
import axiosClient from '@api/axiosClient';
import Loader from '@components/Loader';
import { useNavigate } from 'react-router-dom';

const GeneralSettings = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState();
    const [role, setRole] = useState();
    useEffect(()=>{
        if(!sessionStorage.getItem('x-client-id') && !sessionStorage.getItem('x-rtoken-id')) navigate('/login');
        fetchData();
    }, [])
    const fetchData = async () => {
        const result = await axiosClient
            .post(`/user/profile`,{},
            {
                headers: { 
                        'content-type': 'application/x-www-form-urlencoded',
                        'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                        'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                    },
            });
        if(!result.user){
            navigate('/login');
        }
        setProfile(result.user);
        const roleUser = await axiosClient
            .post(`/user/role`,{},
            {
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });
        if(!roleUser.roleName){
            navigate('/login');
        }
        setRole(roleUser.roleName);
    }
    if(!profile || !role){
        return (<Loader />)
    }
    else{
        return (
        <>
            <PageHeader title="Settings"/>
            <div className="widgets-grid md:!grid-cols-2 xl:!grid-cols-[340px,_minmax(0,1fr)]">
                <div className="widgets-grid md:!grid-cols-2 md:col-span-2 xl:!grid-cols-1 xl:col-span-1">
                    <UserProfileCard profile={profile} role = {role}/>
                    <div className="widgets-grid">
                        <UserProfilePanel/>
                        <UserProfileInfo profile={profile}/>
                    </div>
                </div>
                <UserProfileDetails profile={profile} role = {role}/>
            </div>
        </>
    )
    }
    
}

export default GeneralSettings