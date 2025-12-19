import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FlightSearchRequest, FlightSearchResponse } from '../models/flight-search.model';

@Injectable({
  providedIn: 'root',
})
export class FlightSearchService {
  private baseUrl = 'http://localhost:9996/flight-service-micro-assignment/api/flight';

  constructor(private http: HttpClient) {}

  searchFlights(payload: FlightSearchRequest): Observable<FlightSearchResponse[]> {
    return this.http.post<FlightSearchResponse[]>(`${this.baseUrl}/search`, payload);
  }

  bookFlight(flightId: string, bookingData: any) {
    const url = `http://localhost:9996/booking-service-micro-assignment/api/flight/booking/${flightId}`;
    return this.http.post(url, bookingData);
  }
}
