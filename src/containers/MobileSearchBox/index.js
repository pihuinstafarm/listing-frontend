import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import styles from './index.module.scss'
import { Input } from '@mui/material'
import MobileSearchIcon from '../../../public/assets/images/svg/MobileSearchIcon'

import MobileSearchIconWhite from '../../../public/assets/images/svg/MobileSearchIconWhite'
import CloseIcon from '@mui/icons-material/Close'
import MobileFilterIcon from '../../../public/assets/images/svg/MobileFilterIcon'
import { Modal } from 'components'
import { Button } from 'utils/components'


import {DateRangePicker} from "@nextui-org/date-picker";

import {getLocalTimeZone, parseDate, today} from "@internationalized/date";


function MobileSearchBox({allLocations}) {
    const [AllSearchLocations, setAllLocations] = useState(allLocations)
    const router = useRouter()
    const [location, setLocation] = useState('')
    const [searhKey, setSearhKey] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [activeItem, setActiveItem] = useState('')
    const [activeTab, setActiveTab] = useState('Farms')
    const [locationLists, setLocationLists] = useState('')
    const [selectedLocation, setSelectedLocation] = useState({name:'',slug:''})
    const [searchPayload, setSearchPayload] = useState({location:'',guestcount:'',guest:{adult:0,children:0,infant:0},checkin:'',checkout:''})
    const searchLocation= async ()=>{
        /*
        let locationPayload ={
            pageNumber:1,
            totalPages:0,
            LastDocument:false,
            moveTo:false,
            perPage:25,
            orderBy:'weight',
            searchBy:'name',
            searchKey:capitalizeFirstLetter(searhKey),
          }
          
          let searchResponse = await locationsSerivces.getAllLocations(locationPayload);
          setLocationLists(searchResponse)
          */
          let val = capitalizeFirstLetter(searhKey)
          let searchResponse =[]
          for (var i = 0; i < AllSearchLocations.length; i++) {
          if (AllSearchLocations[i]['name'].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            searchResponse.push(AllSearchLocations[i])
          }
         }
         setLocationLists(searchResponse)

    }
    useEffect(() => {
        
        if(searhKey.length>1){
            searchLocation()
        }
    }, [searhKey])
    const updatedSearhKey= async (value)=>{
        setSearhKey(value)
        setSelectedLocation({name:value})
        setSelectedLocation((prev) => ({
            ...prev,
            ['name']:value,
            ['slug']:''
          }))
    }
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const selectLocation=(location)=>{
        setSelectedLocation((prev) => ({
            ...prev,
            ['name']:location.name,
            ['slug']:location.slug
          }))
        setLocationLists('')
        setSearhKey('');
    }
   
    const submitSearch=()=>{
        // router.push('search/?location='+selectedLocation.slug+'&guestcount='+searchPayload.guestcount+'&checkin='+searchPayload.checkin+'&checkout='+searchPayload.checkout+'&adult='+searchPayload.guest.adult+'&children='+searchPayload.guest.children+'&infant='+searchPayload.guest.infant)
         router.push('/location/'+selectedLocation.slug)
        }
const updatePayload=(inputType,value)=>{
    
    setSearchPayload((prev) => ({
        ...prev,
        [inputType]:value
      }))
      setActiveItem('')
   
      
}
const updateDateRange=(value)=>{
    updatePayload('checkin',value.start.day+'/'+value.start.month+'/'+value.start.year)
    updatePayload('checkout',value.end.day+'/'+value.end.month+'/'+value.end.year)
    
}

    const increament=(type)=>{
        let guestPayload = {
            adult:searchPayload.guest.adult,
            children:searchPayload.guest.children,
            infant:searchPayload.guest.infant}
        if(type =='adult'){
            guestPayload.adult = searchPayload.guest.adult+1
        }
        if(type =='children'){
            guestPayload.children = searchPayload.guest.children+1
        }
        if(type =='infant'){
            guestPayload.infant = searchPayload.guest.infant+1
        }
        let guestCount = guestPayload.adult+guestPayload.children+guestPayload.infant
        
        
        setSearchPayload((prev) => ({
            ...prev,
            guest:guestPayload,
            guestcount:guestCount
          }))
    }
    const deccreament=(type)=>{
        let guestPayload = {
            adult:searchPayload.guest.adult,
            children:searchPayload.guest.children,
            infant:searchPayload.guest.infant}
        if(type =='adult'){
            guestPayload.adult = searchPayload.guest.adult>0?searchPayload.guest.adult-1:0
        }
        if(type =='children'){
            guestPayload.children = searchPayload.guest.children>0?searchPayload.guest.children-1:0
        }
        if(type =='infant'){
            guestPayload.infant = searchPayload.guest.infant>0?searchPayload.guest.infant-1:0
        }
        let guestCount = guestPayload.adult+guestPayload.children+guestPayload.infant
        
        setSearchPayload((prev) => ({
            ...prev,
            guest:guestPayload,
            guestcount:guestCount
          }))
    }

    if(isOpen) {
        return (
        <Modal classname={styles.wrapper} onClose={() => setIsOpen(false)} isOpen={isOpen}>
            <div className={styles.header}>
            <Button
               aria-label="close"
                width={32}
                label={<CloseIcon variant="alert" />}
                className={styles.close}
                onClick={() => setIsOpen(false)}
            />
            <div className={styles.tabs}>
                <p className={activeTab =='Farms' ?styles.active:''} onClick={()=>setActiveTab('Farms')}>Farms</p>
                <p className={activeTab =='Villas' ?styles.active:''} onClick={()=>setActiveTab('Villas')}>Villas</p>
            </div>
            
            </div>
             <div className={styles.content}>
             <div className={activeItem =='destination' ?styles.searchitembox+' '+ styles.active:styles.searchitembox}   >
             {activeItem !='destination' &&( <div className={styles.values}  onClick={()=>setActiveItem('destination')} >
                <p className={styles.label}>Destination</p>
                <p className={styles.value}>{searchPayload.location}</p>
                </div>
              )}
              <div className={styles.searchitemboxChild}>
                <h1>Where To?</h1>
                <div className={styles.searchbox}>
                    <div className={styles.innnerwrapper}>
                        <MobileSearchIcon/>
                        <Input onChange={(e)=>updatedSearhKey(e.target.value)} className={styles.searchinput} type="text" placeholder='Search destination' name="location" value={selectedLocation.name}/>
                   </div>
                </div>
                {locationLists &&(<div className={styles.optionList} >
               
                {locationLists.map((location, index) => (
                    <p key={'location_'+index} onClick={()=>selectLocation(location)}>{location.name}</p>
                ))}
                   
                </div>)}
              </div>
             </div>
             {/*
             <div className={activeItem =='howmany' ?styles.searchitembox+' '+ styles.active:styles.searchitembox} >
             {activeItem !='howmany' &&( <div className={styles.values}  onClick={()=>setActiveItem('howmany')} >
              <p className={styles.label}>How Many</p>
              <p className={styles.value}>{searchPayload.guestcount} Guests</p>
              </div>
             )}
             <div className={styles.searchitemboxChild}>
                <h1>How Many?</h1>
                
                <div className={styles.rowbox}>
                 <div className={styles.rowboxlabel}>
                    <p>Adults</p>
                    <span>Age 13 or above</span>
                 </div>
                 <div className={styles.rowboxoption}>
                 <span onClick={()=>increament('adult')}>+</span>
                 <span className={styles.value}>{searchPayload.guest.adult}</span>
                 <span onClick={()=>deccreament('adult')}>-</span>
                 </div>
                
                </div>

                <div className={styles.rowbox}>
                 <div className={styles.rowboxlabel}>
                    <p>Children</p>
                    <span>Age 3 to 12</span>
                 </div>
                 <div className={styles.rowboxoption}>
                 <span onClick={()=>increament('children')}>+</span>
                 <span className={styles.value}>{searchPayload.guest.children}</span>
                 <span onClick={()=>deccreament('children')}>-</span>
                 </div>
                    
                </div>


                <div className={styles.rowbox}>
                 <div className={styles.rowboxlabel}>
                    <p>Infants</p>
                    <span>Under 3</span>
                 </div>
                 <div className={styles.rowboxoption}>
                 <span onClick={()=>increament('infant')}>+</span>
                 <span className={styles.value}>{searchPayload.guest.infant}</span>
                 <span onClick={()=>deccreament('infant')}>-</span>
                 </div>
                    
                </div>
                <button className='plainbtn' onClick={()=>setActiveItem('')}> Done</button>
                
               
              </div>
             </div>

             <div className={styles.searchitembox}>
              <p className={styles.label}>Stay duration</p>
              <p className={styles.value}><DateRangePicker 
                    minValue={today(getLocalTimeZone())}
                    onChange={(value)=>updateDateRange(value)}  
                    className={styles.DateRangePicker}/>
                </p>
             

             </div>
             */}

            


             <div className={styles.searchapplybox}>
              <p className={styles.label}>Clear all</p>
              <p className={styles.value} onClick={()=>submitSearch()}><MobileSearchIconWhite/> Search</p>
             </div>
               
            </div>
            
        </Modal>
    )
        }
    return (
        <>
       
        <div className={styles.searchbox}>
            <div className={styles.innnerwrapper} onClick={() => setIsOpen(true)}>
            <MobileSearchIcon/>
                <Input onChange={(e) => setIsOpen(true)} className={styles.searchinput} type="text" name="location" value={location}/>
            <MobileFilterIcon/>
           </div>
        </div>
        </>
    )
}


export default MobileSearchBox
