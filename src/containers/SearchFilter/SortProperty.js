import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'
import Image from 'next/image'

function SortProperty({sortReset,dataList,orderByOptions}) {
    const [showOptionList, setShowOptionList] = useState(false);
    const [allData, setAllData] = useState('');
    const [defaultOrder, setDefaultOrder] = useState('popular_DESC');
    
    useEffect(() => {
        
        setAllData(dataList)
    }, [dataList,orderByOptions])

    const resetOrder= async (orderBy,order)=>{
        setShowOptionList(false)
        setDefaultOrder(orderBy+'_'+order)
        let  sortOrder=-1
        if(order=='ASC'){
            sortOrder=1
        }
        if(orderBy=='guest_count'){
            orderBy='max_guest_count'
            let newSotedtData = allData.sort(dynamicSortByNumericValue(orderBy,sortOrder));
            sortReset(newSotedtData)
        }else if(orderBy=='popular'){
            orderBy='weight'
            let newSotedtData = allData.sort(dynamicSortByNumericValue(orderBy,sortOrder));
            sortReset(newSotedtData)
        }else if(orderBy=='bedrooms'){
            let newSotedtData = allData.sort(dynamicSortByRooms(sortOrder));
            sortReset(newSotedtData)
        }else if(orderBy=='price'){
            let newSotedtData = allData.sort(dynamicSortByPrice(sortOrder));
            sortReset(newSotedtData)
        }else{
            let newSotedtData = allData.sort(dynamicSort(orderBy,sortOrder));
            sortReset(newSotedtData)
        }
     }

     const dynamicSortByNumericValue=(orderBy,sortOrder )=> {
        return function (a,b) {
            let aPrice = a[orderBy]?parseFloat(a[orderBy]):0;
            let bPrice = b[orderBy]?parseFloat(b[orderBy]):0;
            if(sortOrder==1){
                return aPrice - bPrice;
            }else{
                return bPrice - aPrice;   
            }
        }
    }

     const dynamicSortByPrice=(sortOrder )=> {
        return function (a,b) {
            let aPrice = parseFloat(a['price_detail']['weekPrice']['0']['price']);
            let bPrice = parseFloat(b['price_detail']['weekPrice']['0']['price']);
            if(sortOrder==1){
            return aPrice - bPrice;
            }else{
                return bPrice - aPrice;   
            }
        }
    }

    const dynamicSortByRooms=(sortOrder )=> {
        return function (a,b) {

            let aPrice = a['rooms']['bedrooms'].length?parseFloat(a['rooms']['bedrooms'].length):0;
            let bPrice = b['rooms']['bedrooms'].length?parseFloat(b['rooms']['bedrooms'].length):0;
            if(sortOrder==1){
            return aPrice - bPrice;
            }else{
                return bPrice - aPrice;   
            }

            
        }
    }

    const dynamicSort=(property,sortOrder )=> {
        return function (a,b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }
    const capitalizeFirstLetter=(string) =>{
         let newstring = string.charAt(0).toUpperCase() + string.slice(1);
        return newstring.replaceAll('_',' ')
    }

    const getDefaultOrderBY=()=>{
        let orderBYArray = defaultOrder.split("_");
        return orderBYArray[0].charAt(0).toUpperCase() + orderBYArray[0].slice(1);
    }

    const getDefaultOrder=()=>{
        let orderBYArray = defaultOrder.split("_");
        if(orderBYArray[0]=='name'){
            if(orderBYArray[1]=='ASC'){
                return 'A-Z'
              }else{
                  return 'Z-A'    
              }
        }else{
        if(orderBYArray[1]=='ASC'){
          return 'Min-Max'
        }else{
            return 'Max-Min'    
        }
        }
    }
    return (
        <>
        <div className={styles.sortBox}>
        <span className={styles.solidbtn+' solidbtn'}  onClick={()=>setShowOptionList(!showOptionList)} >
            Sort By: {getDefaultOrderBY()} ({getDefaultOrder()})
            </span>
            
        {showOptionList &&<div className={styles.optionList} >
        <p className={defaultOrder=='popular_ASC'?styles.active:''}  onClick={()=>resetOrder('popular','ASC')}>Most {capitalizeFirstLetter('popular')}</p>
        <p className={defaultOrder=='name_ASC'?styles.active:''}  onClick={()=>resetOrder('name','ASC')}>{capitalizeFirstLetter('name')}  ( A-Z )</p>
        <p className={defaultOrder=='name_DESC'?styles.active:''}  onClick={()=>resetOrder('name','DESC')}>{capitalizeFirstLetter('name')}  (Z-A)</p>
        {orderByOptions.map((orderBy, index) => (
            <>
                 <p className={defaultOrder==orderBy+'_ASC'?styles.active:''}  onClick={()=>resetOrder(orderBy,'ASC')}>{capitalizeFirstLetter(orderBy)} (Min-Max)</p>
                 <p className={defaultOrder==orderBy+'_DESC'?styles.active:''}  onClick={()=>resetOrder(orderBy,'DESC')}>{capitalizeFirstLetter(orderBy)} (Max-Min)</p>
                 </>
            ))}
                 
                 </div>}
         </div>
        
       
         </> )
}


export default SortProperty
