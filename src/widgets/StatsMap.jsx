// components
import Spring from '@components/Spring';
import LabeledProgressBar from '@components/LabeledProgressBar';
import Counter from '@components/Counter';
import StatsHighlightTable from '@components/StatsHighlightTable';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import classNames from 'classnames';
import L from 'leaflet';

// hooks
import {useTheme} from '@contexts/themeContext';

// utils
import {getPercentage, numFormatter} from '@utils/helpers';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '@api/axiosClient';
import { useForm } from 'react-hook-form';

const colors = ['green', 'header', 'red'];
const data = [
    {label: 'New York', value: 123000, coords: {lat: 40.730610, lng: -73.935242}},
    {label: 'Los Angeles', value: 89000, coords: {lat: 34.052235, lng: -118.243683}},
    {label: 'Houston', value: 67000, coords: {lat: 29.760427, lng: -95.369804}},
    {label: 'Dallas', value: 23000, coords: {lat: 32.776665, lng: -96.796989}},
    {label: 'Chicago', value: 15000, coords: {lat: 41.878113, lng: -87.629799}},
    {label: 'Madrid', value: 10000, coords: {lat: 40.416775, lng: -3.703790}},
]

const CustomMarker = ({position, index, data}) => {
    const icon = L.divIcon({
        className: 'custom-icon',
        iconAnchor: [10, 10],
        html: `
            <div class="relative w-5 h-5">
                <span class="block w-5 h-5 rounded-full animate-ping-slow bg-${colors[index % colors.length]}"></span>
                <span class="dot bg-${colors[index % colors.length]}"></span>
            </div>
        `,
    });

    return (
        <Marker position={position} icon={icon}>
            <Popup>
                <div className="flex items-center gap-2.5">
                    <div className={`badge-icon badge-icon--sm bg-${colors[index % colors.length]}`}>
                        <i className="icon-diamond mt-1"/>
                    </div>
                    <div className="flex flex-col">
                        <span className="label-text">
                            {data.label}
                        </span>
                        <span className="text-header font-heading font-bold text-sm">
                            {numFormatter(data.value, 0, '$')}
                        </span>
                    </div>
                </div>
            </Popup>
        </Marker>
    )
};

const StatsMap = () => {
    const {theme} = useTheme();
    const tileProvider = theme === 'light' ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}' : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    const [inventorys, setInvetorys] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
        if(!sessionStorage.getItem('x-client-id') && !sessionStorage.getItem('x-rtoken-id')) navigate('/login');
        fetchData();
    }, [])

    const fetchData = async () => {
        const inven = await axiosClient
            .post(`/inventory/invenByShop`,{},
            {
                headers: { 
                        'Content-Type': 'multipart/form-data',
                        'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                        'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                    },
            });
        setInvetorys(inven);
    }

    const {register, handleSubmit, control, formState: {errors}} = useForm();

    const handleSave = async data => {
        console.log(data);
    }

    return (
        <Spring className="card flex-1 grid gap-[30px] md:gap-10 lg:grid-cols-[minmax(0,300px)_,minmax(0,1fr)]
                xl:pt-[33px] xl:pb-5 xl:pr-[31px] xl:pl-[37px]">
            <div>
                {/* <div className="flex flex-col gap-2.5 md:max-w-[300px] lg:gap-[25px]">
                    <h5>General Income Statistics</h5>
                    <StatsHighlightTable/>
                </div>
                <div className="flex items-center gap-[18px] my-[26px] lg:mt-11 lg:mb-9">
                    <div className="badge-icon bg-accent">
                        <i className="icon-diamond text-[21px] mt-0.5"/>
                    </div>
                    <div className="flex flex-col">
                        <Counter className="h3" num={924000} prefix="$" isFormatted/>
                        <span className="label-text">Total income</span>
                    </div>
                </div>
                <div className="flex flex-col gap-5 lg:gap-[14px]">
                    <h5>Income level by city</h5>
                    <div className="flex flex-col gap-4">
                        {
                            data.sort((a, b) => b.value - a.value)
                                .map((item, index) => (
                                    <LabeledProgressBar key={index}
                                                        label={item.label}
                                                        value={getPercentage(data, item.value)}
                                                        displayValue={numFormatter(item.value, 0, '$')}
                                                        color={colors[index % colors.length]}/>
                                ))
                        }
                    </div>
                </div> */}
                {
                    inventorys.length > 0 && inventorys.map((inventory) => {
                        return (
                            <div>
                                <h2 className='my-4'>{inventory.location}</h2>
                                <form className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,550px)] xl:gap-10" style={{width: '1260px'}}>
                                    <div>
                                        <div>
                                            <div className="grid grid-cols-2 gap-5 md:grid-cols-4 2xl:grid-cols-[repeat(5,minmax(0,1fr))]">
                                                <div className="grid grid-cols-2 col-span-2 gap-5 2xl:col-span-1 2xl:grid-cols-1">
                                                    <div className="field-wrapper">
                                                        <label className="field-label" htmlFor="inven_productId">
                                                            ProductID
                                                        </label>
                                                        <input
                                                            className={classNames('field-input')}
                                                            id="inven_productId"
                                                            defaultValue={inventory.inven_productId}
                                                            placeholder="Enter ProductID"
                                                            {...register('inven_productId', {required: true})}/>
                                                    </div>
                                                    <div className="field-wrapper">
                                                        <label className="field-label" htmlFor="inven_location">
                                                            Location
                                                        </label>
                                                        <input
                                                            className={classNames('field-input')}
                                                            id="inven_location"
                                                            defaultValue={inventory.inven_location}
                                                            placeholder="Enter location"
                                                            {...register('inven_location', {required: true})}/>
                                                    </div>
                                                    <div className="field-wrapper">
                                                        <label className="field-label" htmlFor="inven_stock">
                                                            Stock
                                                        </label>
                                                        <input
                                                            className={classNames('field-input')}
                                                            id="inven_stock"
                                                            defaultValue={inventory.inven_stock}
                                                            placeholder="Enter Stock"
                                                            {...register('inven_stock', {required: true})}/>
                                                    </div>
                                                    <div className="grid gap-1 sm:grid-cols-1 sm:mt-10 md:mt-6">
                                                        <button className="btn btn--secondary" onClick={handleSubmit(handleSave)}>
                                                            Save
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <table class="table-auto">
                                <thead>
                                    <tr>
                                    <th>ProductID</th>
                                    <th>Location</th>
                                    <th>Stock</th>
                                    <th>View</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <td>28700</td>
                                    <td>Nghe An</td>
                                    <td>1000</td>
                                    <td>Button</td>
                                    </tr>
                                </tbody>
                                </table>
                            </div>
                            )
                    })
                }
            </div>
            <div className="rounded-md overflow-hidden h-[300px] md:h-[450px] lg:h-auto lg:mt-[13px]">
                <MapContainer className="w-full h-full"
                              center={data[0].coords}
                              zoom={2}
                              minZoom={2}
                              maxZoom={4}
                              maxBounds={[[-90, -180], [90, 180]]}
                              zoomControl={false}>
                    <TileLayer url={tileProvider}/>
                    {
                        data.map((item, index) => (
                            <CustomMarker key={index} index={index} position={item.coords} data={item}/>
                        ))
                    }
                </MapContainer>
            </div>
        </Spring>
    )
}

export default StatsMap