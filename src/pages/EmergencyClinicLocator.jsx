import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeaderActions from '../components/HeaderActions';
import TopHeader from '../components/TopHeader';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import toast from 'react-hot-toast';
import { supabase } from '../supabaseClient';

// Function to calculate distance in kilometers between two lat/lng points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const p = 0.017453292519943295;    // Math.PI / 180
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
};

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const createUserIcon = () => {
    return L.divIcon({
        html: `<div class="w-6 h-6 rounded-full bg-blue-600 border-4 border-white shadow-lg ring-4 ring-blue-600/30"></div>`,
        className: 'custom-leaflet-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
};

const createClinicIcon = (type) => {
    let colorHex = "#0f6df0"; // primary
    let iconName = "local_hospital";
    if (type === 'urgent') { colorHex = "#f59e0b"; iconName = "help_clinic"; }
    else if (type === 'pharmacy') { colorHex = "#10b981"; iconName = "local_pharmacy"; }

    return L.divIcon({
        html: `<div style="width: 40px; height: 40px; border-radius: 9999px; background-color: white; border: 2px solid ${colorHex}; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
                <span class="material-symbols-outlined" style="color: ${colorHex}; font-size: 20px;">${iconName}</span>
               </div>`,
        className: 'custom-leaflet-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });
};

const CLINICS_DATA = [
    {
        id: 1,
        name: "Swasthya Health Clinic",
        type: "hospital",
        status: "OPEN",
        phone: "+91 98765 43210",
        distance: "0.8 km",
        info: "24/7 Emergency Care",
        lat: 28.5273,
        lng: 77.2167,
    },
    {
        id: 2,
        name: "Sanjeevani Urgent Care",
        type: "urgent",
        status: "BUSY",
        phone: "+91 98765 12345",
        distance: "2.4 km",
        info: "Closes at 10 PM",
        lat: 28.5332,
        lng: 77.2407,
    },
    {
        id: 3,
        name: "Apollo Pharmacy - 24hr",
        type: "pharmacy",
        status: "OPEN",
        phone: "+91 98111 22233",
        distance: "3.1 km",
        info: "Pharmacy & OTC",
        lat: 28.5501,
        lng: 77.2514,
    }
];

const FIRST_AID_GUIDES = [
    { id: 1, title: 'Chest Pain (CPR)', desc: 'Step-by-step instructions...', icon: 'heart_broken' },
    { id: 2, title: 'Choking', desc: 'Heimlich maneuver guide...', icon: 'restaurant' },
    { id: 3, title: 'Severe Bleeding', desc: 'How to apply a tourniquet...', icon: 'bloodtype' },
];

function MapController({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        // Force Leaflet to recalculate bounds to fix the "half loaded black screen" glitch
        setTimeout(() => {
            map.invalidateSize();
        }, 250);

        if (center) {
            map.flyTo(center, zoom || 13, { duration: 1.5 });
        }
    }, [center, zoom, map]);
    return null;
}

const EmergencyClinicLocator = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterOpenNow, setFilterOpenNow] = useState(false);
    const [selectedClinic, setSelectedClinic] = useState(null);
    const [mapCenter, setMapCenter] = useState([40.725, -73.995]);
    const [userLocation, setUserLocation] = useState([40.725, -73.995]);
    const [userLocationName, setUserLocationName] = useState("Your Location");
    const [mapZoom, setMapZoom] = useState(13);
    const [guideIndex, setGuideIndex] = useState(0);
    const [liveClinics, setLiveClinics] = useState(CLINICS_DATA);
    const [isLoading, setIsLoading] = useState(true);
    const [apiMessage, setApiMessage] = useState("Fetching location...");

    const handleFindNearMe = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setIsLoading(true);
        toast.loading("Locating near you...", { id: "geo-toast" });

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                setUserLocation([lat, lng]);
                setMapCenter([lat, lng]);
                setMapZoom(13);
                setSelectedClinic(null);

                try {
                    const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`);
                    const geoData = await geoResponse.json();
                    const city = geoData?.address?.city || geoData?.address?.town || geoData?.address?.county || geoData?.name || "Your Area";
                    if (city) setUserLocationName(city + " (Live)");
                } catch(e) { 
                    setUserLocationName("Your Live Location");
                }

                // Overpass API fetching EXACTLY identical to the nearby doctors method
                try {
                    setApiMessage("Fetching live clinics nearby...");
                    // Use exact query syntax from doctors page (out body 25)
                    const query = `[out:json];(node["amenity"="clinic"](around:7000, ${lat}, ${lng});node["amenity"="hospital"](around:7000, ${lat}, ${lng});node["amenity"="pharmacy"](around:7000, ${lat}, ${lng}););out body 25;`;

                    const response = await fetch("https://overpass-api.de/api/interpreter", {
                        method: "POST",
                        body: query
                    });
                    
                    const data = await response.json();

                    const realClinics = data.elements
                        .filter(el => el.tags && (el.tags.name || el.tags.amenity))
                        .map((el, i) => {
                            const nodeLat = el.lat;
                            const nodeLon = el.lon;
                            const distance = calculateDistance(lat, lng, nodeLat, nodeLon);
                            
                            let type = "hospital";
                            if (el.tags.amenity === "pharmacy") type = "pharmacy";
                            else if (el.tags.amenity === "clinic") type = "urgent";

                            return {
                                id: 'real_' + (el.id || i),
                                name: el.tags.name || `Local ${type.charAt(0).toUpperCase() + type.slice(1)}`,
                                type: type,
                                status: "OPEN",
                                phone: el.tags.phone || el.tags['contact:phone'] || "Contact Unlisted",
                                distance: distance.toFixed(1) + " km",
                                info: el.tags['healthcare:speciality'] || el.tags.dispensing || (type === "pharmacy" ? "Pharmacy" : "Clinic/Hospital"),
                                lat: nodeLat,
                                lng: nodeLon,
                                rawDistance: distance
                            };
                        }).sort((a, b) => a.rawDistance - b.rawDistance);

                    if (realClinics.length > 0) {
                        setLiveClinics(realClinics);
                        setIsLoading(false);
                        setApiMessage("");
                        toast.success(`Found ${realClinics.length} real healthcare providers near you!`, { id: "geo-toast" });
                        return;
                    } else {
                        throw new Error("No items found in specific grid");
                    }
                } catch (e) {
                    console.warn("Real clinics API error, doing local sort exactly like doctors:", e);
                    
                    // Fallback to sorting mocked items if OSM has no data in that specific grid
                    const sortedClinics = [...liveClinics].map(clinic => {
                        const distance = clinic.lat && clinic.lng ? calculateDistance(lat, lng, clinic.lat, clinic.lng) : Infinity;
                        return { ...clinic, distance: distance.toFixed(1) + " km", rawDistance: distance };
                    }).sort((a, b) => a.rawDistance - b.rawDistance);

                    setLiveClinics(sortedClinics);
                    setIsLoading(false);
                    setApiMessage("");
                    toast.error("No real clinics mapped nearby. Showing default locations instead.", { id: "geo-toast", duration: 4000 });
                }
            },
            (error) => {
                setIsLoading(false);
                toast.error("Unable to access GPS location.", { id: "geo-toast" });
            }
        );
    };

    // Load data from Supabase/Mock on mount (Method used exactly in doctors page)
    useEffect(() => {
        const fetchClinics = async () => {
            try {
                const { data, error } = await supabase.from('clinics').select('*');
                if (error) throw error;
                if (data && data.length > 0) {
                    setLiveClinics(data);
                }
            } catch (error) {
                console.warn("Using local mock clinics (Supabase fetch bypassed or failed)");
            }
            setIsLoading(false);
            setApiMessage("");
        };
        fetchClinics();
    }, []);

    // Filter clinics
    const displayClinics = liveClinics.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesOpen = filterOpenNow ? c.status === "OPEN" : true;
        return matchesSearch && matchesOpen;
    });

    const handleClinicClick = (clinic) => {
        setSelectedClinic(clinic.id);
        setMapCenter([clinic.lat, clinic.lng]);
        setMapZoom(15);
    };

    const nextGuide = () => {
        setGuideIndex((prev) => (prev + 1) % FIRST_AID_GUIDES.length);
    };

    const prevGuide = () => {
        setGuideIndex((prev) => (prev - 1 + FIRST_AID_GUIDES.length) % FIRST_AID_GUIDES.length);
    };

    const handleCall911 = () => {
        alert("Simulating emergency call 911...");
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
            <div className="layout-container flex h-screen flex-col">
                {/* Header */}
                <TopHeader />

                {/* Main Content Area */}
                <main className="flex flex-1 overflow-hidden relative">
                    {/* Sidebar: Clinic List & SOS */}
                    <aside className="w-96 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark overflow-hidden shrink-0 z-10 shadow-xl">
                        {/* High-Visibility SOS Section */}
                        <div className="p-6 bg-red-50 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/20 shrink-0">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-red-600 dark:text-red-400 font-bold text-lg uppercase tracking-wider flex items-center gap-2">
                                        <span className="material-symbols-outlined fill-1">emergency</span>
                                        Emergency
                                    </h3>
                                    <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-[10px] font-bold animate-pulse">LIVE</span>
                                </div>
                                <button onClick={handleCall911} className="sos-pulse w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white py-4 rounded-xl flex flex-col items-center justify-center gap-1 transition-all shadow-lg hover:shadow-red-600/50">
                                    <span className="text-2xl font-black">CALL 911</span>
                                    <span className="text-xs opacity-90">One-tap emergency dispatch</span>
                                </button>
                            </div>
                        </div>

                        {/* First Aid Quick Guide Carousel */}
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">volunteer_activism</span>
                                    Quick First Aid Guide
                                </p>
                                <div className="flex gap-1">
                                    <button onClick={prevGuide} className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><span className="material-symbols-outlined text-lg">chevron_left</span></button>
                                    <button onClick={nextGuide} className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><span className="material-symbols-outlined text-lg">chevron_right</span></button>
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg flex items-center gap-4 transition-all duration-300">
                                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-inner">
                                    <span className="material-symbols-outlined text-2xl">{FIRST_AID_GUIDES[guideIndex].icon}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold">{FIRST_AID_GUIDES[guideIndex].title}</p>
                                    <p className="text-xs text-slate-500 line-clamp-1">{FIRST_AID_GUIDES[guideIndex].desc}</p>
                                    <button className="text-[10px] mt-1 text-primary hover:underline font-bold">Read instructions →</button>
                                </div>
                            </div>
                        </div>

                        {/* Clinic Listings */}
                        <div className="p-4 flex flex-col gap-2 overflow-y-auto flex-1">
                            <h1 className="text-slate-900 dark:text-slate-100 text-base font-bold mb-2 px-2">Nearby Medical Facilities</h1>

                            {apiMessage && (
                                <div className="px-3 py-2 mx-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[11px] rounded-lg border border-blue-100 dark:border-blue-900/50 mb-2">
                                    {isLoading && <span className="material-symbols-outlined text-[14px] animate-spin mr-1 align-middle">progress_activity</span>}
                                    {apiMessage}
                                </div>
                            )}

                            {!isLoading && displayClinics.length === 0 && (
                                <div className="p-4 text-center text-slate-500 text-sm">
                                    No facilities found matching your criteria.
                                </div>
                            )}

                            {displayClinics.map(clinic => {
                                const isSelected = selectedClinic === clinic.id;
                                let bgIconColor = "bg-primary/10 text-primary";
                                let iconName = "local_hospital";
                                let statusBg = clinic.status === "OPEN" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";

                                if (clinic.type === 'urgent') { bgIconColor = "bg-amber-100 text-amber-600"; iconName = "help_clinic"; }
                                else if (clinic.type === 'pharmacy') { bgIconColor = "bg-green-100 text-green-600"; iconName = "local_pharmacy"; }

                                return (
                                    <div
                                        key={clinic.id}
                                        onClick={() => handleClinicClick(clinic)}
                                        className={`p-4 rounded-xl transition-all border cursor-pointer group ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-md' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm'}`}
                                    >
                                        <div className="flex gap-4">
                                            <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${bgIconColor}`}>
                                                <span className="material-symbols-outlined">{iconName}</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{clinic.name}</p>
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${statusBg}`}>{clinic.status}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">call</span> {clinic.phone}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">{clinic.distance} • {clinic.info}</p>

                                                {isSelected && (
                                                    <div className="flex gap-2 mt-4 animate-fade-in-up">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); alert(`Getting directions to ${clinic.name}...`); }}
                                                            className="flex-1 py-2 rounded-lg bg-primary hover:bg-blue-700 text-white text-[11px] font-bold shadow-md shadow-primary/20 transition-colors">
                                                            Directions
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); alert(`Viewing details for ${clinic.name}...`); }}
                                                            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                                            Details
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </aside>

                    {/* Map Area */}
                    <section className="flex-1 relative bg-slate-100 dark:bg-slate-900 z-0">
                        {/* Interactive React Leaflet Map */}
                        <div className="absolute inset-0 leaflet-container-override">
                            <MapContainer
                                center={mapCenter}
                                zoom={mapZoom}
                                zoomControl={false}
                                style={{ height: '100%', width: '100%' }}
                            >
                                {/* Using CartoDB Dark Matter tile layer for a sleek dark mode look */}
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                    url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png"
                                />

                                <MapController center={mapCenter} zoom={mapZoom} />

                                {/* User Marker */}
                                <Marker position={userLocation} icon={createUserIcon()}>
                                    <Popup className="custom-popup">
                                        <div className="font-bold text-slate-800 text-sm">Your Location</div>
                                    </Popup>
                                </Marker>

                                {/* Clinic Markers */}
                                {displayClinics.map(clinic => (
                                    <Marker
                                        key={clinic.id}
                                        position={[clinic.lat, clinic.lng]}
                                        icon={createClinicIcon(clinic.type)}
                                        eventHandlers={{
                                            click: () => handleClinicClick(clinic)
                                        }}
                                    >
                                        <Popup className="custom-popup">
                                            <div className="font-bold text-slate-800 text-sm mb-1">{clinic.name}</div>
                                            <div className="text-xs text-slate-500 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[12px]">schedule</span> {clinic.info}
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>

                        {/* Map UI Controls Overlays */}
                        {/* We use Leaflet without default controls, so we add custom overlay controls here */}
                        <div className="absolute top-6 right-6 flex flex-col gap-3 z-[400] pointer-events-none">
                            <button
                                onClick={handleFindNearMe}
                                className="p-3 mb-2 rounded-xl shadow-2xl shadow-slate-900/20 bg-blue-600 text-white hover:bg-blue-700 transition-colors pointer-events-auto flex items-center justify-center gap-2 group">
                                <span className="material-symbols-outlined group-hover:animate-spin">location_searching</span>
                                <span className="text-sm font-bold pr-1">Find Near Me</span>
                            </button>

                            <div className="flex flex-col rounded-xl overflow-hidden shadow-2xl shadow-slate-900/20 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 pointer-events-auto">
                                <button className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 border-b border-slate-200 dark:border-slate-700 transition-colors"
                                    onClick={() => setMapZoom(z => Math.min(z + 1, 18))}>
                                    <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">add</span>
                                </button>
                                <button className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                    onClick={() => setMapZoom(z => Math.max(z - 1, 3))}>
                                    <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">remove</span>
                                </button>
                            </div>
                            <button
                                onClick={() => { setMapCenter(userLocation); setMapZoom(13); setSelectedClinic(null); }}
                                className="p-3 rounded-xl shadow-2xl shadow-slate-900/20 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors pointer-events-auto group">
                                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">my_location</span>
                            </button>
                        </div>

                        {/* Floating Search/Filter Bar */}
                        <div className="absolute top-6 left-6 md:left-[30%] lg:left-6 z-[400] pointer-events-none">
                            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-900/20 p-2 flex gap-2 border border-slate-200/50 dark:border-slate-700/50 pointer-events-auto min-w-[280px]">
                                <button
                                    className={`flex-1 overflow-hidden relative group py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all
                                        ${!filterOpenNow ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                    onClick={() => setFilterOpenNow(false)}
                                >
                                    <span className="material-symbols-outlined text-sm">filter_alt</span>
                                    <span className="relative z-10">All Facilities</span>
                                </button>
                                <button
                                    className={`flex-1 overflow-hidden relative group py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all
                                        ${filterOpenNow ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                    onClick={() => setFilterOpenNow(true)}
                                >
                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                    <span className="relative z-10">Open Now</span>
                                </button>
                            </div>
                        </div>

                        {/* Current Location Footer Info */}
                        <div className="absolute bottom-6 left-6 z-[400] pointer-events-none">
                            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-900/20 p-4 border border-slate-200/50 dark:border-slate-700/50 flex flex-col items-start gap-3 min-w-[300px] pointer-events-auto">
                                <div className="flex items-center gap-3 w-full">
                                    <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[20px]">location_on</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider leading-none mb-1">Your current location</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{userLocationName}</p>
                                    </div>
                                </div>
                                <div className="w-full text-xs font-semibold text-slate-500 flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-3 mt-1">
                                    <span>{displayClinics.length} Facilities found</span>
                                    <button className="text-primary hover:underline" onClick={() => { setMapCenter(userLocation); setMapZoom(13); }}>Recenter</button>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            {/* Injected CSS for Leaflet overrides */}
            <style jsx="true">{`
                .leaflet-container-override .leaflet-control-attribution {
                    background: rgba(15, 23, 42, 0.7) !important;
                    color: #94a3b8 !important;
                }
                .leaflet-container-override .leaflet-control-attribution a {
                    color: #38bdf8 !important;
                }
                .custom-popup .leaflet-popup-content-wrapper {
                    border-radius: 12px;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                    padding: 4px;
                }
                .leaflet-marker-icon.custom-leaflet-icon {
                    background: none;
                    border: none;
                }
            `}</style>
        </div >
    );
};

export default EmergencyClinicLocator;
