// components
import PageHeader from '@layout/PageHeader';
import MainProfileInfo from '@widgets/MainProfileInfo';
import SalesStats from '@widgets/SalesStats';
import TotalReport from '@widgets/TotalReport';
import TotalBalance from '@components/Banners/TotalBalance';

// hooks
import {useWindowSize} from 'react-use';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosClient from '@api/axiosClient';
import Loader from '@components/Loader';

const SalesAnalytics = () => {
    const [role, setRole] = useState('');
    const {width} = useWindowSize();
    const [profile, setProfile] = useState();
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() =>{
        fetchData();
    },[])

    const fetchData = async () => {
        if(!sessionStorage.getItem('x-client-id') && !sessionStorage.getItem('x-rtoken-id')) navigate('/login');
        if(sessionStorage.getItem('x-client-id') && sessionStorage.getItem('x-rtoken-id')){
            const roleUser = await axiosClient
            .post(`/user/role`,{},
            {
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });
            await setRole(roleUser.roleName);
            const Order = await axiosClient
            .post(`/checkout/shop/${JSON.parse(sessionStorage.getItem('x-client-id'))}`, {},
            {
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });

            setOrders(Order);

            const result = await axiosClient
            .post(`/user/profile`,{},
            {
                headers: { 
                        'content-type': 'application/x-www-form-urlencoded',
                        'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                        'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                    },
            });
            setProfile(result.user);
        }
    }
    if(!profile || !role || !orders){
        return (<Loader />)
    }else{
        return (
            <>
                <PageHeader title="Sales Analytics"/>
                <div className="widgets-grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-[minmax(0,_951px)_minmax(0,_1fr)]">
                    <MainProfileInfo profile={profile}/>
                    {width >= 1536 && <TotalBalance />}
                    <SalesStats/>
                    <TotalReport/>
                </div>
            </>
        )
    }
    
}

export default SalesAnalytics