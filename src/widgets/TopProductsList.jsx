// styles
import 'swiper/css';

// components
import Spring from '@components/Spring';
import CategoryHeader from '@ui/CategoryHeader';
import {Swiper, SwiperSlide} from 'swiper/react';
import ProductGridItem from '@components/ProductGridItem';
import {Pagination} from 'swiper/modules';
import { useEffect, useState } from 'react';
import axiosClient from '@api/axiosClient';
import Loader from '@components/Loader';

// data placeholder

const TopSalesByCategories = ({category = 'All'}) => {
    const [products, setProducts] = useState([]);

    useEffect(() =>{
        fetchData();
    },[])

    const fetchData = async () => {
        const roleUser = await axiosClient
            .post(`/user/role`,{},
            {
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });
        if(roleUser.roleName !== 'shop'){
            if(category === 'All'){
                const productList = await axiosClient
                    .get(`/product?page=1`,
                    {
                        headers: { 'content-type': 'application/x-www-form-urlencoded' },
                    });
                setProducts(productList);
            }else{
                const productList = await axiosClient
                    .get(`/product/type?page=1&type=${encodeURIComponent(category)}`,
                    {
                        headers: { 'content-type': 'application/x-www-form-urlencoded' },
                    });
                setProducts(productList);
            }
        }else if(roleUser.roleName === 'shop'){
            if(category === 'All'){
                const productList = await axiosClient
                    .get(`/product/published/all?page=1`,
                    {
                        headers: { 
                            'content-type': 'application/x-www-form-urlencoded',
                            'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                            'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                        },
                    });
                    setProducts(productList);
            }else{
                const productList = await axiosClient
                    .get(`/product/published/all/type?page=1&type=${encodeURIComponent(category)}`,
                    {
                        headers: { 
                            'content-type': 'application/x-www-form-urlencoded',
                            'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                            'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                        },
                    });

                if(category === 'Suitcases & Trolley Bags'){
                    console.log(productList);
                }
                setProducts(productList);
            }
        }
    }

    if(products){
        return (
            <Spring className="flex flex-col gap-5">
                <CategoryHeader category={category} />
                <div className="w-full">
                    <Swiper className="!p-2 !-m-2"
                            modules={[Pagination]}
                            pagination={{clickable: true}}
                            slidesPerView={1}
                            spaceBetween={26}
                            breakpoints={{
                                640: {
                                    slidesPerView: 3,
                                }
                            }}
                            speed={1300}
                            rewind={false}
                            loop>
                        {
                            products.map(product => (
                                <SwiperSlide className="" key={product.id} >
                                    <ProductGridItem product={product} isSlide />
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                </div>
            </Spring>
        )
    }else{
        return (<Loader />)
    }
    
}

export default TopSalesByCategories