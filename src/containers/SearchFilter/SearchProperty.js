import { Input } from '@mui/material';
import { useEffect, useState } from 'react';
import styles from './index.module.scss';

function SearchProperty({ searchReset, dataList }) {
  const [searchKey, setSearchKey] = useState('');
  const [allData, setAllData] = useState('');

  useEffect(() => {
    setAllData(dataList)
  }, [dataList])


  const updatePropSearhKey = (value) => {

    setSearchKey(value)
    if (value.length > 1) {
      let searchResponse = []
      for (var i = 0; i < allData.length; i++) {

        if (allData[i]['code_name'].substr(0, value.length).toUpperCase() == value.toUpperCase()) {
          searchResponse.push(allData[i])
        } else if (allData[i]['property_code_name'].substr(0, value.length).toUpperCase() == value.toUpperCase()) {
          searchResponse.push(allData[i])
        } else if (allData[i]['name'].substr(0, value.length).toUpperCase() == value.toUpperCase()) {
          searchResponse.push(allData[i])
        } else if (allData[i]['address_details'] && allData[i]['address_details']['area_name'] && allData[i]['address_details']['area_name'].substr(0, value.length).toUpperCase() == value.toUpperCase()) {
          searchResponse.push(allData[i])
        } else if (allData[i]['address_details'] && allData[i]['address_details']['city_name'] && allData[i]['address_details']['city_name'].substr(0, value.length).toUpperCase() == value.toUpperCase()) {
          searchResponse.push(allData[i])
        }
      }
      searchReset(searchResponse)
    } else {
      searchReset(allData)
    }

  }
  return (
    <div className={styles.serchBox}>
      <Input placeholder="Search..." className={styles.textInput} onChange={(e) => updatePropSearhKey(e.target.value)} />
    </div>


  )
}


export default SearchProperty
