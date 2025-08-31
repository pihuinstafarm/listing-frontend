import React, { useEffect, useState ,useRef} from 'react'

import {Checkbox } from '@mui/material'

function locationsmodal({locationLists,selectLocation}) {
    const [sortedLocation, setSortedLocation] = useState()
    const [selectedCount, setSelectedCount] = useState(0)
    
    useEffect(() => {
       let newSotedtData = locationLists.sort(SortByName('name',1));
        setSortedLocation(newSotedtData)
     }, [locationLists])


    useEffect(() => {
        

        let allSelcted=0
        locationLists.forEach(element => {
            if(element['selected']){
                allSelcted++
            }
        });
        setSelectedCount(allSelcted)


    }, [selectLocation])

   

    const SortByName=(property,sortOrder )=> {
        return function (a,b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    if(sortedLocation){
        return (
        <div className={'optionList'} >
            <p key={'location_all'} onClick={()=>selectLocation('all')} className={sortedLocation.length==selectedCount?'active':''}><Checkbox style={{color:'#8C684D'}} checked={sortedLocation.length==selectedCount?true:false}/>Any Location</p>
        {sortedLocation.map((location, index) => (
                <p key={'location_'+index} onClick={()=>selectLocation(location)} className={location.selected?'active':''}><Checkbox style={{color:'#8C684D'}} checked={location.selected?true:false}/>{location.name}</p>
        ))}
        </div>
    )}
}


export default locationsmodal
