function getPropertyPrice(payload) {
  let propertyItem = payload.propertyItem
  let daysPrice=[]
  let bookingDays=0
 
  let PriceBreakDown={}
  
  let startdate = payload.startdate;
  let enddate = payload.enddate;

  let adultCount =Number(payload.adult)
  let childrenCount =Number(payload.children)
  let allGuestCount = Number(payload.adult)+Number(payload.children)+Number(payload.infant)
  let guestCount = Number(payload.adult)+Number(payload.children)
 
  // If no dates provided (search results), return basic price structure
  if(!startdate || !enddate) {
    let basePrice = 0;
    if(propertyItem.price_detail && propertyItem.price_detail.weekPrice && propertyItem.price_detail.weekPrice.length > 0) {
      // Use the first available price as base price
      basePrice = propertyItem.price_detail.weekPrice[0].price || 0;
    }
    
    let oneDayPrice = basePrice;
    let oneDayDiscount = 0;
    let oneDayPriceAfterDiscount = basePrice;
    
    if(propertyItem.price_detail && propertyItem.price_detail.weekPrice && propertyItem.price_detail.weekPrice[0]) {
      oneDayDiscount = (Number(propertyItem.price_detail.weekPrice[0].owner_discount) || 0) + (Number(propertyItem.price_detail.instafarms_discount_percentage) || 0);
      oneDayPriceAfterDiscount = oneDayPrice * (1 - oneDayDiscount / 100);
    }
    
    return {
      allGuestCount: allGuestCount,
      bookingAmount: oneDayPriceAfterDiscount,
      bookingDays: 1,
      PriceBreakDown: {
        totalDaysPrice: basePrice,
        totalExtraPrice: 0,
        totalPriceOrigional: basePrice,
        totalDiscount: basePrice - oneDayPriceAfterDiscount,
        couponDiscount: 0,
        nightsDiscountsFee: 0,
        nightsDiscountsFeePer: 0
      },
      oneDayPrice: oneDayPrice,
      oneDayPriceAfterDiscount: oneDayPriceAfterDiscount,
      daysPrice: [{
        day: 'base',
        price: basePrice,
        extraGuest: 0,
        extraGuestPrice: 0,
        extraGuestAdults: 0,
        extraGuestPriceAdults: 0,
        extraGuestChild: 0,
        extraGuestPriceChild: 0,
        ownerDiscount: 0,
        instafarmsDiscount: propertyItem.price_detail?.instafarms_discount_percentage || 0
      }]
    };
  }

  if(startdate && propertyItem.price_detail && propertyItem.price_detail.weekPrice){
    bookingDays = datediff(new Date(startdate), new Date(enddate));
    let daysList = getAllDates(startdate,enddate)
    let dayPriceDetail = propertyItem.price_detail.weekPrice
    
    let specialDates = propertyItem.price_detail.datePrice?propertyItem.price_detail.datePrice:''
    daysList.forEach(itemName => {
      let itemPrice = 0
      let extraGuest=0
      let extraGuestPrice=0
      let extraGuestAdults=0
      let extraGuestPriceAdults=0
      let extraGuestChild=0
      let extraGuestPriceChild=0
      let ownerDiscount=0
      dayPriceDetail.forEach(dayDetail => {
        if(dayDetail.day == itemName.day){
          itemPrice =  dayDetail.price
          ownerDiscount = Number(dayDetail.owner_discount) || 0
            let dayBaseGuestCount =Number(dayDetail.base_guest_count)
            if(guestCount > dayBaseGuestCount){
              extraGuest = guestCount - dayBaseGuestCount
              //let extraAdult = adultCount>dayBaseGuestCount?extraGuest:0
              let extraAdult = adultCount - dayBaseGuestCount;
              extraAdult = extraAdult > 0 ? extraAdult : 0;
              extraGuestAdults=extraAdult
              //let extraChild = childrenCount>dayBaseGuestCount?0:extraGuest

              
              
              if(extraAdult > 0){
                extraGuestPriceAdults = dayDetail.extra_guest_price_adult?Number(dayDetail.extra_guest_price_adult):0
              }
              let extraChild = extraGuest - extraAdult;
              extraChild = extraChild > 0 ? extraChild : 0;
              extraGuestChild=extraChild
              
              if(extraChild > 0){
                extraGuestPriceChild = dayDetail.extra_guest_price_child?Number(dayDetail.extra_guest_price_child):0
              }
            }

        }
        
        if(specialDates && specialDates.length>0){
          const specialDate = specialDates.find(item => item.date === itemName.date);
          if(specialDate && specialDate.price){
            itemPrice= specialDate.price
            ownerDiscount = Number(dayDetail.owner_discount) || 0
            let dayBaseGuestCount =Number(specialDate.base_guest_count)
            if(guestCount > dayBaseGuestCount){
              extraGuest = guestCount - dayBaseGuestCount
              let extraAdult = adultCount - dayBaseGuestCount;
              extraAdult = extraAdult > 0 ? extraAdult : 0;
              extraGuestAdults=extraAdult


              let extraChild = extraGuest - extraAdult;
              extraChild = extraChild > 0 ? extraChild : 0;
              extraGuestChild=extraChild

              if(extraAdult > 0){
                extraGuestPriceAdults = dayDetail.extra_guest_price_adult?Number(dayDetail.extra_guest_price_adult):0
              }
              if(extraChild > 0){
                extraGuestPriceChild = dayDetail.extra_guest_price_child?Number(dayDetail.extra_guest_price_child):0
              }
            }
          }
        }
       
      })
      daysPrice.push({
        day:itemName.day,
        price:itemPrice,
        extraGuest:extraGuest,
        extraGuestPrice:extraGuestPrice,
        extraGuestAdults:extraGuestAdults,
        extraGuestPriceAdults:extraGuestPriceAdults,
        extraGuestChild:extraGuestChild,
        extraGuestPriceChild:extraGuestPriceChild,
        ownerDiscount:ownerDiscount,
        instafarmsDiscount:(propertyItem.price_detail && propertyItem.price_detail.instafarms_discount_percentage)?propertyItem.price_detail.instafarms_discount_percentage:0
      })
      
    });
  }
  
  let totalPriceOrigional =0
  let totalExtraPrice =0
  let totalDaysPrice =0
  let totalDiscount =0
  daysPrice.forEach(dayPrice => {
    
    totalDaysPrice=totalDaysPrice+(Number(dayPrice.price) || 0)
    let extraPrice = (Number(dayPrice.extraGuestAdults) || 0) * (Number(dayPrice.extraGuestPriceAdults) || 0);
    extraPrice = extraPrice+(Number(dayPrice.extraGuestChild) || 0) * (Number(dayPrice.extraGuestPriceChild) || 0);
    let basePrice = (Number(dayPrice.price) || 0) +extraPrice;
    let baseDiscount = (parseFloat(dayPrice.ownerDiscount) || 0) + 
                   (parseFloat((propertyItem.price_detail && propertyItem.price_detail.instafarms_discount_percentage) ? propertyItem.price_detail.instafarms_discount_percentage : 0) || 0);
    let dayDiscount =basePrice-(basePrice * (1 - baseDiscount / 100));
    totalDiscount=totalDiscount+Number(dayDiscount)
    totalExtraPrice = totalExtraPrice+Number(extraPrice)
    totalPriceOrigional = totalPriceOrigional+basePrice
  })
  PriceBreakDown['totalDaysPrice']=totalDaysPrice
  PriceBreakDown['totalExtraPrice']=totalExtraPrice
  PriceBreakDown['totalPriceOrigional']=totalPriceOrigional
  PriceBreakDown['totalDiscount']=totalDiscount

  

let couponDiscount=0
if(payload.coupon && payload.coupon.id){
  if(payload.coupon.coupon_type=='Fixed'){
    couponDiscount =payload.coupon.value
  }else{
    couponDiscount=(totalPriceOrigional/100)*payload.coupon.value
  }
  PriceBreakDown['coupon']=payload.coupon
}
PriceBreakDown['couponDiscount']=couponDiscount

let DiscountsPlansDetail = getDiscountsPlansDetail(propertyItem)

let discounts = DiscountsPlansDetail.discounts?DiscountsPlansDetail.discounts:[]
let nightsDiscounts =0
discounts.forEach(item=>{
  if(bookingDays>=item.nights){
    nightsDiscounts = item.discount
  }
})

let nightsDiscountsFee = (totalPriceOrigional/100)*nightsDiscounts
PriceBreakDown['nightsDiscountsFee']=nightsDiscountsFee
PriceBreakDown['nightsDiscountsFeePer']=nightsDiscounts

let AllDiscount = Number(totalDiscount)+Number(couponDiscount)+Number(nightsDiscountsFee)
let bookingAmount = totalPriceOrigional-AllDiscount

let oneDayPrice = 0;
let oneDayDiscount = 0;
let oneDayPriceAfterDiscount = 0;

if (propertyItem.price_detail && propertyItem.price_detail.weekPrice && propertyItem.price_detail.weekPrice[0]) {
  oneDayPrice = propertyItem.price_detail.weekPrice[0].price || 0;
  oneDayDiscount = (Number(propertyItem.price_detail.weekPrice[0].owner_discount) || 0) + (Number(propertyItem.price_detail.instafarms_discount_percentage) || 0);
  oneDayPriceAfterDiscount = oneDayPrice * (1 - oneDayDiscount / 100);
}



return {
  allGuestCount:allGuestCount,
  bookingAmount:bookingAmount,
  bookingDays:bookingDays,
  PriceBreakDown:PriceBreakDown,
  oneDayPrice:oneDayPrice,
  oneDayPriceAfterDiscount:oneDayPriceAfterDiscount,
  daysPrice:daysPrice
  }

}
  function getDiscountsPlansDetail(propertyItem){
    if(propertyItem.plans && propertyItem.plans.discount_plan){
      return propertyItem.plans.discount_plan
    }else{
      return [];
    }
  }

  function datediff(first, second) {        
    return Math.ceil((second - first) / (1000 * 60 * 60 * 24));
  }
  function formatDate(date) {
    let d =new Date(date)
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const getAllDates=(start, end)=> {
      const daysList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const datesArray = [];
      for(const dt=new Date(start); dt<new Date(end); dt.setDate(dt.getDate()+1)){
        let dateStr = new Date(dt)
        datesArray.push({day:daysList[dateStr.getDay()],date:formatDate(dateStr)});
      }
    return datesArray;
   
  }
  

export default getPropertyPrice