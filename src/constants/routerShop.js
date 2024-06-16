const ROUTES = [
    {
        name: 'Dashboard',
        icon: 'rectangle-history-circle-user-regular',
        links: [
            {name: 'Sales Analytics', path: '/'},
            {name: 'Seller Profile', path: '/seller-profile'},
            {name: 'Revenue by Period', path: '/revenue-by-period'},
        ]
    },
    {
        name: 'Products',
        icon: 'boxes-stacked-regular',
        links: [
            {name: 'Top Products', path: '/top-products'},
            {name: 'Products Grid', path: '/products-grid'},
            {name: 'Products Draft', path: '/products-draft'},
            {name: 'Products Management', path: '/products-management'},
            {name: 'Discount Management', path: '/discounts-management'},
            {name: 'Product Editor', path: '/product-editor'},
            {name: 'Discount Editor', path: '/discount-editor'},
        ]
    },
    {
        name: 'Orders',
        icon: 'cart-shopping-regular',
        path: '/orders'
    },
    {
        name: 'Reviews',
        icon: 'star-half-stroke-solid',
        path: '/reviews'
    },
    {
        name: 'Customers',
        icon: 'chart-user-regular',
        path: '/customers'
    },
    {
        name: 'Transactions',
        icon: 'money-check-dollar-pen-regular',
        path: '/transactions',
        qty: 279
    },
    {
        name: 'Statistics',
        icon: 'chart-simple-regular',
        path: '/statistics'
    },
    {
        name: 'Pages',
        icon: 'layer-group-regular',
        links: [
            {name: 'Login', path: '/login'},
            {name: 'General Settings', path: '/general-settings'},
            // {name: 'Page 404', path: '/404'},
        ]
    },
    // {
    //     name: 'Settings',
    //     icon: 'gear-regular',
    //     links: [
    //         {name: 'General Settings', path: '/general-settings'},
    //         // {name: 'Connected Apps', path: '/connected-apps'}
    //     ]
    // }
]

export default ROUTES