// components
import RatingStars from '@ui/RatingStars';
import SubmenuTrigger from '@ui/SubmenuTrigger';
import Timestamp from '@ui/Timestamp';
import {NavLink} from 'react-router-dom';
import Trend from '@ui/Trend';
import Counter from '@components/Counter';

// utils
import {getCategory, getStatusColor, numFormatter} from '@utils/helpers';
import dayjs from 'dayjs';

export const ORDERS_COLUMN_DEFS = [
    {
        title: '# order',
        dataIndex: 'orderNumber',
        width: '100px',
        render: text => <span className="subheading-2">#{text}</span>
    },
    {
        title: 'Product',
        dataIndex: 'product',
        className: 'product-cell',
        render: product =>
            <div className="flex gap-6">
                <div className="img-wrapper w-[70px] h-[64px] flex items-center justify-center shrink-0">
                    <img src={product.image} alt={product.name}/>
                </div>
                <div className="flex-col hidden 2xl:flex">
                    <h5 className="text-sm max-w-[195px] mb-1.5">{product.name}</h5>
                    <div className="flex flex-col gap-1 text-sm">
                        <p>Regular price: ${product.regular_price}</p>
                        {product.sale_price && <p>Sale price: ${product.sale_price}</p>}
                    </div>
                </div>
            </div>,
        responsive: ['lg'],
    },
    {
        title: 'SKU',
        dataIndex: 'sku',
    },
    {
        title: 'Category',
        dataIndex: 'category',
        render: category =>
            <div className="flex items-center gap-4">
                <div className={`badge-icon badge-icon--sm bg-${getCategory(category).color}`}>
                    <i className={`${getCategory(category).icon} text-base`}/>
                </div>
                <span className="label-text">{getCategory(category).label}</span>
            </div>,
        responsive: ['lg'],
    },
    {
        title: 'Payment',
        dataIndex: 'payment',
        render: payment => {
            const status = payment.amount === payment.received ?
                'Fully paid'
                :
                (payment.amount > payment.received && payment.received !== 0) ? 'Partially paid' : 'Unpaid';

            return (
                <div className="flex flex-col">
                    <span className="font-heading font-bold text-header">
                        {status !== 'Fully paid' && `$${payment.received} / from `}
                        ${payment.amount}
                    </span>
                    <span>{status}</span>
                </div>
            )
        }
    },
    {
        title: 'Order Status',
        dataIndex: 'status',
        render: status =>
            <span className="badge-status badge-status--lg"
                  style={{backgroundColor: `var(--${getStatusColor(status)})`}}>
                {status}
            </span>
    },
    {
        title: 'Rate',
        dataIndex: 'rating',
        render: rating => <RatingStars rating={rating}/>,
        responsive: ['xl'],
    },
    {
        title: 'Actions',
        dataIndex: 'actions',
        width: '70px',
        render: () =>
            <div className="flex items-center justify-end gap-11">
                <NavLink to="/product-editor" aria-label="Edit">
                    <i className="icon icon-pen-to-square-regular text-lg leading-none"/>
                </NavLink>
                <SubmenuTrigger/>
            </div>
    }
];

export const TRANSACTIONS_COLUMN_DEFS = [
    {
        title: 'Date & Time',
        dataIndex: 'timestamp',
        render: timestamp => <Timestamp date={timestamp}/>,
    },
    {
        title: 'Seller',
        dataIndex: 'seller',
        render: (text, record) => {
            return (
                <>
                    {
                        record.seller ?
                            <div className="flex items-center gap-[18px]">
                                <div
                                    className="img-wrapper w-[60px] h-[60px] flex items-center justify-center shrink-0">
                                    <img className="max-w-[50px]" src={record.seller.logo} alt={record.seller.name}/>
                                </div>
                                <span className="hidden truncate lg:inline">{record.seller.name}</span>
                            </div>
                            :
                            'N/A'
                    }
                </>
            )
        }

    },
    {
        title: 'SKU',
        dataIndex: 'sku',
        responsive: ['lg'],
    },
    {
        title: 'Method',
        dataIndex: 'method',
        responsive: ['xxl'],
    },
    {
        title: 'Type',
        dataIndex: 'type',
        render: type => <span className="capitalize">{type}</span>
    },
    {
        title: 'Status',
        dataIndex: 'status',
        render: status =>
            <span className="badge-status" style={{backgroundColor: `var(--${getStatusColor(status)})`}}>
                {status}
            </span>
    },
    {
        title: 'Country',
        dataIndex: 'country',
        responsive: ['xxl'],
    },
    {
        title: 'Curr',
        dataIndex: 'currency',
        responsive: ['xl'],
    },
    {
        title: 'Fee',
        dataIndex: 'fee',
        responsive: ['xl'],
    },
    {
        title: 'Tax',
        dataIndex: 'tax',
        responsive: ['xl'],
    },
    {
        title: 'Total',
        dataIndex: 'total',
        render: (text, record) => {
            const total = record.fee - (record.fee / 100 * record.tax);

            return <span className="font-heading font-semibold text-header">${total.toFixed(2)}</span>
        }
    }
];

export const SELLERS_COLUMN_DEFS = [
    {
        title: 'Seller',
        dataIndex: 'seller',
        render: (text, record) =>
            <div className="flex gap-[26px]">
                <div className="img-wrapper flex items-center justify-center w-[63px] h-[63px] shrink-0">
                    <img className="max-w-[50px]" src={record.logo} alt={record.name}/>
                </div>
                <div className="flex flex-col items-start">
                    <a className="subheading-2" href={record.website} target="_blank" rel="noreferrer">
                        www.website.com
                    </a>
                    <a className="mt-3 mb-2.5" href={`tel:${record.phone}`}>{record.phone}</a>
                    <a href={`mailto:${record.email}`}>{record.email}</a>
                </div>
            </div>
    },
    {
        title: 'Orders value',
        dataIndex: 'ordersValue',
        render: () =>
            <div className="flex flex-col">
                <Counter className="h3" num={65874}/>
                <span className="label-text mt-0.5 mb-2.5">New orders</span>
                <Trend value={55.96}/>
            </div>,
        responsive: ['lg'],
    },
    {
        title: 'Income value',
        dataIndex: 'incomeValue',
        render: () =>
            <div className="flex flex-col">
                <Counter className="h3" num={23000} prefix="$" isFormatted/>
                <span className="label-text mt-0.5 mb-2.5">Income</span>
                <Trend value={14.56}/>
            </div>,
        responsive: ['lg'],
    },
    {
        title: 'Review rate',
        dataIndex: 'rating',
        render: rating => <RatingStars rating={rating}/>
    },
    {
        title: 'Sales categories value',
        dataIndex: 'salesCategoriesValue',
        render: (text, record) =>
            <div className="flex flex-col gap-2.5 max-w-[220px]">
                <div className="flex justify-between font-heading font-bold text-sm">
                    <span>Electronics</span>
                    <span className="text-header text-right">
                        {numFormatter(record.profit.electronics, 2, '$')}
                    </span>
                </div>
                <div className="flex justify-between font-heading font-bold text-sm">
                    <span>Fashion</span>
                    <span className="text-header text-right">
                        {numFormatter(record.profit.fashion, 2, '$')}
                    </span>
                </div>
                <div className="flex justify-between font-heading font-bold text-sm">
                    <span>Food & Drinks</span>
                    <span className="text-header text-right">
                        {numFormatter(record.profit.food, 2, '$')}
                    </span>
                </div>
                <div className="flex justify-between font-heading font-bold text-sm">
                    <span>Services</span>
                    <span className="text-header text-right">
                        {numFormatter(record.profit.services, 2, '$')}
                    </span>
                </div>
            </div>,
        responsive: ['xl'],
    },
    {
        title: 'Other',
        dataIndex: 'other',
        render: () =>
            <div className="flex items-center justify-end gap-5">
                <button aria-label="Edit">
                    <i className="icon icon-pen-to-square-regular text-lg leading-none"/>
                </button>
                <SubmenuTrigger/>
            </div>
    }
]

export const PRODUCTS_MANAGEMENT_COLUMN_DEFS = [
    {
        title: <div className="flex items-center justify-center">
            <i className="icon-image-regular text-[26px]"/>
        </div>,
        dataIndex: 'img_link',
        width: 45,
        render: img_link =>
            <div className="img-wrapper w-[45px] h-[45px] flex items-center justify-center">
                {img_link && img_link.length > 0 ? (
                    <img src={img_link[0]} alt="product" />
                ) : (
                    <span>No Image</span>
                )}
            </div>
    },
    {
        title: 'Product name',
        dataIndex: 'product_name',
        render: text => <span className="inline-block h6 !text-sm max-w-[155px]" 
        style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                WebkitLineClamp: 4,
                lineHeight: '1.5em', 
                maxHeight: 'calc(1.5em * 4)', 
                color: 'inherit', 
                textDecoration: 'none'
            }}>{text}</span>
    },
    {title: 'SKU', dataIndex: 'product_id'},
    {
        title: 'Price',
        dataIndex: 'product_price',
        render: price => <span>${price ? price.toFixed(2) : '0.00'}</span>
    },
    {
        title: 'Price discount',
        dataIndex: 'product_discounted_price',
        render: price => <span>${price ? price.toFixed(2) : '0.00'}</span>
    },
    {
        title: 'Category',
        dataIndex: 'product_category',
        render: category => <button className="text-accent capitalize">{category}</button>,
        responsive: ['xxl'],
    },
    {
        title: 'Type',
        dataIndex: 'product_type',
        render: type => <span className="capitalize">{type}</span>,
        responsive: ['lg'],
    },
    {
        title: 'Category',
        dataIndex: 'product_category',
        render: product_category => <span className="capitalize">{product_category || '-'}</span>,
        responsive: ['xl'],
    },
    {
        title: 'Rate',
        dataIndex: 'product_ratingAverage',
        render: rateCount =>
            <div className="flex items-center gap-2">
                <i className={`icon icon-star-${rateCount !== 0 ? 'solid' : 'regular'} text-lg leading-none`}/>
                {rateCount !== 0 && <span className="mt-1">({rateCount})</span>}
            </div>,
        responsive: ['xl'],
    },
    {
        title: 'Actions',
        dataIndex: '_id',
        render: (product_id) =>
            <div className="flex items-center justify-end gap-11">
                <NavLink to={'/product-editor/'+product_id} aria-label="Edit">
                    <svg class="h-8 w-8 text-red-500"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                </NavLink>
                <NavLink to={'/product-detail/'+product_id} aria-label="Edit">
                    <svg class="h-8 w-8 text-red-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  
                    <path stroke="none" d="M0 0h24v24H0z"/>  
                    <line x1="15" y1="8" x2="15.01" y2="8" />  
                    <rect x="4" y="4" width="16" height="16" rx="3" />  
                    <path d="M4 15l4 -4a3 5 0 0 1 3 0l 5 5" />  
                    <path d="M14 14l1 -1a3 5 0 0 1 3 0l 2 2" />
                    </svg>
                </NavLink>
            </div>
    }
]


function convertISOToDateTime(isoDate) {
    const date = new Date(isoDate);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; 
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();

    const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    return `${formattedTime} ${formattedDate}`;
}


export const DISCOUNTS_MANAGEMENT_COLUMN_DEFS = [
    {
        title: <div className="flex items-center justify-center">
                    <i className="icon-image-regular text-[26px]"/>
                </div>,
        dataIndex: 'discount_image',
        width: 45,
        render: discount_image =>
            <div className="img-wrapper w-[45px] h-[45px] flex items-center justify-center">
                {discount_image ? (
                    <img src={discount_image} alt="product" />
                ) : (
                    <span>No Image</span>
                )}
            </div>
    },
    {
        title: 'Discount name',
        dataIndex: 'discount_name',
        render: text => <span className="inline-block h6 !text-sm max-w-[155px]" 
        style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                WebkitLineClamp: 4,
                lineHeight: '1.5em', 
                maxHeight: 'calc(1.5em * 4)', 
                color: 'inherit', 
                textDecoration: 'none'
            }}>{text}</span>
    },
    {
        title: 'Discount Min Order Value',
        dataIndex: 'discount_min_order_value',
        render: discount_min_order_value => <span>${discount_min_order_value ? discount_min_order_value.toFixed(2) : '0.00'}</span>
    },
    {
        title: 'Discount Max Order Value',
        dataIndex: 'discount_max_value',
        render: discount_max_value => <span>${discount_max_value ? discount_max_value.toFixed(2) : '0.00'}</span>
    },
    {
        title: 'Discount Value',
        dataIndex: 'discount_value',
        render: discount_value => <span>{discount_value ? discount_value : '0.00'}</span>
    },
    {
        title: 'Discount type',
        dataIndex: 'discount_type',
        render: discount_type => <span className="capitalize">{discount_type}</span>,
        responsive: ['lg'],
    },
    {
        title: 'Discount Applies To',
        dataIndex: 'discount_applies_to',
        render: discount_applies_to => <span className="capitalize">{discount_applies_to || '-'}</span>,
        responsive: ['xl'],
    },
    {
        title: 'Discount Start Date',
        dataIndex: 'discount_start_date',
        render: discount_start_date => <span className="capitalize">{convertISOToDateTime(discount_start_date) || '-'}</span>,
        responsive: ['xl'],
    },
    {
        title: 'Discount End Date',
        dataIndex: 'discount_end_date',
        render: discount_end_date => <span className="capitalize">{convertISOToDateTime(discount_end_date) || '-'}</span>,
        responsive: ['xl'],
    },
    {
        title: 'Actions',
        dataIndex: 'discount_code',
        render: (discount_code) =>
            <div className="flex items-center justify-end gap-11">
                <NavLink to={'/discount-editor/'+discount_code} aria-label="Edit">
                    <svg class="h-8 w-8 text-red-500"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                </NavLink>
                <NavLink to={'/discount-editor/'+discount_code} aria-label="Edit">
                    <svg class="h-8 w-8 text-red-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  
                    <path stroke="none" d="M0 0h24v24H0z"/>  
                    <line x1="15" y1="8" x2="15.01" y2="8" />  
                    <rect x="4" y="4" width="16" height="16" rx="3" />  
                    <path d="M4 15l4 -4a3 5 0 0 1 3 0l 5 5" />  
                    <path d="M14 14l1 -1a3 5 0 0 1 3 0l 2 2" />
                    </svg>
                </NavLink>
            </div>
    }
]

export const PRODUCTS_MANAGEMENT_COLUMN = [
    {
        title: <div className="flex items-center justify-center">
            <i className="icon-image-regular text-[26px]"/>
        </div>,
        dataIndex: 'img_link',
        width: 45,
        render: img_link =>
            <div className="img-wrapper w-[45px] h-[45px] flex items-center justify-center">
                {img_link && img_link.length > 0 ? (
                    <img src={img_link[0]} alt="product" />
                ) : (
                    <span>No Image</span>
                )}
            </div>
    },
    {
        title: 'Product name',
        dataIndex: 'product_name',
        render: text => <span className="inline-block h6 !text-sm max-w-[155px]" 
        style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                WebkitLineClamp: 4,
                lineHeight: '1.5em', 
                maxHeight: 'calc(1.5em * 4)', 
                color: 'inherit', 
                textDecoration: 'none'
            }}>{text}</span>
    },
    {title: 'SKU', dataIndex: 'product_id'},
    {
        title: 'Price',
        dataIndex: 'product_price',
        render: price => <span>${price ? price.toFixed(2) : '0.00'}</span>
    },
    {
        title: 'Price discount',
        dataIndex: 'product_discounted_price',
        render: price => <span>${price ? price.toFixed(2) : '0.00'}</span>
    },
    {
        title: 'Category',
        dataIndex: 'product_category',
        render: category => <button className="text-accent capitalize">{category}</button>,
        responsive: ['xxl'],
    },
    {
        title: 'Type',
        dataIndex: 'product_type',
        render: type => <span className="capitalize">{type}</span>,
        responsive: ['lg'],
    },
    {
        title: 'Type',
        dataIndex: 'Type',
        render: statistics => <span className="capitalize">{statistics || '-'}</span>,
        responsive: ['xl'],
    },
    {title: 'Quantity', dataIndex: 'Quantity', },
    {
        title: 'Rate',
        dataIndex: 'product_ratingAverage',
        render: rateCount =>
            <div className="flex items-center gap-2">
                <i className={`icon icon-star-${rateCount !== 0 ? 'solid' : 'regular'} text-lg leading-none`}/>
                {rateCount !== 0 && <span className="mt-1">({rateCount})</span>}
            </div>,
        responsive: ['xl'],
    },
    {
        title: 'Actions',
        dataIndex: '_id',
        render: (product_id) =>
            <div className="flex items-center justify-end gap-11">
                <NavLink to={'/product-detail/'+product_id} aria-label="Edit">
                    <i className="icon icon-pen-to-square-regular text-lg leading-none"/>
                </NavLink>
                <NavLink to={'/product-detail/'+product_id} aria-label="Edit">
                    <i className="icon icon-pen-to-square-regular text-lg leading-none"/>
                </NavLink>
            </div>
    }
]