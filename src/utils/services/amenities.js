function Amenities() {
   
    
    async function getAll() {
        // console.log('🔍 Fetching both amenities and activities...');
        
        try {
            // Fetch amenities
            // console.log('🔍 Fetching amenities from:', process.env.NEXT_PUBLIC_DEV_BASE_URL+`/api/amenities?type=amenities`);
            const amenitiesRes = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL+`/api/amenities?type=amenities`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const amenitiesData = await amenitiesRes.json();
            // console.log('🏠 Raw amenities response:', amenitiesData);
            
            // Fetch activities
            // console.log('🔍 Fetching activities from:', process.env.NEXT_PUBLIC_DEV_BASE_URL+`/api/amenities?type=activities`);
            const activitiesRes = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL+`/api/amenities?type=activities`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const activitiesData = await activitiesRes.json();
            // console.log('🎯 Raw activities response:', activitiesData);
            
            // Process amenities
            const amenitiesList = amenitiesData?.data || [];
            const amenitiesWithType = amenitiesList.map(item => ({
                ...item,
                type: 'amenities'
            }));
            // console.log('🏠 Processed amenities count:', amenitiesWithType.length);
            
            // Process activities
            const activitiesList = activitiesData?.data || [];
            const activitiesWithType = activitiesList.map(item => ({
                ...item,
                type: 'activities'
            }));
            // console.log('🎯 Processed activities count:', activitiesWithType.length);
            
            // Combine both
            const combined = [...amenitiesWithType, ...activitiesWithType];
            // console.log('✅ Combined amenities + activities count:', combined.length);
            // console.log('✅ Sample combined item:', combined[0]);
            
            return combined;
            
        } catch (error) {
            console.error('❌ Error fetching amenities/activities:', error);
            return [];
        }
    }
    return { getAll}
}


export default Amenities
