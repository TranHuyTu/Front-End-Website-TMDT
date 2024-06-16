// components
import Spring from '@components/Spring';
import {toast} from 'react-toastify';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

// utils
import { NavLink, useNavigate } from 'react-router-dom';
import axiosClient from '@api/axiosClient';
import { useEffect, useState } from 'react';
import Loader from '@components/Loader';
import { Avatar } from 'antd';
import Search from '@ui/Search';
import axios from 'axios';


const DiscountList = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [discount, setDiscount] = useState([]);
    const [search, setSearch] = useState();
   
    useEffect(()=>{
        if(!sessionStorage.getItem('x-client-id') && !sessionStorage.getItem('x-rtoken-id')) navigate('/login');
        if(search){
            console.log(search);
        }
        fetchData();
    }, [search])
    const fetchData = async () => {
        const shopList = await axiosClient
            .post(`/user/all/shop`,{},
            {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')), 
                },
            });

        const DiscountList = shopList.map(async(shop) =>{
            const discountList = await axiosClient
                .get(`/discount/byShop?shopId=${shop._id}`,
                {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                        'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')), 
                    },
                });
            const check = discount.filter(discount => discount.shopDetail._id === shop._id);
            if(check.length === 0){
                return {
                    shopDetail: shop,
                    discountShop: discountList
                };
            }
        })
        Promise.all(DiscountList).then((value) => {
            if(value.length !== 0){
                setDiscount(value);
            }
        })
        .catch((error) => {
            // Xử lý khi Promise được reject
            console.error(error);
        });
    }

    function convertDateFormat(dateString) {
        const parts = dateString.split('-');
        const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        return formattedDate;
    }

    function extractIdFromUrl(url) {
        const regex = /\/product-detail\/([a-zA-Z0-9]+)$/;
        const match = url.match(regex);

        return match ? match[1] : null;
    }

    const handleSearch = async() => {
        setDiscount([]);
        const shopList = await axiosClient
            .post(`/user/all/shop`,{},
            {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')), 
                },
            });

        shopList.map(async(shop) =>{
            const discountList = await axiosClient
                .get(`/discount/list_product?shopId=${shop._id}&productId=${extractIdFromUrl(search)}&userId=`,
                {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                        'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')), 
                    },
                });
            const check = discount.filter(discount => discount.shopDetail._id === shop._id);
            if(check.length === 0){
                console.log({
                    shopDetail: shop,
                    discountShop: discountList
                })
                setDiscount([...discount, {
                    shopDetail: shop,
                    discountShop: discountList
                }]);
            }
        });    
    }

    const handleSub = async (shop) =>{
        const follow = await axiosClient
            .post(`/follow/findFollow`,{
                userId: JSON.parse(sessionStorage.getItem('x-client-id')).replace(/"/g, ''),
                shopId: shop.shopDetail._id
            },
            {
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });
        if(follow){
            console.log(follow);
            await axios.post('http://localhost:9000/v1/api/unSub',{
                consumerTag: follow.tagId
            },{
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                },
            });
            const deleteFollow = await axiosClient.delete(`/follow`,{data :{
                userId: follow.userId,
                shopId: follow.shopId
                }
            },
            {
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });

            if(deleteFollow){
                toast.success('Unfollow shop successfully');
            }
        }else{
            const sub = await axios.post('http://localhost:9000/v1/api',{
                userId: JSON.parse(sessionStorage.getItem('x-client-id')).replace(/"/g, ''),
                shopId: shop.shopDetail._id
            },{
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                },
            });
            if(sub.data.metadata){
                const FollowNew = await axiosClient.post(`/follow`,sub.data.metadata,
                {
                    headers: { 
                        'content-type': 'application/x-www-form-urlencoded',
                        'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                        'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                    },
                });
                if(FollowNew){
                    toast.success('Follow shop successfully');
                }
            }
        }
    }

    if (discount.length === 0) return <Loader/>;
    return (
        <Spring className="card flex-1 xl:py-10">
            <Search wrapperClass="lg:w-[326px]" placeholder="Search Product" query={search} setQuery={setSearch} handleSearch={handleSearch}/>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-2 mt-8">
                {
                    discount.map(value => (
                        <div>
                            <div className='flex items-center pl-4 py-4 my-8 shadow-2xl'>
                                <Avatar className='border-2 border-amber-500' alt={value.shopDetail.usr_first_name + value.shopDetail.usr_last_name} src={value.shopDetail.usr_avatar} style={{width:'50px', height:'50px'}}/>
                                <div>
                                    <NavLink className={`ml-4 !leading-[1.4] block max-w-[180px] transition hover:text-accent font-bold` }>
                                        {value.shopDetail.usr_first_name} {value.shopDetail.usr_last_name}
                                    </NavLink>
                                    <p className='ml-4 text-yellow-700 mr-4'>{value.shopDetail.usr_email}</p>
                                </div>
                                <NavLink className="btn btn--outline blue !text-sm mt-4" onClick={()=>{
                                    handleSub(value);
                                }}>
                                    Follow Shop
                                </NavLink>
                            </div>
                            <div className='flex flex-nowrap overflow-auto' style={{height: '300px'}}>
                                <div className="grid grid-cols-2 gap-5 md:grid-cols-2 mt-8 w-full h-full">
                                    {
                                        value.discountShop.map((discount) => (
                                            <Card sx={{ maxHeight: 300 , minHeight: 180 }} style={{position:'relative'}} 
                                            onClick={async()=>{
                                                        const data = {
                                                                shopId: discount.discount_shopId,
                                                                codeId: discount.discount_code
                                                            }
                                                        const applyDiscount = await axiosClient
                                                        .post(`/discount/applyDiscount`,data,
                                                        {
                                                            headers: {
                                                                'content-type': 'application/x-www-form-urlencoded',
                                                                'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                                                                'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')), 
                                                            },
                                                        });
                                                        if(applyDiscount != null){
                                                            const element = document.getElementById(discount._id);
                                                            element.style.display = 'block';
                                                            toast.success('Apply discount successfully');
                                                        }else{
                                                            toast.error('You already have this discount or you have used it');
                                                        }
                                                    }}>
                                                <CardMedia
                                                    component="img"
                                                    alt={discount.discount_name}
                                                    image={discount.discount_image}
                                                    style={{height: '80px', objectFit: 'contain'}}
                                                />
                                                <CardContent>
                                                    <Typography className='line-clamp-2 font-bold' gutterBottom component="div" style={{fontSize: '12px'}}>
                                                    Name: {discount.discount_name}
                                                    </Typography>
                                                    <Typography className='line-clamp-2 font-bold' variant="body2" color="text.secondary" style={{fontSize: '12px'}}>
                                                    Description : {discount.discount_description}
                                                    </Typography>
                                                    <Typography className='line-clamp-2 font-bold' variant="body2" color="text.secondary" style={{fontSize: '12px'}}>
                                                    Value: {discount.discount_value}
                                                    </Typography>
                                                    <Typography className='line-clamp-2 font-bold' variant="body2" color="text.secondary" style={{fontSize: '12px'}}>
                                                    End date : {convertDateFormat(discount.discount_end_date.split('T')[0])}
                                                    </Typography>
                                                    <Typography className='line-clamp-2 font-bold' variant="body2" color="text.secondary" style={{fontSize: '12px'}}>
                                                    Discount count : {discount.discount_max_uses_per_user}
                                                    </Typography>
                                                    <Typography className='line-clamp-2 font-bold' variant="body2" color="text.secondary" style={{fontSize: '12px'}}>
                                                    Min price : {discount.discount_min_order_value}
                                                    </Typography>
                                                    <Typography className='line-clamp-2 font-bold' variant="body2" color="text.secondary" style={{fontSize: '12px'}}>
                                                    Max price : {discount.discount_max_value}
                                                    </Typography>
                                                    <Typography className='line-clamp-2 font-bold' variant="body2" color="text.secondary" style={{fontSize: '12px'}}>
                                                    Limit : {discount.discount_applies_to}
                                                    </Typography>
                                                </CardContent>
                                                <div id={discount._id} className={'bg-slate-400 w-full h-full top-0 left-0'} style={{position: 'absolute', opacity: '0.5', display: 'none'}}>
                                                    <div className=''>
                                                        <svg className="h-30 w-30 text-red-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  
                                                            <path d="M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-10 10A10 10 0 0 1 2 11V5a2 2 0 0 1 2-2z" />  
                                                            <polyline points="8 10 12 14 16 10" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    ))
                }
                
            </div>
            
        </Spring>
    )
}

export default DiscountList