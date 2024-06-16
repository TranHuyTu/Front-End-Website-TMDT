// components
import PageHeader from '@layout/PageHeader';
import ItemsGrid from '@widgets/ItemsGrid';
import axiosClient from '@api/axiosClient';
import { useEffect, useState } from 'react';
import Loader from '@components/Loader';

const ProductsDraft = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [loadNextPage, setLoadNextPage] = useState(false);
    const [loadReturnPage, setLoadReturnPage] = useState(false);
    const [role, setRole] = useState();
    const [category, setCategory] = useState('All');

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
        if(roleUser.roleName !== 'shop'){
            if(category === 'All'){
                const productList = await axiosClient
                    .get(`/product?page=${page}`,
                    {
                        headers: { 'content-type': 'application/x-www-form-urlencoded' },
                    });
                    setProducts(productList);
            }else{
                const productList = await axiosClient
                    .get(`/product/type?page=${page}&type=${encodeURIComponent(category)}`,
                    {
                        headers: { 'content-type': 'application/x-www-form-urlencoded' },
                    });
                setProducts(productList);
            }
            
            // setProducts(productList);
        }else{
            if(category === 'All'){
                const productList = await axiosClient
                .get(`/product/draft/all?page=${page}`,
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
                    .get(`/product/draft/all/type?page=${page}&type=${encodeURIComponent(category)}`,
                    {
                        headers: {
                            'content-type': 'application/x-www-form-urlencoded',
                            'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                            'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')), 
                        },
                    });
                setProducts(productList);
            }
        }  
    };
    if(products && role){
        return (
            <>
                <PageHeader title="Products Grid" />
                <ItemsGrid products={products} isDraft={true} role = {role} setCategoryNew = {handleCategoryNew} onRequestNextPage={handleRequestNextPage} onRequestReturnPage={handleRequestReturnPage} page={page}/>
            </>
        )
    }else{
        return (<Loader />)
    }
}

export default ProductsDraft