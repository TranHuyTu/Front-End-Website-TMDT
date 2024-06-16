// components
import PageHeader from '@layout/PageHeader';
import Search from '@ui/Search';
import {CSVLink} from 'react-csv';
import ProductManagementTable from '@widgets/ProductManagementTable';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosClient from '@api/axiosClient';

const ProductsManagement = () => {
   const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [loadNextPage, setLoadNextPage] = useState(false);
    const [loadReturnPage, setLoadReturnPage] = useState(false);
    const [role, setRole] = useState();
    const [category, setCategory] = useState('All');
    const navagate = useNavigate();
    const [csvData, setCsvData] = useState([]);
    const [publish, setPublish] = useState(true);

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
        
        if(category === 'All'){
            if(publish){
                const productList = await axiosClient
                .get(`/product/published/all?page=${page}`,
                {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                        'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')), 
                    },
                });
                setProducts(productList);
                setCsvData(productList)
            }else{
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
                setCsvData(productList)
            }
            
        }else{
            if(publish){
                const productList = await axiosClient
                    .get(`/product/published/all/type?page=${page}&type=${encodeURIComponent(category)}`,
                    {
                        headers: {
                            'content-type': 'application/x-www-form-urlencoded',
                            'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                            'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')), 
                        },
                    });
                setProducts(productList);
                setCsvData(productList)
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
                setCsvData(productList)
            }
            
        }
    }; 
    const handlePublish = () => {
        if(publish){
            setPublish(false);
        }else{
            setPublish(true);
        }
    }
    return (
        <>
            <PageHeader title="Products Management" />
            <div className="flex flex-col-reverse gap-4 mb-5 md:flex-col lg:flex-row lg:justify-between">
                <div className="flex flex-col gap-4 md:flex-row md:gap-[14px]">
                    <button className="btn btn--primary" onClick={() => {
                        navagate('/product-editor');
                    }}>
                        Add new product <i className="icon-circle-plus-regular"/>
                    </button>
                    <CSVLink className="btn btn--outline blue !h-[44px]" data={csvData}>
                        Export CSV <i className="icon-file-export-solid"/>
                    </CSVLink>
                </div>
                <Search wrapperClass="lg:w-[326px]" placeholder="Search Product"/>
            </div>
            <ProductManagementTable products={products} role = {role} handleSetPublish={handlePublish} setCategoryNew = {handleCategoryNew} onRequestNextPage={handleRequestNextPage} onRequestReturnPage={handleRequestReturnPage} page={page}/>
        </>
    )
}

export default ProductsManagement