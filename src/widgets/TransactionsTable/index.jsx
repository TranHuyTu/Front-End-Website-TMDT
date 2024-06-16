// components
import Spring from '@components/Spring';
import StyledTable from './styles';
import CalendarSelector from '@components/CalendarSelector';
import Select from '@ui/Select';
import Pagination from '@ui/Pagination';
import TransactionCollapseItem from '@components/TransactionCollapseItem';
import Empty from '@components/Empty';

// hooks
import {useState, useEffect} from 'react';
import usePagination from '@hooks/usePagination';
import {useWindowSize} from 'react-use';

// constants
import {TRANSACTIONS_COLUMN_DEFS} from '@constants/columnDefs';
import {TRANSACTIONS_SORT_OPTIONS} from '@constants/options';

// data placeholder
import transactions from '@db/transactions';
import axiosClient from '@api/axiosClient';



const TransactionsTable = () => {
    const {width} = useWindowSize();
    const [activeCollapse, setActiveCollapse] = useState('');
    const [sort, setSort] = useState(TRANSACTIONS_SORT_OPTIONS[0]);
    const [transactions, setTransactions] = useState([]);

    const sortedData = transactions.sort((a, b) => {
        switch (sort.value) {
            default:
            case 'recent':
                return new Date(b.timestamp) - new Date(a.timestamp);
            case 'oldest':
                return new Date(a.timestamp) - new Date(b.timestamp);
            case 'amount-high-to-low':
                return b.fee.localeCompare(a.fee);
            case 'amount-low-to-high':
                return a.fee.localeCompare(b.fee);
        }
    });

    const pagination = usePagination(sortedData, 6);

    // go to first page when period or sort changes and reset active collapse
    useEffect(() => {
        pagination.goToPage(0);
        setActiveCollapse('');
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort]);

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
            const Order = await axiosClient
                .post(`/checkout/shop/123`, {},
                {
                    headers: { 
                        'content-type': 'application/x-www-form-urlencoded',
                        'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                        'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                    },
                });
            const transactionsData = Order.map(value=>{
                return {
                    sku: value.order_userId,
                    timestamp: value.modifiedOn,
                    method: 'VNPayment',
                    type: "VNPayment",
                    status: value.order_status,
                    country: 'USA',
                    currency: value.order_trackingNumber,
                    fee: value.order_payment.amount,
                    tax: value.order_payment.received,
                    seller: {
                        name: value.Users[0].usr_first_name+ ' '+ value.Users[0].usr_last_name ,
                        logo: value.Users[0].usr_avatar,
                    }
                }
            })

            setTransactions(transactionsData);
        }else{
            const Order = await axiosClient
                .post(`/checkout/shop/${JSON.parse(sessionStorage.getItem('x-client-id'))}`, {},
                {
                    headers: { 
                        'content-type': 'application/x-www-form-urlencoded',
                        'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                        'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                    },
                });
            const transactionsData = Order.map(value=>{
                return {
                    sku: value.order_userId,
                    timestamp: value.modifiedOn,
                    method: 'VNPayment',
                    type: "VNPayment",
                    status: value.order_status,
                    country: 'USA',
                    currency: value.order_trackingNumber,
                    fee: value.order_payment.amount,
                    tax: value.order_payment.received,
                    seller: {
                        name: value.Users[0].usr_first_name+ ' '+ value.Users[0].usr_last_name ,
                        logo: value.Users[0].usr_avatar,
                    }
                }
            })

            setTransactions(transactionsData);
        }
    }

    // reset active collapse when page or window width changes
    useEffect(() => {
        setActiveCollapse('');
    }, [pagination.currentPage, width]);

    const handleCollapse = (sku) => {
        if (activeCollapse === sku) {
            setActiveCollapse('');
        } else {
            setActiveCollapse(sku);
        }
    }

    return (
        <>
            <div className="flex flex-col gap-4 mb-5 md:flex-row justify-between">
                <CalendarSelector wrapperClass="md:max-w-[275px]"
                                  id="transactionsDate"
                                  label="Transaction date from"/>
                <div className="flex flex-col-reverse gap-2.5 md:flex-col md:min-w-[220px]">
                    <p className="md:text-right">
                        View transactions: {pagination.showingOf()}
                    </p>
                </div>
            </div>
            <Spring className="flex flex-col flex-1">
                {
                    width >= 768 ?
                        <StyledTable columns={TRANSACTIONS_COLUMN_DEFS}
                                     dataSource={pagination.currentItems()}
                                     rowKey={record => record.sku}
                                     locale={{
                                            emptyText: <Empty text="No transactions found"/>
                                     }}
                                     pagination={false}/>
                        :
                        <div className="flex flex-1 flex-col gap-5 mb-[26px]">
                            {
                                pagination.currentItems().map((item, index) => (
                                    <TransactionCollapseItem key={item.sku}
                                                             handleCollapse={handleCollapse}
                                                             activeCollapse={activeCollapse}
                                                             transaction={item}/>
                                ))
                            }
                        </div>
                }
                {
                    pagination.maxPage > 1 && <Pagination pagination={pagination}/>
                }
            </Spring>
        </>
    )
}

export default TransactionsTable