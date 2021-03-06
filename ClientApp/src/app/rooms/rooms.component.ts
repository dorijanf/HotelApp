import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { RoomsService } from '../services/rooms.service';
import { Room } from '../models/room';
import { PaginationService } from '../services/pagination.service';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { City } from '../models/city';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  resultsForm = this.fb.group({
    rooms: [''],
    nOfBeds: [''],
    city: ['']
  })

  rooms$: Observable<Room[]>;
  cities$: Observable<City[]>;
  hotelIds: number[];
  pageNo: any = 1;
  pageNumber: boolean[] = [];
  orderBy: any = 'name';
  numberOfBeds: number;
  city: string;
  faCaretUp = faCaretUp;
  faCaretDown = faCaretDown;

  pageField = [];
  exactPageList: any;
  paginationData: number;
  roomsPerPage: any = 10;
  roomsPerPageResults = [10, 25, 50, 100];
  totalRoomsCount: any;

  constructor(private fb: FormBuilder,
    public roomsService: RoomsService,
    public paginationService: PaginationService) { }

  ngOnInit(): void {
    this.pageNumber[0] = true;
    this.cities$ = this.roomsService.getCities();
    this.loadRooms();
  }

  loadRooms() {
    this.rooms$ = this.roomsService.getRooms(this.pageNo,
      this.roomsPerPage, this.orderBy, this.numberOfBeds, this.city);
    this.paginationService.temppage = 0;
    this.getRoomsCount();
  }

  totalNoOfPages() {
    this.paginationData = Number(this.totalRoomsCount / this.roomsPerPage);
    let tempPageData = this.paginationData.toFixed();
    if (Number(tempPageData) < this.paginationData) {
      this.exactPageList = Number(tempPageData) + 1;
      this.paginationService.exactPageList = this.exactPageList;
    } else {
      this.exactPageList = Number(tempPageData);
      this.paginationService.exactPageList = this.exactPageList;
    }
    this.paginationService.pageOnLoad();
    this.pageField = this.paginationService.pageField;
  }

  showRoomsByPageNumber(page, i) {
    this.pageNumber = [];
    this.pageNumber[i] = true;
    this.pageNo = page;
    this.loadRooms();
  }

  getRoomsCount() {
    this.roomsService.getRoomsCount(null, this.pageNo,this.roomsPerPage,
      this.orderBy, this.numberOfBeds, this.city).subscribe((res: any) => {
      this.totalRoomsCount = res;
      this.totalNoOfPages();
    });
  }

  setOrderBy(orderBy){
    if(this.orderBy === orderBy) {
      this.orderBy = orderBy + ' desc';
    }
    else {
    this.orderBy = orderBy;
    }
    this.loadRooms();
  }

  setNumberOfResults(){
    this.roomsPerPage = this.resultsForm.get('rooms').value;
    this.loadRooms();
  }

  setNumberOfBeds(){
    this.numberOfBeds = this.resultsForm.get('nOfBeds').value;
    this.loadRooms();
  }

  setCity(){
    this.city = this.resultsForm.get('city').value;
    this.loadRooms();
  }
}
