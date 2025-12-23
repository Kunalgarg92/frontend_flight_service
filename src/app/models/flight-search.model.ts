export interface FlightSearchRequest {
  fromPlace: string;
  toPlace: string;
  travelDate: string;
  travelTime?: string;
  tripType: 'ONE_WAY' | 'ROUND_TRIP';
  returnDate?: string;
}

export interface FlightSearchResponse {
  flightId: string;
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

export interface Passenger {
  name: string;
  gender: string;
  age: number;
  meal: string;
  fareCategory: string;
  seatNumber: number;
}

export interface BookingRequest {
  email: string;
  numberOfSeats: number;
  passengers: Passenger[];
}

export interface FlightInventory {
  airlineName: string;
  flightNumber: string;
  fromPlace: string;
  toPlace: string;
  departureTime: string;
  arrivalTime: string;
  totalSeats: number;
  price: number;
  specialFare: number;
  fareCategory: string;
}
