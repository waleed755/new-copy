export const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            getAddressFromCoordinates(position.coords.latitude, position.coords.longitude); // Replace these coordinates with your own
            setLat(position.coords.latitude);
            setLong(position.coords.longitude);
            console.log('Latitude:', position.coords.latitude, 'Longitude:', position.coords.longitude);
        }, 
        (error) => {
            console.error('Error Code = ' + error.code + ' - ' + error.message);
        }
    );
}
