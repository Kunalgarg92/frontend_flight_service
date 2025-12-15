export interface FlightSearchRequest {
  fromPlace: string;
  toPlace: string;
  travelDate: string;
  travelTime?: string;
  tripType: 'ONE_WAY' | 'ROUND_TRIP';
  returnDate?: string;
}

export interface FlightSearchResponse {
  airlineName: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  oneWayPrice: number;
  roundTripPrice?: number;
  message?: string;
  returnDepartureTime?: string | null;
  returnArrivalTime?: string | null;
  returnFlightNumber?: string | null;
}
