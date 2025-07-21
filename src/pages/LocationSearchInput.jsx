import React, { useEffect, useState } from "react";
import axios from "axios";

const LocationSearchInput = ({ value, onSelect }) => {
  const [query, setQuery] = useState(value?.label || "");
  const [suggestions, setSuggestions] = useState([]);

  // Keep input in sync when parent changes value (like after fetching ride for edit)
  useEffect(() => {
    setQuery(value?.label || "");
  }, [value]);

  const fetchSuggestions = async (val) => {
    setQuery(val);
    if (val.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: val,
          format: "json",
          addressdetails: 1,
          limit: 5,
        },
      });
      setSuggestions(res.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSelect = (place) => {
    const address = place.address || {};
    const city =
      address.city ||
      address.town ||
      address.village ||
      address.state_district ||
      address.state;
    const location = {
      label: place.display_name,
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lon),
    };
    onSelect(location, city);
    setQuery(place.display_name);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full col-span-3 md:col-span-3">
      <input
        type="text"
        value={query}
        onChange={(e) => fetchSuggestions(e.target.value)}
        placeholder="Search location..."
        className="input-style w-full"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded shadow w-full max-h-60 overflow-y-auto mt-1">
          {suggestions.map((place, idx) => (
            <li
              key={idx}
              className="px-4 py-2 hover:bg-emerald-100 cursor-pointer text-sm"
              onClick={() => handleSelect(place)}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSearchInput;
