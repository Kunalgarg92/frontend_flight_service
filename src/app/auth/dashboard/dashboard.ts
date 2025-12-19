import { Component, signal } from '@angular/core';
import { FlightSearchService } from '../../services/flight-search.service';
import { FlightSearchRequest, FlightSearchResponse } from '../../models/flight-search.model';
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
  bookFlight(flight: any) {
    console.log('Selected flight:', flight);
    alert(`Booking initiated for ${flight.airlineName} (${flight.flightNumber})`);
  }
}
