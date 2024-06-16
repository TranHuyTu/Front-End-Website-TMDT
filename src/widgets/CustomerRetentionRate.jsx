// components
import Spring from '@components/Spring';
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from 'recharts';

// utils
import {commaFormatter, getPercentage, getTotal} from '@utils/helpers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '@components/Loader';

const CustomTooltip = ({active, payload, label}) => {
    if (active) {
        return (
            <div className="chart-tooltip p-2">
                <span className="h6">{commaFormatter(payload[0].value)}</span>
            </div>
        );
    }

    return null;
}


const CustomerRetentionRate = () => {
    const [data, setData] = useState([]);
    const color = ['chart-dark', 'accent', 'red', 'yellow'];

    useEffect(() => {
        fetchData();
    },[]);

    const fetchData = async()=>{
        const data  = await axios.post('http://localhost:8000/kmean/', {}, {
            headers: { 
                        'content-type': 'application/x-www-form-urlencoded',
                    },
        })
        setData(data.data.metadata);
    }
    
    if(data.length === 0){
        return (<Loader />)
    }else{
        return (
            <Spring className="card xl:col-span-4">
                <h5 className="mb-5">Customer Retention Rate</h5>
                <div className="flex flex-col gap-[30px] md:flex-row md:items-start lg:items-center lg:gap-[70px]">
                    <div className="shrink-0 h-[220px] md:w-[300px] md:h-[300px] lg:w-[450px] lg:h-[450px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius="100%"
                                    fill="#8884d8"
                                    dataKey="value"
                                    strokeWidth={0}
                                >
                                    {
                                        data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={`var(--${color[index]})`}/>
                                        ))
                                    }
                                </Pie>
                                <Tooltip content={<CustomTooltip/>}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div>
                        <h6>Total Customers - {commaFormatter(getTotal(data))} in 2024</h6>
                        <p className="mt-2.5 mb-3 md:mb-5">
                            Realizing that many readers are interested in learning and applying Data Analytics to work, I decided to write a series of Data Analytics with high applicability in the fields of Marketing, Sales, Finance, ... Our website focuses on supporting Data Analytics and its practical applications for sellers in businesses.
                        </p>
                        <ul className="flex flex-col gap-5">
                            {
                                data.map((item, index) => (
                                    <li className="flex gap-[14px]" key={index}>
                                        <i className="icon-circle-solid text-sm" style={{color: `var(--${color[index]})`}}/>
                                        <p className="label-text max-w-[280px]">
                                            {item.name} : {getPercentage(data, item.value)}%, which
                                            is {commaFormatter(item.value)} visitors
                                        </p>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </Spring>
        )
    }
    
}

export default CustomerRetentionRate