import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FlightInventory } from '../../models/flight-search.model';

import { FlightSearchService } from '../../services/flight-search.service';
import {
  FlightSearchRequest,
  FlightSearchResponse,
  BookingRequest,
} from '../../models/flight-search.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent {
  isAdmin = signal(false);
  newFlight: FlightInventory = this.resetFlightForm();
  constructor(private flightService: FlightSearchService, private http: HttpClient) {
    this.checkAdminStatus();
  }

  showAddFlight() {
    this.view = 'ADD_FLIGHT' as any;
  }

  checkAdminStatus() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.roles && payload.roles.includes('ROLE_ADMIN')) {
          this.isAdmin.set(true);
        }
      } catch (e) {
        console.error('Error decoding token', e);
      }
    }
  }

  resetFlightForm(): FlightInventory {
    return {
      airlineName: '',
      flightNumber: '',
      fromPlace: '',
      toPlace: '',
      departureTime: '',
      arrivalTime: '',
      totalSeats: 180,
      price: 0,
      specialFare: 0,
      fareCategory: 'STUDENT',
    };
  }

  onAddFlight() {
    if (
      !this.newFlight.airlineName ||
      !this.newFlight.flightNumber ||
      !this.newFlight.fromPlace ||
      !this.newFlight.toPlace ||
      !this.newFlight.departureTime ||
      !this.newFlight.arrivalTime
    ) {
      alert('Please fill in all required fields!');
      return;
    }

    const payload = { ...this.newFlight };

    if (payload.departureTime && payload.departureTime.length === 16) {
      payload.departureTime += ':00';
    }
    if (payload.arrivalTime && payload.arrivalTime.length === 16) {
      payload.arrivalTime += ':00';
    }

    payload.price = Number(payload.price);
    payload.specialFare = Number(payload.specialFare);
    payload.totalSeats = Number(payload.totalSeats);

    console.log('Attempting to add flight with payload:', payload);

    this.flightService.addFlight(payload).subscribe({
      next: () => {
        alert('Flight added successfully!');
        this.newFlight = this.resetFlightForm();
        this.showSearch();
      },
      error: (err) => {
        console.error('FULL ERROR OBJECT:', err);
        const serverMessage = err.error?.message || err.message || 'Unknown Server Error';
        alert(`Error adding flight: ${serverMessage}`);

        if (err.status === 403 || err.status === 401) {
          alert('Session expired or Unauthorized. Please log in again.');
        }
      },
    });
  }

  cancelBookingById(pnr: string) {
    if (confirm(`Are you sure you want to cancel booking PNR: ${pnr}?`)) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http
        .delete(`/booking-service-micro-assignment/api/flight/booking/cancel/${pnr}`, {
          headers,
          responseType: 'text',
        })
        .subscribe({
          next: (response) => {
            alert('Booking cancelled successfully');
            this.bookings = this.bookings.filter((b) => b.pnr !== pnr);
            this.pnrTicket = null;
            this.loadBookings();
          },
          error: (err) => {
            if (err.status === 200 || err.status === 204 || err.status === 0) {
              alert('Booking cancelled successfully');
              this.bookings = this.bookings.filter((b) => b.pnr !== pnr);
              this.loadBookings();
            } else {
              console.error('Cancellation Error:', err);
              alert('Failed to cancel: ' + (err.error?.message || err.message));
            }
          },
        });
    }
  }

  searchRequest: FlightSearchRequest = {
    fromPlace: '',
    toPlace: '',
    travelDate: '',
    tripType: 'ONE_WAY',
  };

  flights = signal<FlightSearchResponse[]>([]);
  loading = signal(false);
  selectedFlight = signal<FlightSearchResponse | null>(null);

  onSearch() {
    this.loading.set(true);
    this.flights.set([]);

    this.flightService.searchFlights(this.searchRequest).subscribe({
      next: (res) => {
        this.flights.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  view: 'SEARCH' | 'BOOKINGS' | 'PNR' | 'ADD_FLIGHT' = 'SEARCH';

  showSearch() {
    this.view = 'SEARCH';
  }

  showBookings() {
    this.view = 'BOOKINGS';
    this.loadBookings();
  }

  showPnrSearch() {
    this.view = 'PNR';
  }

  getEmailFromToken(): string {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      return savedEmail;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('JWT token not found');
      return '';
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('JWT payload for debugging:', payload);

      return payload.email || payload.sub || '';
    } catch (e) {
      console.error('Invalid JWT', e);
      return '';
    }
  }

  loadBookings() {
    const email = this.getEmailFromToken();

    if (!email) {
      console.error('No email found to fetch bookings');
      return;
    }
    this.flightService.getBookingHistory(email).subscribe({
      next: (data: any) => {
        this.bookings = data;
        console.log('Bookings loaded successfully:', data);
      },
      error: (err) => {
        console.error('Booking API error:', err);
        if (err.status === 401) {
          alert('Session expired. Please log in again.');
        }
      },
    });
  }
  bookings: any[] = [];

  pnr = '';
  pnrTicket: any;

  pnrErrorMessage: string = '';

  getTicketByPnr() {
    this.pnrTicket = null;
    this.pnrErrorMessage = '';

    if (!this.pnr) {
      this.pnrErrorMessage = 'Please enter a PNR number.';
      return;
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<any>(`/booking-service-micro-assignment/api/flight/ticket/${this.pnr}`, { headers })
      .subscribe({
        next: (res) => {
          if (res) {
            this.pnrTicket = res;
            this.pnrErrorMessage = '';
          } else {
            this.pnrErrorMessage = 'No ticket available for this PNR.';
          }
        },
        error: (err) => {
          console.error('Ticket error', err);
          this.pnrTicket = null;
          this.pnrErrorMessage = 'No ticket available for this PNR or the PNR is invalid.';
        },
      });
  }
  bookingRequest: BookingRequest = {
    email: '',
    numberOfSeats: 1,
    passengers: [],
  };

  generatePassengerFields() {
    this.bookingRequest.passengers = [];
    for (let i = 0; i < this.bookingRequest.numberOfSeats; i++) {
      this.bookingRequest.passengers.push({
        name: '',
        gender: 'MALE',
        age: 18,
        meal: 'VEG',
        fareCategory: 'GENERAL',
        seatNumber: i + 1,
      });
    }
  }

  bookFlight(flight: FlightSearchResponse) {
    this.selectedFlight.set(flight);
    this.bookingRequest.numberOfSeats = 1;
    this.bookingRequest.email = this.getEmailFromToken();

    this.generatePassengerFields();
  }

  confirmBooking() {
    const flight = this.selectedFlight();
    if (!flight?.flightId) return alert('Flight ID missing');

    this.flightService.bookFlight(flight.flightId, this.bookingRequest).subscribe({
      next: () => {
        alert('Booking Successful!');
        this.selectedFlight.set(null);
        this.loadBookings();
        this.view = 'BOOKINGS';
      },
      error: (err) => alert(err.error?.message || 'Booking failed'),
    });
    console.log('Sending Booking Request:', this.bookingRequest);
    console.log('For Flight ID:', flight.flightId);
  }

  cancelBooking() {
    this.selectedFlight.set(null);
  }
}
