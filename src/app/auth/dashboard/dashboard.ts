import { Component, signal } from '@angular/core';
import { FlightSearchService } from '../../services/flight-search.service';
import {
  FlightSearchRequest,
  FlightSearchResponse,
  BookingRequest,
} from '../../models/flight-search.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent {
  searchRequest: FlightSearchRequest = {
    fromPlace: '',
    toPlace: '',
    travelDate: '',
    tripType: 'ONE_WAY',
  };

  selectedFlight = signal<FlightSearchResponse | null>(null);
  bookingRequest: BookingRequest = {
    email: '',
    numberOfSeats: 1,
    passengers: [],
  };

  flights = signal<FlightSearchResponse[]>([]);
  loading = signal(false);
  errorMessage = signal('');

  constructor(private flightService: FlightSearchService) {}

  onSearch() {
    this.loading.set(true);
    this.flights.set([]);

    this.flightService.searchFlights(this.searchRequest).subscribe({
      next: (res) => {
        console.log('Flight search response:', res);
        this.flights.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
        this.flights.set([]);
      },
    });
  }
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

  bookFlight(flight: any) {
    this.selectedFlight.set(flight);
    this.bookingRequest.numberOfSeats = 1;
    this.generatePassengerFields();
  }

  confirmBooking() {
    const flight = this.selectedFlight();

    if (!flight || !flight.flightId) {
      alert('Flight ID missing.');
      return;
    }

    if (!this.bookingRequest.email) {
      alert('Email is required');
      return;
    }

    if (this.bookingRequest.passengers.length !== this.bookingRequest.numberOfSeats) {
      alert('Passenger count mismatch');
      return;
    }

    for (const p of this.bookingRequest.passengers) {
      if (!p.name || !p.gender || p.age <= 0) {
        alert('Fill all passenger details');
        return;
      }
    }

    this.flightService.bookFlight(flight.flightId, this.bookingRequest).subscribe({
      next: () => {
        alert('Booking Successful!');
        this.selectedFlight.set(null);
      },
      error: (err) => {
        console.error('Booking failed', err);
        alert(err.error?.message || 'Booking failed');
      },
    });
  }

  cancelBooking() {
    this.selectedFlight.set(null);
  }
}
