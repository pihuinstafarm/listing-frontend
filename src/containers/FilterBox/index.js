import React, { useEffect, useState ,useRef} from 'react'

import styles from './index.module.scss'
import Image from 'next/image'
import {Slider} from "@nextui-org/slider";




function FilterBox({allAmenities,sortReset,dataList}) {
    const [resetData, setResetData] = useState(false);
    const [sortedAmenities, setSortedAmenities] = useState()
    const [sortedActivities, setSortedActivities] = useState()
    
    const [defaultMinPrice, setDefaultMinPrice] = useState(10);
    const [defaultMaxPrice, setDefaultMaxPrice] = useState(100);
    const [defaultStepsPrice, setDefaultStepsPrice] = useState(100);
    const [filteredData, setFilteredData] = useState(dataList);
    const [bedroomCount, setBedroomCount] = useState(0);
    const [defaultMaxBedCount, setDefaultMaxBedCount] = useState(10);
    const [maxAmeItem, setMaxAmeItem] = useState(6);
    const [maxActItem, setMaxActItem] = useState(6);
    const decReaseBedRoom=()=>{
        
        let newBedroomCount = defaultMaxBedCount
        if(bedroomCount>1){
            newBedroomCount = bedroomCount-1
        }else{
            newBedroomCount = 0
            
        }
        
        setBedroomCount(newBedroomCount)
        setFilterPayload((prev) => ({
            ...prev,
            bedroomCount:newBedroomCount
          }))
    }
    const incReaseBedRoom=()=>{
        let newBedroomCount = defaultMaxBedCount
        if(bedroomCount< defaultMaxBedCount){
            newBedroomCount = bedroomCount+1
        }else{
            newBedroomCount = defaultMaxBedCount
        }
        
        setBedroomCount(newBedroomCount)
        setFilterPayload((prev) => ({
            ...prev,
            bedroomCount:newBedroomCount
          }))
    }
                

    const clearFilters=()=>{
        setBedroomCount(0)
        setFilteredData(dataList)
        setFilterPayload((prev) => ({
            ...prev,
            ['minprice']:defaultMinPrice,
            ['maxprice']:defaultMaxPrice,
            amenity:[],
            sortby:'rating',
            bedroomCount:2
          }))
    } 
    const applyFilters=()=>{
        sortReset(filteredData)
    } 

    useEffect(() => {
        const sanitizedList = Array.isArray(dataList) ? dataList : []
        let minPrice = getMinPrice(sanitizedList)
        let maxPrice = getMaxPrice(sanitizedList)
        let maxBedCount = getMaxBedCount(sanitizedList)

        // Fallbacks to keep slider stable
        if (!isFinite(minPrice)) minPrice = 0
        if (!isFinite(maxPrice) || maxPrice < minPrice) maxPrice = Math.max(minPrice, 100)
        if (!isFinite(maxBedCount) || maxBedCount < 0) maxBedCount = 10

        setDefaultMaxBedCount(maxBedCount)
        setDefaultMinPrice(minPrice)
        setDefaultMaxPrice(maxPrice)
        setFilterPayload((prev) => ({
            ...prev,
            ['minprice']:minPrice,
            ['maxprice']:maxPrice
          }))
    }, [dataList])

    function getMinPrice(properties) {
        const list = Array.isArray(properties) ? properties : []
        const amounts = list
            .map((item) => Number(item?.PropertyPrice?.bookingAmount))
            .filter((n) => !Number.isNaN(n))
        return amounts.length ? Math.min(...amounts) : 0
    }

    function getMaxPrice(properties) {
        const list = Array.isArray(properties) ? properties : []
        const amounts = list
            .map((item) => Number(item?.PropertyPrice?.bookingAmount))
            .filter((n) => !Number.isNaN(n))
        return amounts.length ? Math.max(...amounts) : 100
    }

    function getMaxBedCount(properties) {
        const list = Array.isArray(properties) ? properties : []
        const counts = list
            .map((item) => Number(item?.bedroom_count))
            .filter((n) => !Number.isNaN(n))
        const max = counts.length ? Math.max(...counts) : 10
        return max < 0 ? 10 : max
    }
    
    useEffect(() => {
        // console.log('🎛️ FilterBox: Processing allAmenities:', allAmenities);
        // console.log('🎛️ FilterBox: allAmenities type:', typeof allAmenities);
        // console.log('🎛️ FilterBox: allAmenities is array?', Array.isArray(allAmenities));
        
        const amenitiesArray = Array.isArray(allAmenities) ? allAmenities : []
        // console.log('🎛️ FilterBox: amenitiesArray length:', amenitiesArray.length);
        
        // Debug: Check what type values exist in the data
        const typeValues = amenitiesArray.map(item => item?.type).filter(Boolean);
        const uniqueTypes = [...new Set(typeValues)];
        // console.log('🔍 FilterBox: All type values found:', typeValues);
        // console.log('🔍 FilterBox: Unique type values:', uniqueTypes);
        // console.log('🔍 FilterBox: Sample items with their types:', amenitiesArray.slice(0, 5).map(item => ({name: item?.name, type: item?.type})));
        // console.log('🔍 FilterBox: Full sample item structure:', amenitiesArray[0]);
        
        const newAmenities = amenitiesArray.filter(item => item?.type !== 'activities');
        // console.log('🏠 FilterBox: Filtered amenities (non-activities):', newAmenities);
        // console.log('🏠 FilterBox: Amenities count:', newAmenities.length);
        
        let newSotedtAmenities = newAmenities.sort(SortByName('name',1));
        setSortedAmenities(newSotedtAmenities)

        const newActivities = amenitiesArray.filter(item => item?.type === 'activities');
        // console.log('🎯 FilterBox: Filtered activities:', newActivities);
        // console.log('🎯 FilterBox: Activities count:', newActivities.length);
        
        let newSotedtActivities = newActivities.sort(SortByName('name',1));
        setSortedActivities(newSotedtActivities)
    }, [allAmenities])

    const SortByName=(property,sortOrder )=> {
        return function (a,b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }
    const [filterPayload, setFilterPayload] = useState({
        minprice:defaultMinPrice,
        maxprice:defaultMaxPrice,
        amenity:[],
        sortby:'rating',
        bedroomCount:2
    })

    useEffect(() => {
        let filteredData=[]
        if(dataList){
          for (var i = 0; i < dataList.length; i++) {
                   if (dataList[i]['PropertyPrice']['bookingAmount']>=filterPayload.minprice && dataList[i]['PropertyPrice']['bookingAmount']<=filterPayload.maxprice) {
                      filteredData.push(dataList[i])
                    }
           }
        }
        let amenityFiltered=[]
         if(filterPayload.amenity.length>0){
        
        if(filteredData){
         for (var i = 0; i < filteredData.length; i++) {
            const hasAllAmenities = filterPayload.amenity.every(amenity =>
                filteredData[i]['amenities'].some(a => a.name === amenity) // Check if each required amenity exists
            );
        
            if (hasAllAmenities) {
                const exists = amenityFiltered.some(item => item.id === filteredData[i].id);
                if (!exists) {
                    amenityFiltered.push(filteredData[i]);
                }
            }
        }
        
      }
        }else{
            amenityFiltered=filteredData
        }

        let bedroomFiltered=[]
        if(filterPayload.bedroomCount>0){
          for (var i = 0; i < amenityFiltered.length; i++) {
                   if (parseInt(amenityFiltered[i]['bedroom_count']) > parseInt(bedroomCount)) {
                    const exists = bedroomFiltered.some(item => item.id === amenityFiltered[i].id); 
                    if(!exists){
                        bedroomFiltered.push(amenityFiltered[i])
                    }
                    }
           }
           
        }else{
            bedroomFiltered = amenityFiltered
        }
    
        let sortOrder=1
        let sortingFIltered=[]
        if(filterPayload.sortby =='price_hl'){
             sortOrder=-1
        }
        if(filterPayload.sortby =='price_lh'){
            sortOrder=1
        }
        
        if(filterPayload.sortby =='rating'){
            sortOrder=-1
            sortingFIltered = bedroomFiltered.sort(ratingSort(sortOrder));
        }else{
            sortingFIltered = bedroomFiltered.sort(priceSort(sortOrder));
        }
        setFilteredData(sortingFIltered)
    }, [filterPayload])

    const priceSort=(sortOrder )=> {
        
        return function (a,b) {
            var result = (a['PropertyPrice']['bookingAmount'] < b['PropertyPrice']['bookingAmount']) ? -1 : (a['PropertyPrice']['bookingAmount']> b['PropertyPrice']['bookingAmount']) ? 1 : 0;
            return result * sortOrder;
        }
    }
    const ratingSort=(sortOrder )=> {
        return function (a,b) {
            var result = (a['rating'] < b['rating']) ? -1 : (a['rating']> b['rating']) ? 1 : 0;
            return result * sortOrder;
        }
    }


   


    const updatePayload=(inputType,value)=>{
        if(inputType=='amenity'){
            let oldList = filterPayload.amenity
            if(oldList.includes(value)){
                oldList.forEach((item, index) => {
                    if (item === value) {
                        oldList.splice(index, 1);
                    }
                });
                
            }else{
            oldList.push(value)
            }
            value = oldList
        }
        setFilterPayload((prev) => ({
            ...prev,
            [inputType]:value
          }))
          
    }

    const updatePricePayload=(inputType,value)=>{
        if(value>0){
        if(inputType=='minprice' && value>filterPayload.maxprice){
            value=filterPayload.maxprice 
        }
        if(inputType=='maxprice' && value<filterPayload.minprice){
            value=filterPayload.minprice 
        }
        setFilterPayload((prev) => ({
            ...prev,
            [inputType]:value
          }))
        }
    }


    const updatePriceRange=(PriceRange)=>{
        setFilterPayload((prev) => ({
            ...prev,
            ['minprice']:PriceRange[0]?parseInt(PriceRange[0]):defaultMinPrice,
            ['maxprice']:PriceRange[1]?parseInt(PriceRange[1]):defaultMaxPrice
          }))

        }
    
    return (<>
       <p className={styles.modalheading}>Filters</p>
        <div className={styles.filterbox}>
           
                
                <p className={styles.heading}>Price Range</p>
                <div className={styles.filterboxrow+' filterboxrow'}>
                
                <Slider 
                    step={defaultStepsPrice} 
                    minValue={defaultMinPrice} 
                    maxValue={defaultMaxPrice} 
                    value={[filterPayload.minprice, filterPayload.maxprice]} 
                    formatOptions={{style: "currency", currency: "INR"}}
                    onChange={updatePriceRange}
                    />
                        <div className={styles.pricebtn}>
                            <div className={styles.priceinput}>
                              <label>Minimum</label>
                              <p>
                              ₹ <input onChange={(e)=>updatePricePayload(e.target.name,parseInt(e.target.value))} type="number" step={defaultStepsPrice} name="minprice" className={styles.input} value={filterPayload.minprice}/>
                              </p>
                            </div>
                            
                            
                            <div className={styles.priceinput}>
                               <label>Maximum</label>
                               <p>
                               ₹ <input onChange={(e)=>updatePricePayload(e.target.name,parseInt(e.target.value))} type="number" step={defaultStepsPrice} className={styles.input} name="maxprice" value={filterPayload.maxprice}/>
                                </p>
                            </div>
                        </div>
                </div>
                
                <p className={styles.heading}>Amenities</p>
                {sortedAmenities &&<div className={styles.filterboxrow}>
                    {sortedAmenities.slice(0,maxAmeItem).map((amenity, index) => (
                       <div onClick={(e)=>updatePayload('amenity',amenity.name)} className={filterPayload.amenity.includes(amenity.name)?styles.amenityBox +' '+  styles.active:styles.amenityBox }  key={'amenity_'+index}>
                            {amenity.icon &&<Image alt={amenity.name}  width={50} height={50} src={amenity.icon} />}
                            {amenity.name}
                      </div>
                        
                    ))}
                    {sortedAmenities.length>maxAmeItem ?<p className={styles.loadMore} onClick={()=>setMaxAmeItem(sortedAmenities.length)}>
                        Load more <svg  viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <polyline points="30,40 50,60 70,40" stroke="black" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                        </p>:<p className={styles.loadMore} onClick={()=>setMaxAmeItem(6)}>
                  Show less <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <polyline points="30,60 50,40 70,60" stroke="black" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                        </p>}
                </div> } 
                
                <p className={styles.heading}>Activities</p>
                {sortedActivities &&<div className={styles.filterboxrow}>
                    {sortedActivities.slice(0,maxActItem).map((amenity, index) => (
                       <div onClick={(e)=>updatePayload('amenity',amenity.name)} className={filterPayload.amenity.includes(amenity.name)?styles.amenityBox +' '+  styles.active:styles.amenityBox }  key={'amenity_'+index}>
                            {amenity.icon &&<Image alt={amenity.name}  width={50} height={50} src={amenity.icon} />}
                            {amenity.name}
                      </div>
                        
                    ))}
                  {sortedActivities.length>maxActItem ?<p className={styles.loadMore} onClick={()=>setMaxActItem(sortedActivities.length)}>
                  Load more <svg  viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <polyline points="30,40 50,60 70,40" stroke="black" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                        </p>:<p className={styles.loadMore} onClick={()=>setMaxActItem(6)}>
                  Show less <svg  viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <polyline points="30,60 50,40 70,60" stroke="black" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                        </p>}  
                </div> } 

                <div className={styles.bedroom_filter}>
                <p className={styles.heading}>Bedrooms</p>
                <p>
                    <span className={styles.countBtn} onClick={()=>decReaseBedRoom()}>
                    <svg width="20" height="20" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <line x1="20" y1="50" x2="80" y2="50" stroke="black" stroke-width="10" stroke-linecap="round"/>
                    </svg>
                    </span>
                    <span>{bedroomCount>0?bedroomCount+'+':'Any'}</span>
                    <span className={styles.countBtn} onClick={()=>incReaseBedRoom()}>
                    <svg width="20" height="20" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <line x1="50" y1="20" x2="50" y2="80" stroke="black" stroke-width="10" stroke-linecap="round"/>
                        <line x1="20" y1="50" x2="80" y2="50" stroke="black" stroke-width="10" stroke-linecap="round"/>
                    </svg>
                    </span>
                </p>
                </div>

                <p className={styles.heading}>Sort By</p>
                <div className={styles.filterboxrow}>
                <div onClick={(e)=>updatePayload('sortby','rating')}  className={filterPayload.sortby=='rating'?styles.sortby +' '+  styles.active:styles.sortby }>
                    <Image alt="Rating"  width={20} height={20} src={'/assets/images/rating.png'} />
                    <p>Rating</p>
                    <span>High to Low</span>
                </div>
                <div onClick={(e)=>updatePayload('sortby','price_hl')} className={filterPayload.sortby=='price_hl'?styles.sortby +' '+ styles.active:styles.sortby }>
                    <Image alt="search"  width={20} height={20} src={'/assets/images/high-to-low.png'} />
                    <p>Price</p>
                    <span>High to Low</span>
                </div>

                <div onClick={(e)=>updatePayload('sortby','price_lh')} className={filterPayload.sortby=='price_lh'?styles.sortby +' '+  styles.active:styles.sortby }>
                    <Image alt="search"  width={20} height={20} src={'/assets/images/low-to-high.png'} />
                    <p>Price</p>
                    <span>Low to High</span>
                </div>

                </div>
        </div>
        <div className={styles.modalFooter}>
            <button className='hollowbtn' onClick={()=>clearFilters()}>Clear All</button>
            <button className='solidbtn'  onClick={()=>applyFilters()}> Show {filteredData.length} Properties</button>
        </div>
    </>
    )
    
}


export default FilterBox
