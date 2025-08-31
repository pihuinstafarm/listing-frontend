import React, { useEffect, useState ,useRef} from 'react'
import { useRouter } from 'next/router'


import Link from 'next/link';
import styles from './index.module.scss'
import { Input } from '@mui/material'
import Image from 'next/image'
import { locationsSerivces } from 'utils/services'
import { Modal } from 'components'
import { Button} from 'utils/components'
import CloseIcon from '@mui/icons-material/Close'
import LocationsModal from 'components/locationsmodal'
import GuestsModal from 'components/guestsmodal'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'


function DesktopSearchBox({queryData,allLocations,showFilterModal,updateSearchQuery}) {

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const refLocation = useRef(null);
    const refGuest = useRef(null);
    const [AllSearchLocations, setAllLocations] = useState(allLocations)
    const [showModal, setShowModal] = useState(false)
    const [queryString, setQueryString] = useState('');
    const [searchModal, setSearchModal] = useState(false)
    
    const router = useRouter()
    const [allSelectedLocations, setAllSelectedLocations] = useState('')
    const [searchPayload, setSearchPayload] = useState({
        location:queryData.location,
        guestcount:parseInt(queryData.adult)+parseInt(queryData.children)+parseInt(queryData.infant),
        guest:{adult:queryData.adult,children:queryData.children,infant:queryData.infant}})
    
    
    
      useEffect(() => {
        
        if(allLocations.length>0){
        setAllLocations(allLocations)
        }
      }, [allLocations]);

  useEffect(() => {
    setSearchPayload({location:queryData.location,
      guestcount:parseInt(queryData.adult)+parseInt(queryData.children)+parseInt(queryData.infant),
      guest:{
        adult:parseInt(queryData.adult),
        children:parseInt(queryData.children),
        infant:parseInt(queryData.infant)
    }
     })
      if(queryData.location){
      let SelectedLocations=''
      let SelectedSlugs=queryData.location.trim().split(',')
        AllSearchLocations.forEach(element => {
            if(SelectedSlugs.includes(element['slug'])){
                element['selected']=true
                SelectedLocations=SelectedLocations+" "+element.name+','
            }
        });
        setAllSelectedLocations(SelectedLocations.slice(0, -1))
    }

    
  }, [queryData,AllSearchLocations ]);


  

   function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    const selectLocation=(location)=>{
      
       
      let SelectedLocations=''
      if(location=='all'){
        let allSelcted=0
      AllSearchLocations.forEach(element => {
            if(element['selected']){
                allSelcted++
            }
        });
        if(allSelcted== AllSearchLocations.length){
          AllSearchLocations.forEach(element => {
            element['selected'] = false;
            if(element['selected']){
                SelectedLocations=SelectedLocations+" "+element.name+','
            }
        });
        }else{
        AllSearchLocations.forEach(element => {
            element['selected'] = true;
            if(element['selected']){
                SelectedLocations=SelectedLocations+" "+element.name+','
            }
        });
      }
    }else{
        location['selected']=!location['selected']
        
        AllSearchLocations.forEach(element => {
            if(element['selected']){
                SelectedLocations=SelectedLocations+" "+element.name+','
            }
        });
      }
    
        setAllSelectedLocations(SelectedLocations.slice(0, -1))
        
    }
    const openModal= async (modalName)=>{
      setShowModal(modalName)
    }
    const clearSearch=()=>{
        let SelectedLocations=[]
        AllSearchLocations.forEach(element => {
            element['selected'] =false
            SelectedLocations.push(element)
            
        });

        setAllLocations(SelectedLocations)
        setAllSelectedLocations('')
        setSearchPayload({location:'',guestcount:0,guest:{adult:0,children:0,infant:0}})

    }
   

const updatePayload=(inputType,value)=>{
    setSearchPayload((prev) => ({
        ...prev,
        [inputType]:value
      }))
}

  const submitSearch=()=>{
    let SelectedLocations=''
    AllSearchLocations.forEach(element => {
        if(element['selected']){
            SelectedLocations=SelectedLocations+" "+element.slug+','
        }
    });
    if(SelectedLocations==''){
      AllSearchLocations.forEach(element => {
              SelectedLocations=SelectedLocations+" "+element.slug+','
         
      });
  }
    let locations = SelectedLocations.slice(0, -1).replaceAll(' ','');
    let adult= parseInt(searchPayload.guest.adult);
    let children= parseInt(searchPayload.guest.children);
    let infant= parseInt(searchPayload.guest.infant);
    let NewQueryData ={
      location:locations,
      adult:adult,
      children:children,
      infant:infant,
    }
    setSearchModal(false)
    updateSearchQuery(NewQueryData)
  }
  
  useEffect(() => {
    const handleOutSideClick = (event) => {
      if (!refLocation.current?.contains(event.target) && !refGuest.current?.contains(event.target)) {
            setShowModal(false)
      }
    };
    window.addEventListener("mousedown", handleOutSideClick);
    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [refLocation,refGuest]);

 
    
    if(isMobile){
        return (<section className='inner_section'>
            <div className={styles.searchboxMobile}>
                    <Image priorityalt="search"  width={20} height={20} src={'/assets/images/search-icon.png'} />
                    <Input onClick={(e)=>setSearchModal(true)} readOnly className={styles.searchinput} type="text" placeholder='Search'/>
                    <Image priority onClick={(e)=>showFilterModal()} alt="filter" className={styles.filterIcon}  width={53} height={53} src={'/assets/images/filter.png'} />
            </div>

            {searchModal &&<Modal classname={styles.modalwrapper} onClose={(e)=>setSearchModal(false)} isOpen={searchModal}>
            <Button
                aria-label='toggle menu'
                width={32}
                label={<CloseIcon variant="alert" />}
                className={styles.close}
                onClick={(e)=>setSearchModal(false)}
            />
            <div className={styles.content}>
            <div className={styles.searchbox}>
            <div className={styles.innnerwrapper}>
                <h2>Find Your Next Stay</h2>
                <p>Experience Life & Explore the Nature</p>
             <div className={styles.searchitme +' inneroptionList'} ref={refLocation} onClick={()=>openModal('LocationsModal')}  >
              <div className={styles.searchitmeInner}>
                <p className={styles.label}>Location</p>
                <p className={styles.searchinput}>{allSelectedLocations}</p>
              </div>
            {showModal=='LocationsModal' &&<LocationsModal locationLists={AllSearchLocations} selectLocation={selectLocation} />}
            </div>

            <div className={styles.searchitme+' inneroptionList'} ref={refGuest} onClick={(e)=>openModal('GuestsModal')} >
                    <div className={styles.searchitmeInner}>
                        <p className={styles.label}>Guests</p>
                        <p className={styles.searchinput}>{searchPayload.guestcount+' Guests'}</p>
                    </div>
                    {showModal=='GuestsModal' &&<GuestsModal guest={searchPayload.guest} updatePayload={updatePayload} />}
                   
            </div>

               

            <div className={styles.btn_section} >
                <p className={styles.clearAll} onClick={()=>clearSearch()}>Clear All</p> 
                <p className={styles.searchsubmit}  onClick={()=>submitSearch()}>Search</p>
            </div>
           
            
           
            
            </div>
        
            </div>
         </div>
           </Modal>}
         </section>)   
    }else{
    return (<section className='inner_section'>
        <div className={styles.searchbox}>
          
          <div className={styles.headingSection}>
            <div className={styles.valueSection} style={{margin:'0',background:'transparent'}}>
                
            <div className={styles.heading} style={{width:'50%',paddingLeft: '40px'}}>Where</div>
                <div className={styles.heading} style={{width:'50%',paddingLeft: '20px'}}>Guests</div>
                <div className={styles.heading} style={{width:'75px'}}></div>
                
            </div>
            
            <div className={styles.valueSection} style={{width:'10%',background:'#fff',marginLeft:'20px'}}>
            
            </div>
          </div>


          <div className={styles.valueSectionOuter}>
            <div className={styles.valueSection}>
                
                <div className={`${styles.noPadding} ${styles.itemRow}`} style={{width:'50%'}} ref={refLocation} >
                    <Input readOnly  onClick={(e)=>openModal('LocationsModal')} className={styles.searchLocation} type="text" placeholder='You Can Choose Multiple Options' name="location" value={allSelectedLocations}/>
                    {showModal=='LocationsModal' &&<LocationsModal locationLists={AllSearchLocations} selectLocation={selectLocation} />}
                </div>

                <div className={styles.itemRow} style={{width:'50%',paddingLeft: '20px' }} ref={refGuest} onClick={(e)=>openModal('GuestsModal')} >
                    <div className={styles.itemCol} style={{paddingRight: '10px'}}>
                    <p className={styles.heading}>Adults</p>
                    <p style={{margin:'0px'}}>{searchPayload.guest.adult}</p>
                    </div>

                    <div className={styles.itemCol} style={{paddingRight: '10px'}}>
                    <p className={styles.heading}>Children</p>
                    <p style={{margin:'0px'}}>{searchPayload.guest.children}</p>
                    </div>

                    <div className={styles.itemCol} style={{paddingRight: '10px'}}>
                    <p className={styles.heading}>Infants</p>
                    <p style={{margin:'0px'}}>{searchPayload.guest.infant}</p>
                    </div>
                    {showModal=='GuestsModal' &&<GuestsModal guest={searchPayload.guest} updatePayload={updatePayload} />}
            

                </div>

                <div className={`${styles.noPadding} ${styles.itemRow}`}>
                
                    <p className={styles.searchLense}  onClick={()=>submitSearch()}>
                       <Image priority alt="Insta Farms"  width={20} height={20} src="/assets/images/search_lense.webp" />
                    </p>
                    
                </div>
                
            </div>
            
            <div className={styles.valueSection} style={{width:'10%',background:'#fff',marginLeft:'20px'}}>
            <div className={styles.searchFilter} onClick={(e)=>showFilterModal()}>
                    <Image priority alt="Insta Farms"  width={40} height={40} src="/assets/images/filter_icon.webp" /> 
                    <span>Filters</span>
            </div>
            </div>
          </div>
        </div>
        </section>

        
    )
    }
}


export default DesktopSearchBox
