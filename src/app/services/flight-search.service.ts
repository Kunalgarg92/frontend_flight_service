import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FlightSearchRequest, FlightSearchResponse } from '../models/flight-search.model';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class FlightSearchService {
  private baseUrl = '/flight-service-micro-assignment/api/flight';

  constructor(private http: HttpClient) {}

  searchFlights(payload: FlightSearchRequest): Observable<FlightSearchResponse[]> {
    return this.http.post<FlightSearchResponse[]>(`${this.baseUrl}/search`, payload);
  }

  bookFlight(flightId: string, bookingData: any) {
    const url = `/booking-service-micro-assignment/api/flight/booking/${flightId}`;
    return this.http.post(url, bookingData);
  }

  getBookingHistory(email: string) {
    const token = localStorage.getItem('token');
    console.log('My Token is:', token);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const url = `/booking-service-micro-assignment/api/flight/booking/history/${encodeURIComponent(
      email
    )}`;
    return this.http.get(url, { headers: headers });
  }
  addFlight(flightData: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(
      '/flight-service-micro-assignment/api/flight/airline/inventory',
      flightData,
      { headers, responseType: 'text' }
    );
  }
}
