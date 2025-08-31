import { useState,useEffect } from "react";
import styles from './DateRanger.module.scss'
const Calendar = ({propertyItem,selected,selectedChange}) => {
  const bookedDates = propertyItem.bookedDates?propertyItem.bookedDates:[]
  const today = new Date();
  const previousDay = new Date(today);
  previousDay.setDate(today.getDate() - 1);

  const previousCalendarDate = `${previousDay.getFullYear()}-${(previousDay.getMonth() + 1).toString().padStart(2, "0")}-${previousDay.getDate().toString().padStart(2, "0")}`;
  
  const allBlockedDates = getAllBlockedDates(bookedDates);
  const checkInBlockedDates= getCheckInBlockedDates(bookedDates);
  const excludeDates = allBlockedDates.map(date => formatDate(date))
  const excludeCheckInDates =checkInBlockedDates.map(date => formatDate(date))
  excludeDates.unshift(previousCalendarDate)
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [currentMonth, setCurrentMonth] = useState(selected.end?new Date(new Date(selected.end.year+'/'+selected.end.month+'/'+selected.end.day)).getMonth():new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(selected.end?new Date(new Date(selected.end.year+'/'+selected.end.month+'/'+selected.end.day)).getFullYear():new Date().getFullYear());

  

  const daysList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  useEffect(() => {
     if(startDate && endDate){
      if(hasOverlap(startDate ,endDate)){
        setStartDate(null);
        setEndDate(null);
        selectedChange({start:null,end:null})
      }else{
        let startDateStr = new Date(startDate)
        let endDateStr = new Date(endDate)
        if(startDateStr<previousDay || endDateStr< previousDay){
          setStartDate(null);
          setEndDate(null);
        }else{
        let start = {year:startDateStr.getFullYear(),month:startDateStr.getMonth()+1,day:startDateStr.getDate()}
        let end = {year:endDateStr.getFullYear(),month:endDateStr.getMonth()+1,day:endDateStr.getDate()}
        selectedChange({start:start,end:end})
        }

       
        }
      
    }
  }, [startDate,endDate])


  
    function getAllBlockedDates(dates) {
      const dateSet = new Set(dates); // Fast lookup
      const result = dates.filter(dateStr => {
        const date = new Date(dateStr);
        date.setUTCDate(date.getUTCDate() - 1); // Subtract 1 day
        const prevDateStr = date.toISOString().slice(0, 10); // Get YYYY-MM-DD
        return dateSet.has(prevDateStr); // Keep only if previous day exists
      });
      return result
  }
  
  function getCheckInBlockedDates(dates) {
    const dateSet = new Set(dates); // Convert array to Set for fast lookup
    return dates.filter(dateStr => {
        const date = new Date(dateStr);
        date.setUTCDate(date.getUTCDate() - 1); // Subtract 1 day
        return !dateSet.has(date.toISOString()); // Keep only if previous day exists
    });
  }

  function generateDateRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);
  
    while (currentDate <= endDate) {
      dates.push(formatDate(currentDate));
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }
  
    return dates;
  }
  function formatDate(date) {
    let d =new Date(date)
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  function hasOverlap(newStartDate, newEndDate) {
    const bookingRange = generateDateRange(new Date(newStartDate), new Date(newEndDate));
    let newRangeTest = bookingRange.length > 0 ? bookingRange.slice(0, -1) : [];
    let blockedDates = [...excludeDates, ...excludeCheckInDates];
    return newRangeTest.some(date => blockedDates.includes(date));
  }
  
  const isValidStartDate=(startDate)=>{
    let startDateStr = new Date(startDate)
    let calendarDate = `${startDateStr.getFullYear()}-${(startDateStr.getMonth() + 1).toString().padStart(2, "0")}-${startDateStr.getDate().toString().padStart(2, "0")}`;
   if(excludeCheckInDates.includes(calendarDate.toString())){
    return false
   }else{
    return true
   }
  }
  const handleDateClick = (date) => {
    if (!startDate || (startDate && endDate)) {
        if(isValidStartDate(date)){
            setStartDate(date);
            setEndDate(null);
        }
      
    } else if (date < startDate) {
        if(isValidStartDate(date)){
            setStartDate(date);
            setEndDate(null);
        }
    } else {
      setEndDate(date);
    }
  };

  const renderCalendarDates = (calMonth) => {
    const firstDay = (new Date(currentYear, calMonth, 1).getDay() + 6) % 7; // Shift Sunday (0) to the end
    const daysInMonth = new Date(currentYear, calMonth + 1, 0).getDate();

    const dates = [];
    const lastDay = new Date(currentYear, calMonth, 0); 
    for (let i = firstDay-1; i >=0; i--) {
        const pevMdate = new Date(lastDay);
        pevMdate.setDate(lastDay.getDate() - i);
        const DayPrev = new Date(pevMdate);
        DayPrev.setDate(pevMdate.getDate() - 1);
        const DayNext = new Date(pevMdate);
        DayNext.setDate(pevMdate.getDate() + 1);
        

        let start = startDate
      if(!start && selected){
       start = new Date(`${selected.start.year}/${selected.start.month}/${selected.start.day}`);
      }
      let end = endDate
      if(!end && selected){
       end = new Date(`${selected.end.year}/${selected.end.month}/${selected.end.day}`);
      }

      const isSelected =
      (start && pevMdate.toDateString() === start.toDateString()) ||
      (end && pevMdate.toDateString() === end.toDateString()) ||
      (new Date(selected.start).toDateString() === pevMdate.toDateString())||
      (new Date(selected.end).toDateString() === pevMdate.toDateString());
        const isInRange =
        start &&
        end &&
        pevMdate > start &&
        pevMdate < end;
        
        const calendarDate = `${pevMdate.getFullYear()}-${(pevMdate.getMonth() + 1).toString().padStart(2, "0")}-${pevMdate.getDate().toString().padStart(2, "0")}`;
        const halfDisable = excludeCheckInDates.includes(calendarDate.toString())
        const calendarPrevDate = `${DayPrev.getFullYear()}-${(DayPrev.getMonth() + 1).toString().padStart(2, "0")}-${DayPrev.getDate().toString().padStart(2, "0")}`;
        const calendarNextDate = `${DayNext.getFullYear()}-${(DayNext.getMonth() + 1).toString().padStart(2, "0")}-${DayNext.getDate().toString().padStart(2, "0")}`;
        const isDisable = (excludeDates.includes(calendarPrevDate.toString()) && excludeDates.includes(calendarNextDate.toString())) ||pevMdate < previousDay || excludeDates.includes(calendarDate.toString())
        
        dates.push(<div
           key={`blank-${i}`} 
           onClick={() => {
            if(!isDisable){
              handleDateClick(pevMdate)
            }
          }}
          className={`${styles.calendardate} 
          ${
            !isDisable && isSelected ? styles.selected : ""
          } ${
            isInRange ? styles.inrange : ""
          } ${
            !isDisable ? halfDisable ? styles.halfDisable : "":""
          } ${
            isDisable ? styles.disabled : ""
          } 
          `}
          disabled={isDisable}
        ><p>{pevMdate.getDate()}</p><span>{getDayPrice(pevMdate)}</span></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const DayPrev = new Date(date);
      DayPrev.setDate(date.getDate() - 1);
      const DayNext = new Date(date);
      DayNext.setDate(date.getDate() + 1);

      let start = startDate
      if(!start && selected){
       start = new Date(`${selected.start.year}/${selected.start.month}/${selected.start.day}`);
      }
      let end = endDate
      if(!end && selected){
       end = new Date(`${selected.end.year}/${selected.end.month}/${selected.end.day}`);
      }
      const isSelected =
      (start && date.toDateString() === start.toDateString()) ||
      (end && date.toDateString() === end.toDateString()) ||
      (new Date(selected.start).toDateString() === date.toDateString())||
      (new Date(selected.end).toDateString() === date.toDateString());
    
    
      
        const isInRange =
        start &&
        end &&
        date > start &&
        date < end;
        
        const calendarDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
        const calendarPrevDate = `${DayPrev.getFullYear()}-${(DayPrev.getMonth() + 1).toString().padStart(2, "0")}-${DayPrev.getDate().toString().padStart(2, "0")}`;
        const calendarNextDate = `${DayNext.getFullYear()}-${(DayNext.getMonth() + 1).toString().padStart(2, "0")}-${DayNext.getDate().toString().padStart(2, "0")}`;
        
        const halfDisable = excludeCheckInDates.includes(calendarDate.toString())
        const isDisable = (excludeDates.includes(calendarPrevDate.toString()) && excludeDates.includes(calendarNextDate.toString())) || date < previousDay || excludeDates.includes(calendarDate.toString())
        dates.push(
        <div
          key={day}
          onClick={() => {
            if(!isDisable){
              handleDateClick(date)
            }
          }}
          className={`
            ${styles.calendardate} 
            ${
              !isDisable && isSelected ? styles.selected : ""
            } ${
            isInRange ? styles.inrange : ""
          } ${
            !isDisable && halfDisable ? styles.halfDisable : ""
          } ${
            isDisable ? styles.disabled : ""
          }
          `}
          disabled={isDisable}
          
        >
          <p>{day}</p>
          <span>{getDayPrice(date)}</span>
        </div>
      );
    }

    return dates;
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((year) => year - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((year) => year + 1);
        return 0;
      }
      return prev + 1;
    });
  };


  const getDayPrice=(dateName) =>{
    let date = new Date(dateName)
    let dateStr = formatDate(date)
    const dayName = daysList[date.getDay()]
    let price ='0.00'
    if(propertyItem.price_detail && propertyItem.price_detail.weekPrice){
    let specialDates = propertyItem.price_detail.datePrice?propertyItem.price_detail.datePrice:''
    let weekPrice = propertyItem.price_detail.weekPrice
    weekPrice.forEach(week=>{
      if(week.day==dayName){
        price= week.price
      }
      if(specialDates && specialDates.length>0){
        const specialDate = specialDates.find(item => item.date === dateStr);
        if(specialDate && specialDate.price){
          price= specialDate.price
        }
      }
    })
    }
    return formatCurrency(price, "INR", "en-IN")
      
  }

  const formatCurrency = (num, currency = "INR") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      notation: "compact",
      compactDisplay: "short",
    }).format(num);
  };

  
 


  return (
    <div className={styles.calendar}>
      <div className={styles.calendarheader}>
        <span className={styles.button} onClick={handlePrevMonth}>Prev</span>
        <span>
          {monthNames[currentMonth]} {currentYear}
        </span>
        <span className={styles.button} onClick={handleNextMonth}>Next</span>
      </div>
      <div className={styles.calendardays}>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className={styles.calendarday}>
            {day}
          </div>
        ))}
      </div>
      <div className={styles.calendardates}>
        {renderCalendarDates(currentMonth)}
        </div>
     
    </div>
  );
};

export default Calendar;
