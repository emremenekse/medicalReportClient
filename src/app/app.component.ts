import { Component, InjectionToken, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertifyService, MessageType, Position } from './services/alertify/alertify.service';
import { MedicalReportService } from './services/medicalReport/medical-report.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientServiceService } from './services/httpClient/http-client.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { cwd } from 'node:process';
export const BASE_URL = new InjectionToken<string>('baseUrl');
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HttpClientModule,FormsModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [AlertifyService,MedicalReportService,HttpClientServiceService,{ provide: BASE_URL, useValue: 'http://localhost:5062/api' }]
})
export class AppComponent implements OnInit{
  queriesResult: any;
  title = 'medicalReportClient';
  searchResults: AnnotatedDocument[] = [];
  originalResults: AnnotatedDocument[] = [];
  filteredSearchResults: string[] = [];
  modifiedDocumentResults: string[] = [];

  filters = {
    person: false,
    organization: false,
    group: false
  };
  searchQuery: string = '';
  constructor(private alertify: AlertifyService,private medicalReportService: MedicalReportService) {}
  ngOnInit(): void {
    this.getModifiedDocuments();
  }
  onSearch(searchQuery: string): void {
    this.medicalReportService.getQueries(searchQuery).subscribe((response: any) => {
      console.log(response);
      if (response.data && Array.isArray(response.data)) {
        this.originalResults = response.data;
        this.searchResults = response.data;
        this.applyFilters();
      } else {
        this.alertify.message('Received data is not in expected format or there is an error message.');
        console.error(response.errorMessage);
      }
    }, error => {
      this.alertify.message(error);
    });
  }
  getModifiedDocuments(){
    this.medicalReportService.getModifiedDocuments().subscribe(response => {
      if (response.data && Array.isArray(response.data)) {
        console.log("emre");
        this.modifiedDocumentResults = response.data;
        console.log(response.data);
      } else {
        this.alertify.message('Received data is not in expected format or there is an error message.');
        console.error(response.errorMessage);
      }
    })
  }
  applyFilters(): void {
    const activeFilters = Object.keys(this.filters).filter(key => this.filters[key as keyof typeof this.filters]);
  
    if (activeFilters.length > 0) {
      this.filteredSearchResults = this.originalResults
        .filter(doc => 
          doc.entities.some(entity => activeFilters.includes(entity.class))
        )
        .map(doc => doc.text);  
    } else {
      this.filteredSearchResults = this.originalResults.map(doc => doc.text);  
    }
  }
  
  
  onFilterChange(entityClass: string, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.filters[entityClass as keyof typeof this.filters] = inputElement.checked;
    this.applyFilters();
  }
  
  // filterEntities(): void {
  //   const isAnyFilterActive = this.filters.person || this.filters.organization || this.filters.group;
  
  //   if (isAnyFilterActive) {
  //     this.filteredSearchResults = this.searchResults.filter((doc: AnnotatedDocument) => {
  //       return doc.entities.some(entity => {
  //         return (this.filters.person && entity.class === 'PERSON') ||
  //                (this.filters.organization && entity.class === 'ORGANIZATION') ||
  //                (this.filters.group && entity.class === 'GROUP');
  //       });
  //     });
  //   } else {
  //     this.filteredSearchResults = [...this.searchResults];
  //   }
  // }
  
  
  
  
}

interface AnnotatedDocument {
  entities: Entity[];
  text: string;
}

interface Entity {
  class: string;
  start: number;
  end: number;
}
