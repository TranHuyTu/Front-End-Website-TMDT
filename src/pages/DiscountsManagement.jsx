// components
import PageHeader from '@layout/PageHeader';
import Search from '@ui/Search';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosClient from '@api/axiosClient';
import StyledTable from '@widgets/SellersProfileTable/styles';
import Pagination from '@ui/Pagination';

import Empty from '@components/Empty';

import usePagination from '@hooks/usePagination';

import {DISCOUNTS_MANAGEMENT_COLUMN_DEFS} from '@constants/columnDefs';

const DiscountsManagement = () => {
    const [page, setPage] = useState(1);
    const [loadNextPage, setLoadNextPage] = useState(false);
    const [loadReturnPage, setLoadReturnPage] = useState(false);
    const [role, setRole] = useState();
    const [category, setCategory] = useState('All');
    const navagate = useNavigate();
    const [discounts, setDiscounts] = useState([])

    const pagination = usePagination(discounts, 25);
    console.log(pagination);

    useEffect(() =>{
        fetchData();
        if (loadNextPage) {
            fetchData();
            setLoadNextPage(false);
        }
    },[category, loadNextPage, loadReturnPage, page])

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
        const discounts = await axiosClient
            .get(`/discount?shopId=${JSON.parse(sessionStorage.getItem('x-client-id'))}&limit=50&page=${page}`,
            {
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });
        setDiscounts(discounts);
    }; 

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
    return (
        <>
            <PageHeader title="Discounts Management" />
            <div className="flex flex-col-reverse gap-4 mb-5 md:flex-col lg:flex-row lg:justify-between">
                <Search wrapperClass="lg:w-[326px]" placeholder="Search Product"/>
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:gap-[14px]">
                <StyledTable columns={DISCOUNTS_MANAGEMENT_COLUMN_DEFS}
                         dataSource={pagination.currentItems()}
                         rowKey={record => record.sku}
                         locale={{
                             emptyText: <Empty text="No products found"/>
                         }}
                         rowSelection={{
                             type: 'checkbox',
                         }}
                         pagination={false}/>
            {
                pagination.maxPage > 1 && <Pagination pagination={pagination} onRequestNextPage={handleRequestNextPage} onRequestReturnPage={handleRequestReturnPage} page={page}/>
            }
            </div>
        </>
    )
}

export default DiscountsManagement