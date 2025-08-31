//import { axiosInstance } from 'network/apis'

import properties from './properties'
import locations from './locations'
import collections from './collections'
import contact from './contact'
import cms from './cms'
import carousel from './carousel'
import extraplans from './extraplans'
import amenities from './amenities'
import auth from './auth'
import enquiry from './enquiry'
import bookings from './bookings'
import settings from './settings'
import metadata from './metadata'
import faqs from './faqs'
import enquiryTrackingService from './enquiryTracking'

const POSTS = `/posts`
const getPosts = () => {
    return axios.get(POSTS)
}

const propertiesServices = properties()
const locationsSerivces = locations()
const collectionsSerivces = collections()
const contactServices = contact()
const cmsServices = cms()
const carouselServices = carousel()
const extraPlansServices = extraplans()
const amenitiesServices = amenities()
const authServices = auth()
const enquiryServices = enquiry()
const bookingsServices = bookings()
const settingsServices = settings()
const metadataServices = metadata()
const faqServices = faqs()
export { settingsServices, bookingsServices, enquiryServices, authServices, amenitiesServices, getPosts, propertiesServices, locationsSerivces, collectionsSerivces, contactServices, cmsServices, carouselServices, extraPlansServices, metadataServices, faqServices, enquiryTrackingService }
