// components
import Search from '@ui/Search';
import Headroom from 'react-headroom';
import CustomTooltip from '@ui/CustomTooltip';
import NotificationsPanel from '@components/NotificationsPanel';
import MessagesPanel from '@components/MessagesPanel';
import ModalBase from '@ui/ModalBase';
import socketIO from 'socket.io-client';

// hooks
import {useTheme} from '@contexts/themeContext';
import {useSidebar} from '@contexts/sidebarContext';
import {useWindowSize} from 'react-use';
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

// constants
import {LOCALES} from '@constants/options';
import axiosClient from '@api/axiosClient';

const LocaleMenu = ({active, setActive}) => {
    return (
        <div className="flex flex-col gap-4 p-4">
            {
                LOCALES.map(locale => (
                    <button key={locale.value}
                            className="group flex items-center gap-2.5 w-fit"
                            onClick={() => setActive(locale.value)}>
                        <img className="rounded-full w-5" src={locale.icon} alt={locale.label}/>
                        <span
                            className={`text-sm font-medium transition group-hover:text-accent ${active === locale.value ? 'text-accent' : 'text-header'}`}>
                            {locale.label}
                        </span>
                    </button>
                ))
            }
        </div>
    )
}

const AppBar = () => {
    const navigate = useNavigate();
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false);
    const [messagesPanelOpen, setMessagesPanelOpen] = useState(false);
    const [locale, setLocale] = useState('en-EN');
    const {width} = useWindowSize();
    const {theme, toggleTheme} = useTheme();
    const {setOpen} = useSidebar();
    const [notifications, setNotifications] = useState([]);

    const activeLocale = LOCALES.find(l => l.value === locale);

    const socket = socketIO.connect('http://localhost:9000');
    const [Notification, setNotification] = useState([]);

    // const handleSendMessage = (e) => {
    //     e.preventDefault();
    //     socket.emit('message', {
    //             text: "Hellooo",
    //             id: `${socket.id}${Math.random()}`,
    //             socketID: socket.id,
    //         }); 
    // };
    
     useEffect(() => {
        if(!sessionStorage.getItem('x-client-id') && !sessionStorage.getItem('x-rtoken-id')) navigate('/login');
        else{
            fetchData();
            socket.on(sessionStorage.getItem('x-client-id').replace(/"/g, ''), async (data) => {
                let user_id = sessionStorage.getItem('x-client-id').replace(/"/g, '')
                if(data.notification.user_Id){
                    user_id = data.notification.user_Id;
                    
                }
                
                const pushNoti = await axiosClient
                    .post(`/follow/addNoti`, {
                        userId: user_id,
                        shopId: data.shopId,
                        noti: {
                            data: data.notification,
                            isNew: true
                        }
                    },{
                        headers: { 
                                'content-type': 'application/x-www-form-urlencoded',
                                'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                                'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                            },
                    });
                if(pushNoti.modifiedCount !== 0){
                    if(sessionStorage.getItem('x-client-id').replace(/"/g, '') !== data.shopId){
                        const noti = await axiosClient
                        .post(`/follow/byUser`, {
                            userId: sessionStorage.getItem('x-client-id').replace(/"/g, ''),
                        },{
                            headers: { 
                                    'content-type': 'application/x-www-form-urlencoded',
                                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                                },
                        });
                        const notiNewArray = noti.map(doc => doc.notiArray).flat();
                        const notiNewArrayShop = noti.map(doc => doc.notiArrayUserFromShop).flat();
                        setNotification([...notiNewArray, ...notiNewArrayShop]);
                    }else{
                        const noti = await axiosClient
                        .post(`/follow/byShop`, {
                            userId: sessionStorage.getItem('x-client-id').replace(/"/g, ''),
                        },{
                            headers: { 
                                    'content-type': 'application/x-www-form-urlencoded',
                                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                                },
                        });
                        const notiNewArray = noti.map(doc => doc.notiArrayUserFromShop).flat();
                        setNotification(notiNewArray);
                    }
                    
                }
            });
        }
        
    }, []);

    const fetchData = async ()=>{
        if(sessionStorage.getItem('x-client-id') && sessionStorage.getItem('x-rtoken-id')){
            const roleUser = await axiosClient
                .post(`/user/role`,{},
                {
                    headers: { 
                        'content-type': 'application/x-www-form-urlencoded',
                        'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                        'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                    },
                });
            if(roleUser.roleName === 'user'){
                const noti = await axiosClient
                    .post(`/follow/byUser`, {
                        userId: sessionStorage.getItem('x-client-id').replace(/"/g, ''),
                    },{
                        headers: { 
                                'content-type': 'application/x-www-form-urlencoded',
                                'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                                'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                            },
                    });

                const notiNewArray = noti.map(doc => doc.notiArray).flat();
                const notiNewArrayShop = noti.map(doc => doc.notiArrayUserFromShop).flat();
                const notiArrayTatol = [...notiNewArray, ...notiNewArrayShop];
                setNotification(notiArrayTatol);

                await axiosClient
                    .post(`/follow/NotiFalse`, {
                        userId: sessionStorage.getItem('x-client-id').replace(/"/g, ''),
                    },{
                        headers: { 
                                'content-type': 'application/x-www-form-urlencoded',
                                'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                                'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                            },
                    });

                const notiArr = notiArrayTatol.map(async(noti)=> {
                    const notification = {};
                    notification.id = noti.data.noti_Id;
                    if(noti.data.user_Id){
                        notification.category = 'order';
                    }else{
                        notification.category = 'follow';
                    }
                    
                    const notiDetail = await axiosClient
                        .post(`/notification/byId`, {
                            notiId: noti.data.noti_Id,
                        },{
                            headers: { 
                                    'content-type': 'application/x-www-form-urlencoded',
                                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                                },
                    });
                    notification.subcategory = 'Subscriptions';
                    notification.text = notiDetail.noti_content;
                    let urlUser = "";
                    if(noti.data.user_Id){
                        urlUser = `/user/shop?userId=${noti.data.user_Id}`;
                    }else{
                        urlUser = `/user/shop?userId=${noti.data.noti_senderId}`
                    }
                    const shopDetail = await axiosClient
                        .post(urlUser,{},
                        {
                            headers: { 
                                    'content-type': 'application/x-www-form-urlencoded',
                                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                                },
                        });
                    notification.user = {
                        firstName: shopDetail.first_name,
                        lastName: shopDetail.last_name,
                        avatar: shopDetail.avatar
                    }
                    return await notification
                });
                const notiArray = await Promise.all(notiArr);
                setNotifications(notiArray);
            }else if(roleUser.roleName === 'shop'){
                const noti = await axiosClient
                    .post(`/follow/byShop`, {
                        userId: sessionStorage.getItem('x-client-id').replace(/"/g, ''),
                    },{
                        headers: { 
                                'content-type': 'application/x-www-form-urlencoded',
                                'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                                'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                            },
                    });
                const notiNewArray = noti.map(doc => doc.notiArrayUserFromShop).flat();
                setNotification(notiNewArray);
                if(notiNewArray.length > 0){
                    const notiArr = notiNewArray.map(async(noti)=> {
                        const notification = {};
                        notification.id = noti.data.noti_Id;
                        notification.category = 'order';
                        const notiDetail = await axiosClient
                            .post(`/notification/byId`, {
                                notiId: noti.data.noti_Id,
                            },{
                                headers: { 
                                        'content-type': 'application/x-www-form-urlencoded',
                                        'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                                        'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                                    },
                        });
                        console.log(notiDetail);
                        notification.subcategory = 'Subscriptions';
                        notification.text = notiDetail.noti_content;
                        const shopDetail = await axiosClient
                            .post(`/user/shop?userId=${noti.data.user_Id}`,{},
                            {
                                headers: { 
                                        'content-type': 'application/x-www-form-urlencoded',
                                        'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                                        'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                                    },
                            });
                        notification.user = {
                            firstName: shopDetail.first_name,
                            lastName: shopDetail.last_name,
                            avatar: shopDetail.avatar
                        }
                        return await notification
                    });
                    const notiArray = await Promise.all(notiArr);
                    setNotifications(notiArray);
                }
                
            }
        }
        
        
    }

    useEffect(() => {
        setSearchModalOpen(false);
    }, [width]);

    return (
        <>
            <Headroom style={{zIndex: 999}}>
                <div className="flex items-center justify-between">
                    {
                        width < 1920 &&
                        <button className="icon text-2xl leading-none"
                                aria-label="Open sidebar"
                                onClick={() => setOpen(true)}>
                            <i className="icon-bars-solid"/>
                        </button>
                    }
                    {
                        width >= 768 &&
                        <Search wrapperClass="flex-1 max-w-[1054px] ml-5 mr-auto 4xl:ml-0"/>
                    }
                    <div className="flex items-center gap-5 md:ml-5 xl:gap-[26px]">
                        {
                            width < 768 &&
                            <button className="text-[20px] leading-none text-gray dark:text-gray-red xl:text-2xl"
                                    aria-label="Open search"
                                    onClick={() => setSearchModalOpen(true)}>
                                <i className="icon-magnifying-glass-solid"/>
                            </button>
                        }
                        <button className="text-2xl leading-none text-gray dark:text-gray-red"
                                aria-label="Change theme"
                                onClick={toggleTheme}>
                            <i className={`icon-${theme === 'light' ? 'sun-bright' : 'moon'}-regular`}/>
                        </button>
                        <CustomTooltip title={<LocaleMenu active={locale} setActive={setLocale}/>}>
                            <button className="w-6 h-6 rounded-full overflow-hidden xl:w-8 xl:h-8"
                                    aria-label="Change language">
                                <img src={activeLocale.icon} alt={activeLocale.label}/>
                            </button>
                        </CustomTooltip>
                        <div className="relative h-fit mt-1.5 xl:self-end xl:mt-0 xl:mr-1.5">
                            <button className="text-lg leading-none text-gray dark:text-gray-red xl:text-[20px]"
                                    onClick={() => {
                                        setNotificationsPanelOpen(true);
                                        fetchData();
                                    }}
                                    aria-label="Notifications">
                                <i className="icon-bell-solid"/>
                            </button>
                            <span className="absolute w-3 h-3 rounded-full bg-red -top-1.5 -right-1.5 border-[2px] border-body
                                  xl:w-6 xl:h-6 xl:-top-5 xl:-right-4 xl:flex xl:items-center xl:justify-center">
                                <span className="hidden text-xs font-bold text-white dark:text-[#00193B] xl:block">
                                    {Notification.filter(noti => noti.isNew ==="true").length}
                                </span>
                            </span>
                        </div>
                        <div className="relative h-fit mt-1.5 xl:self-end xl:mt-0 xl:mr-1.5">
                            <button className="text-lg leading-none text-gray dark:text-gray-red xl:text-[20px]"
                                    onClick={() => setMessagesPanelOpen(true)}
                                    aria-label="Messages">
                                <i className="icon-message-solid"/>
                            </button>
                            <span className="absolute w-3 h-3 rounded-full bg-green -top-1.5 -right-1.5 border-[2px] border-body
                                  xl:w-6 xl:h-6 xl:-top-5 xl:-right-4 xl:flex xl:items-center xl:justify-center">
                                  <span className="hidden text-xs font-bold text-white dark:text-[#00193B] xl:block">
                                      2
                                  </span>
                            </span>
                        </div>
                        <div className="relative">
                            <button className="h-8 w-8 rounded-full bg-accent text-widget text-sm flex items-center
                                    justify-center relative xl:w-11 xl:h-11 xl:text-lg"
                                    onClick={() => navigate('/general-settings')}
                                    aria-label="Account menu">
                                <i className="icon-user-solid"/>
                            </button>
                            <span className="badge-online"/>
                        </div>
                    </div>
                </div>
            </Headroom>
            {
                width < 768 &&
                <ModalBase open={searchModalOpen} onClose={() => setSearchModalOpen(false)}>
                    <div className="card max-w-[360px] w-full">
                        <h3 className="mb-3">Search</h3>
                        <Search placeholder="What are you looking for?"/>
                    </div>
                </ModalBase>
            }
            <NotificationsPanel open={notificationsPanelOpen}
                                onOpen={() => setNotificationsPanelOpen(true)}
                                onClose={() => setNotificationsPanelOpen(false)}
                                notifications={notifications}/>
            <MessagesPanel open={messagesPanelOpen}
                           onOpen={() => setMessagesPanelOpen(true)}
                           onClose={() => setMessagesPanelOpen(false)}/>
        </>
    )
}

export default AppBar