import { useState } from 'react';
import { 
  Compass, Navigation, Car, AlertTriangle, CheckCircle, 
  Map, ExternalLink, ShieldCheck, Building, Landmark
} from 'lucide-react';

export default function Location() {
  // Plot coordinates: Kaithi Toll Plaza & Markandeya Mahadev Corridor, Bhandaha Kalan, Varanasi
  // Approx: Lat 25.4888, Lon 83.1782
  const PLOT_COORDS = { lat: 25.4888, lon: 83.1782 };

  const [liveDistance, setLiveDistance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const landmarks = [
    { name: 'Kaithi NHAI Toll Plaza', distance: '0.5 KM', duration: '1 Min', type: 'Highway Access' },
    { name: 'Markandeya Mahadev Mandir (Sangam)', distance: '1.5 KM', duration: '3 Mins', type: 'Spiritual Heritage' },
    { name: 'Ishwar Chand Vidya Public School', distance: 'Adjacent', duration: '0 Mins', type: 'Education' },
    { name: 'Swarved Mahamandir (Umaraha)', distance: '16 KM', duration: '18 Mins', type: 'Spiritual Center' },
    { name: 'Ring Road Phase 2 Connectivity', distance: '12 KM', duration: '14 Mins', type: 'Expressway' },
    { name: 'Varanasi Junction (Cantt Station)', distance: '28 KM', duration: '35 Mins', type: 'Transit Hub' },
    { name: 'Lal Bahadur Shastri Airport (Babatpur)', distance: '42 KM', duration: '50 Mins', type: 'Airport' },
    { name: 'Ghazipur City Boundary', distance: '42 KM', duration: '45 Mins', type: 'Highway Corridor' },
  ];

  // Haversine formula to calculate distance in KM
  const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in KM
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in KM
  };

  const getLiveLocation = () => {
    setLoading(true);
    setError(null);
    setLiveDistance(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        
        const distance = calculateHaversineDistance(userLat, userLon, PLOT_COORDS.lat, PLOT_COORDS.lon);
        
        // Approximate driving speed 40km/h
        const estMinutes = Math.round((distance / 40) * 60);
        let durationText = `${estMinutes} Mins`;
        if (estMinutes > 120) {
          durationText = `${Math.round(estMinutes / 60)} Hours`;
        }

        setLiveDistance({
          km: distance.toFixed(2),
          duration: durationText,
          lat: userLat.toFixed(4),
          lon: userLon.toFixed(4)
        });
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Unable to retrieve GPS location. Please allow location permissions in your browser.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="page-shell pt-24 space-y-16 pb-16">
      
      {/* Title banner */}
      <section className="page-hero py-20">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-dark/80 via-brand-navy/80 to-brand-gold/25" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="section-kicker !text-white !bg-white/10">
            Prime Growth Corridor
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif">
            Kaithi Toll Plaza & Markandeya Mahadev Corridor
          </h1>
          <p className="text-sm sm:text-base text-white/70 max-w-3xl mx-auto leading-relaxed">
            Strategically located at **Bhandaha Kalan, Kaithi**, right along the Varanasi-Ghazipur Highway near Kaithi NHAI Toll Plaza and 1.5 KM from Markandeya Mahadev Mandir.
          </p>
        </div>
      </section>

      {/* Location Highlights Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="lift-card bg-white/85 p-6 rounded-2xl border border-brand-navy/10 text-left space-y-2">
            <div className="bg-brand-navy/5 p-3 rounded-xl inline-block text-brand-gold">
              <Landmark className="h-6 w-6 text-brand-gold" />
            </div>
            <h3 className="font-serif font-bold text-brand-navy text-lg">Markandeya Mahadev Corridor</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Just 1.5 KM from the sacred confluence of holy Ganga & Gomti rivers. An auspicious and rapid infrastructure development zone.
            </p>
          </div>

          <div className="lift-card bg-white/85 p-6 rounded-2xl border border-brand-navy/10 text-left space-y-2">
            <div className="bg-brand-navy/5 p-3 rounded-xl inline-block text-brand-gold">
              <Car className="h-6 w-6 text-brand-gold" />
            </div>
            <h3 className="font-serif font-bold text-brand-navy text-lg">Kaithi NHAI Toll Plaza Proximity</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Situated right at the Kaithi Toll Plaza approach on the multi-lane National Highway corridor, ensuring immediate 24x7 highway connectivity.
            </p>
          </div>

          <div className="lift-card bg-white/85 p-6 rounded-2xl border border-brand-navy/10 text-left space-y-2">
            <div className="bg-brand-navy/5 p-3 rounded-xl inline-block text-brand-gold">
              <Building className="h-6 w-6 text-brand-gold" />
            </div>
            <h3 className="font-serif font-bold text-brand-navy text-lg">Adjacent Educational Hub</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Ishwar Chand Vidya Public School campus is located immediately adjacent to the project boundary, making it ideal for residential living.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator & Landmarks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Live Location Distance Calculator */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-150 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-brand-gold text-brand-navy font-bold text-[9px] uppercase tracking-wider px-3.5 py-1 rounded-bl">
                Live GPS
              </div>
              <h3 className="text-xl font-bold text-brand-navy font-serif mb-2 flex items-center space-x-2">
                <Navigation className="h-5 w-5 text-brand-gold animate-pulse" />
                <span>Live Distance Calculator</span>
              </h3>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Check how far **Devojas City (Kaithi Toll Plaza & Markandeya Mahadev Corridor, Varanasi)** is from your current real-time GPS location.
              </p>

              <button
                onClick={getLiveLocation}
                disabled={loading}
                className="w-full bg-brand-navy hover:bg-brand-navyLight text-white font-bold py-3.5 rounded-xl text-sm shadow-md hover:shadow-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Compass className="h-4.5 w-4.5 text-brand-gold" />
                <span>{loading ? 'Calculating GPS coordinates...' : 'Get Live Distance to Site'}</span>
              </button>

              {error && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-800 p-3.5 rounded-lg text-xs flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {liveDistance && (
                <div className="mt-6 bg-brand-navy/5 border border-brand-gold/20 p-5 rounded-xl space-y-4 animate-fadeIn">
                  <div className="flex items-center space-x-2 text-xs font-bold text-brand-navy uppercase tracking-wider">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Coordinates Computed</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-100">
                    <div>
                      <span className="block text-[10px] text-gray-400 font-semibold uppercase">Your Latitude</span>
                      <strong className="text-brand-navy">{liveDistance.lat}° N</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 font-semibold uppercase">Your Longitude</span>
                      <strong className="text-brand-navy">{liveDistance.lon}° E</strong>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>Calculated Distance:</span>
                      <span className="font-bold text-brand-navy">{liveDistance.km} KM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Driving Time:</span>
                      <span className="font-bold text-brand-gold">{liveDistance.duration}</span>
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-gray-400 italic text-center">
                    * Distance calculated via geodesic formula to Kaithi corridor.
                  </p>
                </div>
              )}

            </div>

            {/* Travel Guide Tip */}
            <div className="bg-brand-navy text-white p-6 rounded-2xl shadow-lg border border-white/10 space-y-3 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-navyLight to-brand-navy opacity-90 rounded-2xl" />
              <div className="relative z-10 space-y-2">
                <h4 className="font-bold font-serif text-brand-gold flex items-center space-x-2">
                  <ShieldCheck className="h-5 w-5 text-brand-gold" />
                  <span>Connectivity & Growth Corridor</span>
                </h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  The plot layout is positioned adjacent to **Kaithi NHAI Toll Plaza**, placing it directly along the 4-lane National Highway corridor with wide road frontage and uninterrupted access to Varanasi Cantt and Ring Road.
                </p>
              </div>
            </div>
          </div>

          {/* Distance Highlights table */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xl">
              <h3 className="text-xl font-bold text-brand-navy font-serif mb-4 flex items-center space-x-2">
                <Car className="h-5 w-5 text-brand-gold" />
                <span>Key Distances & Driving Timings</span>
              </h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-150">
                  <thead>
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Destinations</th>
                      <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Distance</th>
                      <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Driving Time</th>
                      <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100 text-xs text-gray-700">
                    {landmarks.map((lm, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-3.5 font-bold text-brand-navy">{lm.name}</td>
                        <td className="px-3 py-3.5 font-semibold text-gray-900">{lm.distance}</td>
                        <td className="px-3 py-3.5 text-gray-500">{lm.duration}</td>
                        <td className="px-3 py-3.5">
                          <span className="bg-brand-navy/5 text-brand-navy border border-brand-navy/10 px-2 py-0.5 rounded text-[10px] font-semibold">
                            {lm.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Embedded Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-2xl text-left">
          
          <div className="p-6 bg-brand-navy text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-brand-gold/20 rounded-lg">
                <Map className="h-6 w-6 text-brand-gold" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg">Interactive Site Location (Google Map)</h3>
                <p className="text-xs text-white/70">Kaithi Toll Plaza & Markandeya Mahadev Corridor, Varanasi</p>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Markandey+Mahadev+Kaithi+Varanasi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-brand-gold hover:bg-brand-goldLight text-brand-navy font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all self-start sm:self-auto cursor-pointer"
            >
              <span>Open in Google Maps Navigation</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="h-[480px] w-full bg-gray-100 relative">
            <iframe 
              title="Devojas City Project Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14397.940608552194!2d83.16912384666579!3d25.488880628286202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e1bb3493dbab5%3A0x6b44fb7efd40c6c4!2sKaithi%2C%20Uttar%20Pradesh%20221116!5e0!3m2!1sen!2sin!4v1724248450129!5m2!1sen!2sin" 
              className="w-full h-full border-none"
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          
          <div className="p-4 bg-gray-50 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-gray-150">
            <span>📍 Location: Bhandaha Kalan, Kaithi Toll Plaza & Markandeya Mahadev Corridor, Ghazipur Road, Varanasi</span>
            <span className="font-semibold text-brand-navy">Free guided site tours available daily</span>
          </div>
        </div>
      </section>

    </div>
  );
}
