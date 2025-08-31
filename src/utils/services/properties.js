

function Properties() {

    async function getBookingByPropertyId(itemId) {
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/booking/by-property/` + itemId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            return await res.json()
        } catch (error) {
            console.error('Error fetching booking by property ID:', error);
            return {
                success: false,
                message: 'Failed to fetch booking',
                error: error.message
            };
        }
    }
    async function getAll() {
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/properties/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Legacy-API': 'true'  // Add this header to ensure legacy mapping
                }
            })

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            return await res.json()
        } catch (error) {
            console.error('Error fetching all properties:', error);
            return {
                success: false,
                message: 'Failed to fetch properties',
                error: error.message
            };
        }
    }

    async function getAllByOwner(ownerPhone) {
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/properties/byOwner/${ownerPhone}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            return await res.json()
        } catch (error) {
            console.error('Error fetching properties by owner:', error);
            return {
                success: false,
                message: 'Failed to fetch properties by owner',
                error: error.message
            };
        }
    }


    async function getCouponCode(couponCode) {
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/coupons/validate/${couponCode}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            return await res.json()
        } catch (error) {
            console.error('Error validating coupon code:', error);
            return {
                success: false,
                message: 'Failed to validate coupon code',
                error: error.message
            };
        }
    }


    async function getAllList() {

        let payload = {
            pageNumber: 1,
            totalPages: 0,
            LastDocument: false,
            moveTo: false,
            orderBy: 'weight',
            searchBy: '',
            searchKey: '',
            status: 1,
            attributes: "plans,property_code_name,name,slug,max_guest_count,address_details,price_detail,caretaker,featured_image,type,bedroom_count,rooms,code_name,meta_title,meta_url,check_in_time,check_out_time,bathroom_count,amenities,faqs,meta_url,meta_description,manager"
        }

        try {
            const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/properties/paginate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            return await res.json()
        } catch (error) {
            console.error('Error fetching all properties list:', error);
            return {
                success: false,
                message: 'Failed to fetch properties list',
                error: error.message
            };
        }
    }
    async function searchProperties(payload) {
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/properties/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            return await res.json()
        } catch (error) {
            console.error('Error searching properties:', error);
            return {
                success: false,
                message: 'Failed to search properties',
                error: error.message
            };
        }
    }
    async function getNearByProperties(slug) {
        let searchKeyValue = 'telangana-hyderabad'
        let searchByValue = 'address_details.city_slug';
        if (slug) {
            searchKeyValue = slug
        }
        let payload = {
            pageNumber: 1,
            totalPages: 0,
            LastDocument: false,
            moveTo: false,
            perPage: 6,
            orderBy: 'weight',
            searchBy: searchByValue,
            searchKey: searchKeyValue,
            status: 1,
            attributes: "plans,property_code_name,name,slug,max_guest_count,address_details,price_detail,caretaker,featured_image,type,bathroom_count,bedroom_count,rooms"

        }

        try {
            const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/properties/paginate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            return await res.json()
        } catch (error) {
            console.error('Error fetching nearby properties:', error);
            return {
                success: false,
                message: 'Failed to fetch nearby properties',
                error: error.message
            };
        }
    }

    async function getLatestProperties(slug) {
        let searchKeyValue = 'telangana-hyderabad'
        let searchByValue = 'address_details.city_slug';
        if (slug) {
            searchKeyValue = slug
        }
        let payload = {
            pageNumber: 1,
            totalPages: 0,
            LastDocument: false,
            moveTo: false,
            perPage: 6,
            orderBy: 'created_at',
            searchBy: searchByValue,
            searchKey: searchKeyValue,
            status: 1,
            attributes: "plans,property_code_name,name,slug,max_guest_count,address_details,price_detail,caretaker,featured_image,type,bathroom_count,bedroom_count,rooms"

        }

        try {
            const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/properties/paginate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            return await res.json()
        } catch (error) {
            console.error('Error fetching latest properties:', error);
            return {
                success: false,
                message: 'Failed to fetch latest properties',
                error: error.message
            };
        }
    }

    async function getAllProperties(payload) {
        payload['status'] = 1

        try {
            const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/properties/paginate/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json()
            return data
        } catch (error) {
            console.error('Error fetching properties:', error);
            return {
                success: false,
                message: 'Failed to fetch properties',
                error: error.message
            };
        }
    }

    async function getById(docymentId) {
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/properties/${docymentId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Legacy-API': 'true'  // Add this header to ensure legacy mapping
                }
            })

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json()
            return data
        } catch (error) {
            console.error('Error fetching property by ID:', error);
            return {
                success: false,
                message: 'Failed to fetch property',
                error: error.message
            };
        }
    }

    async function createBooking(payload) {
        try {
            console.log('=== createBooking API Debug ===');
            const token = localStorage.getItem('token')
            console.log('Token:', token ? 'Present' : 'Missing');
            console.log('API URL:', process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/booking/createorder`);
            console.log('Payload being sent:', payload);
            
            const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/booking/createorder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            })

            console.log('Response status:', res.status);
            console.log('Response ok:', res.ok);

            if (!res.ok) {
                const errorText = await res.text();
                console.error('HTTP error response:', errorText);
                throw new Error(`HTTP error! status: ${res.status}, response: ${errorText}`);
            }

            const responseData = await res.json();
            console.log('Response data:', responseData);
            return responseData;
        } catch (error) {
            console.error('Error creating booking:', error);
            return {
                success: false,
                message: 'Failed to create booking: ' + error.message,
                error: error.message
            };
        }
    }

    async function updateBooking(payload) {
        try {
            console.log('=== updateBooking API Debug ===');
            const token = localStorage.getItem('token')
            console.log('Token:', token ? 'Present' : 'Missing');
            console.log('API URL:', process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/booking/updatebooking`);
            console.log('Payload:', payload);
            
            const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/booking/updatebooking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            })

            console.log('Response status:', res.status);
            console.log('Response ok:', res.ok);

            if (!res.ok) {
                const errorText = await res.text();
                console.error('HTTP error response:', errorText);
                throw new Error(`HTTP error! status: ${res.status}, response: ${errorText}`);
            }

            const responseData = await res.json();
            console.log('Response data:', responseData);
            return responseData;
        } catch (error) {
            console.error('Error updating booking:', error);
            return {
                success: false,
                message: 'Failed to update booking: ' + error.message,
                error: error.message
            };
        }
    }

    async function cancelBookingApi(bookingId) {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/booking/cancelBooking/${bookingId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            return await res.json()
        } catch (error) {
            console.error('Error canceling booking:', error);
            return {
                success: false,
                message: 'Failed to cancel booking',
                error: error.message
            };
        }
    }
    async function deleteBookingApi(bookingId) {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/booking/deleteBooking/${bookingId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            return await res.json()
        } catch (error) {
            console.error('Error deleting booking:', error);
            return {
                success: false,
                message: 'Failed to delete booking',
                error: error.message
            };
        }
    }

    async function deletePendingBookingApi(bookingId) {
        if (bookingId) {
            try {
                const token = localStorage.getItem('token')
                const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/booking/deletePendingBooking/${bookingId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                return await res.json()
            } catch (error) {
                console.error('Error deleting pending booking:', error);
                return {
                    success: false,
                    message: 'Failed to delete pending booking',
                    error: error.message
                };
            }
        } else {
            return true
        }
    }


    async function postReview(payload) {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/reviews/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            return await res.json()
        } catch (error) {
            console.error('Error posting review:', error);
            return {
                success: false,
                message: 'Failed to post review',
                error: error.message
            };
        }
    }


    return {
        getAllByOwner, getCouponCode, postReview, deletePendingBookingApi, deleteBookingApi, cancelBookingApi, createBooking, updateBooking, getAllList, searchProperties, getBookingByPropertyId, getAllProperties, getNearByProperties, getLatestProperties, getAll, getById
    }
}

export default Properties
