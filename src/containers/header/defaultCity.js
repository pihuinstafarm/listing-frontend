import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

import styles from './content.module.scss'
import { locationsSerivces } from 'utils/services'
import { Input } from '@mui/material'

function DefaultCity({allCity,defaultLocation, reSetDefaultLocation }) {
    const [topCities, setTopCities] = useState()
    const [allTopCities, setAllTopCities] = useState([])
    const [topDefaultCities, setDefaultTopCities] = useState()
    const [showLocationList, setShowLocationList] = useState(false)
    const router = useRouter()
    useEffect(() => {
      if(allCity && allCity.length>0){
      setTopCities(allCity)
      setAllTopCities(allCity)
      }
  }, [allCity])

    const searchCity=(searchKey)=>{
        if(searchKey.length>1){
        let searchPayload ={
            pageNumber:1,
            totalPages:0,
            LastDocument:false,
            moveTo:false,
            perPage:10,
            orderBy:'weight',
            searchBy:'name',
            searchKey:capitalizeFirstLetter(searchKey),
          }
          getTopCity(searchPayload)
        }
    }
    const capitalizeFirstLetter=(string) =>{
        if(string){
         return string.charAt(0).toUpperCase() + string.slice(1);
        }else{
          return string;
        }
      }
    const getTopCity= async (searchPayload)=>{
       /* let allCitiesRes =await locationsSerivces.SearchCity(searchPayload);

       */
      let val = searchPayload.searchKey
       let allCitiesRes =[]
       for (var i = 0; i < allTopCities.length; i++) {
       if (allTopCities[i]['name'].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        allCitiesRes.push(allTopCities[i])
       }
      }
        setTopCities(allCitiesRes)
     }

     const SetDefaultLocation=(city)=>{
        setShowLocationList(false)
        reSetDefaultLocation(city)
        let searchPayload ={
            pageNumber:1,
            totalPages:0,
            LastDocument:false,
            moveTo:false,
            perPage:10,
            orderBy:'weight',
            searchBy:'',
            searchKey:'',
          }
          getTopCity(searchPayload)

     }

return (
    <>
    <p className={styles.user_location} onClick={() => { setShowLocationList(!showLocationList) }}>
                {defaultLocation?defaultLocation.name:''}
    </p>
    <div className={showLocationList ? styles.list_locations_outer:styles.list_hidden}>
                <div className={styles.serchBox}>
                    <Input placeholder="Search city..." className={styles.textInput} onChange={(e)=>searchCity(e.target.value)} />
                </div>
            {topCities &&<div className={styles.list_locations}>
                
            {topCities.map((city, index) => (
                <Link  scroll={true} aria-label={city.name}   key={'city-slide-' + index} className='location' href={`/city/${city.slug}`} onClick={()=>SetDefaultLocation(city)}>
                {city.icon ?<Image width={20} height={20} alt="loation" src={city.icon}/>:
                <Image className='smallIcon' width={16} height={20} alt="loation" src={'/assets/images/user_location.webp'}/>}
                <span>{city.name}</span>
                </Link>
            ))}

            </div>}
        </div>
        </>
)
}

export default DefaultCity