const ROUTES = [
    {
        name: 'Products',
        icon: 'boxes-stacked-regular',
        links: [
            {name: 'Top Products', path: '/top-products'},
            {name: 'Products Grid', path: '/products-grid'},
            {name: 'Discount', path: '/discount'},
        ]
    },
    {
        name: 'Orders',
        icon: 'cart-shopping-regular',
        path: '/orders'
    },
    {
        name: 'Card',
        icon: 'cart-shopping-regular',
        path: '/cart-order'
    },
    {
        name: 'Statistics',
        icon: 'chart-simple-regular',
        path: '/statistics'
    },
    {
        name: 'Settings',
        icon: 'gear-regular',
        links: [
            {name: 'General Settings', path: '/general-settings'},
        ]
    }
]

export default ROUTES