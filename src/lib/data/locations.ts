export interface CountryLocation {
  code: string;
  name: string;
  currency: 'USD' | 'INR' | 'GBP' | 'AED' | 'AUD' | 'EUR';
  currencySymbol: string;
  cities: {
    name: string;
    region: string;
    lat: number;
    lng: number;
  }[];
}

export const supportedCountries: CountryLocation[] = [
  {
    code: 'IN',
    name: 'India',
    currency: 'INR',
    currencySymbol: '₹',
    cities: [
      { name: 'Delhi NCR', region: 'Delhi', lat: 28.6139, lng: 77.209 },
      { name: 'Mumbai', region: 'Maharashtra', lat: 19.076, lng: 72.8777 },
      { name: 'Bengaluru', region: 'Karnataka', lat: 12.9716, lng: 77.5946 },
      { name: 'Hyderabad', region: 'Telangana', lat: 17.385, lng: 78.4867 },
      { name: 'Chennai', region: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
      { name: 'Pune', region: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
      { name: 'Kolkata', region: 'West Bengal', lat: 22.5726, lng: 88.3639 },
      { name: 'Ahmedabad', region: 'Gujarat', lat: 23.0225, lng: 72.5714 },
      { name: 'Jaipur', region: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
      { name: 'Chandigarh', region: 'Punjab/Haryana', lat: 30.7333, lng: 76.7794 },
    ],
  },
  {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    cities: [
      { name: 'New York', region: 'New York', lat: 40.7128, lng: -74.006 },
      { name: 'Los Angeles', region: 'California', lat: 34.0522, lng: -118.2437 },
      { name: 'Chicago', region: 'Illinois', lat: 41.8781, lng: -87.6298 },
      { name: 'Houston', region: 'Texas', lat: 29.7604, lng: -95.3698 },
      { name: 'Miami', region: 'Florida', lat: 25.7617, lng: -80.1918 },
      { name: 'Austin', region: 'Texas', lat: 30.2672, lng: -97.7431 },
      { name: 'San Francisco', region: 'California', lat: 37.7749, lng: -122.4194 },
    ],
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    currency: 'AED',
    currencySymbol: 'AED ',
    cities: [
      { name: 'Dubai', region: 'Dubai', lat: 25.2048, lng: 55.2708 },
      { name: 'Abu Dhabi', region: 'Abu Dhabi', lat: 24.4539, lng: 54.3773 },
      { name: 'Sharjah', region: 'Sharjah', lat: 25.3463, lng: 55.4209 },
    ],
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    currency: 'GBP',
    currencySymbol: '£',
    cities: [
      { name: 'London', region: 'Greater London', lat: 51.5074, lng: -0.1278 },
      { name: 'Manchester', region: 'Greater Manchester', lat: 53.4808, lng: -2.2426 },
      { name: 'Birmingham', region: 'West Midlands', lat: 52.4862, lng: -1.8904 },
    ],
  },
  {
    code: 'AU',
    name: 'Australia',
    currency: 'AUD',
    currencySymbol: 'A$',
    cities: [
      { name: 'Sydney', region: 'New South Wales', lat: -33.8688, lng: 151.2093 },
      { name: 'Melbourne', region: 'Victoria', lat: -37.8136, lng: 144.9631 },
      { name: 'Brisbane', region: 'Queensland', lat: -27.4698, lng: 153.0251 },
    ],
  },
  {
    code: 'CA',
    name: 'Canada',
    currency: 'USD',
    currencySymbol: 'C$',
    cities: [
      { name: 'Toronto', region: 'Ontario', lat: 43.6532, lng: -79.3832 },
      { name: 'Vancouver', region: 'British Columbia', lat: 49.2827, lng: -123.1207 },
    ],
  },
  {
    code: 'SG',
    name: 'Singapore',
    currency: 'USD',
    currencySymbol: 'S$',
    cities: [
      { name: 'Singapore Central', region: 'Central Region', lat: 1.3521, lng: 103.8198 },
    ],
  },
];
