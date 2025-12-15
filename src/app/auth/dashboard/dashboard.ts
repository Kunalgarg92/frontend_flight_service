import { Component } from '@angular/core';
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

  flights: FlightSearchResponse[] = [];
  loading = false;
  errorMessage = '';

  constructor(private flightService: FlightSearchService) {}

  onSearch() {
    this.loading = true;
    this.errorMessage = '';
    this.flights = [];

    this.flightService.searchFlights(this.searchRequest).subscribe({
      next: (response) => {
        console.log('Flight search response:', response);

        this.flights = response;
        this.loading = false;
      },
      error: (err) => {
        console.error('Flight search error:', err);
        this.errorMessage = 'No flights found or error occurred';
        this.loading = false;
      },
    });
  }
}
