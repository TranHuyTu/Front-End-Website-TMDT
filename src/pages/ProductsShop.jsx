// components
import PageHeader from '@layout/PageHeader';
import ItemsGrid from '@widgets/ItemsGrid';
import axiosClient from '@api/axiosClient';
import { useEffect, useState } from 'react';
import Loader from '@components/Loader';
import { useParams } from 'react-router-dom';
import { Avatar } from 'antd';

const ProductsShop = () => {
    const {shopId} = useParams();
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [loadNextPage, setLoadNextPage] = useState(false);
    const [loadReturnPage, setLoadReturnPage] = useState(false);
    const [role, setRole] = useState();
    const [category, setCategory] = useState('All');
    const [shop, setShop] = useState([]);

    useEffect(() =>{
        fetchData();
        if (loadNextPage) {
            fetchData();
            setLoadNextPage(false);
        }
    },[category, loadNextPage, loadReturnPage, page])

    const handleRequestNextPage = () => {
        setPage((prevPage) => prevPage + 1);
        setLoadNextPage(true);
    };

    const handleRequestReturnPage = () => {
        if(page > 1){
            setPage((prevPage) => prevPage - 1);
            setLoadReturnPage(true);
        }  
    };

    const handleCategoryNew = (option) => {
        setCategory(option);
    }

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
        setRole(roleUser.roleName);

        const shopDetail = await axiosClient
            .post(`/user/shop?userId=${shopId}`,{},
            {
                headers: { 
                        'content-type': 'application/x-www-form-urlencoded',
                        'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                        'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                    },
            });
        setShop(shopDetail);

        if(category === 'All'){
            const productList = await axiosClient
            .get(`/product//published/user/all?page=${page}&shopId=${shopId}`,
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
                .get(`/product//published/user/all/type?page=${page}&shopId=${shopId}&type=${encodeURIComponent(category)}`,
                {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                        'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')), 
                    },
                });
            setProducts(productList);
        }
    };
    if(products && role && shop){
        return (
            <>
                <PageHeader title={"Products of "+shop.first_name +" " + shop.last_name} />

                <div className='flex items-center my-4 shadow-2xl'>
                        <Avatar className='border-2 border-amber-500' alt={shop.first_name + shop.last_name} src={shop.avatar} style={{width:'50px', height:'50px'}}/>
                        <div>
                            <p className='ml-4 font-bold text-red-500 text-yellow-700 mr-4'>{shop.first_name} {shop.last_name}</p>
                            <p className='ml-4 text-yellow-700 mr-4'>{shop.email}</p>
                        </div>
                        
                    </div>

                <ItemsGrid products={products} role = {role} setCategoryNew = {handleCategoryNew} onRequestNextPage={handleRequestNextPage} onRequestReturnPage={handleRequestReturnPage} page={page}/>
            </>
        )
    }else{
        return (<Loader />)
    }
}

export default ProductsShop