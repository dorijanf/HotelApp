import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { HotelService } from '../services/hotel.service';
import { RoomsService } from '../services/rooms.service';
import { PaginationService } from '../services/pagination.service';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { Hotel } from '../models/hotel';
import { Room } from '../models/room';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-hotel-edit',
  templateUrl: './hotel-edit.component.html',
  styleUrls: ['./hotel-edit.component.scss']
})

export class HotelEditComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';

    resultsForm = this.fb.group({
      rooms: [''],
      nOfBeds: [''],
    })

    hotel$: Observable<Hotel>;
    rooms$: Observable<Room[]>;
    hotelId: number;
    pageNo: any = 1;
    pageNumber: boolean[] = [];
    orderBy: any = 'name';
    numberOfBeds: number;
    faCaretUp = faCaretUp;
    faCaretDown = faCaretDown;

    pageField = [];
    exactPageList: any;
    paginationData: number;
    roomsPerPage: any = 10;
    roomsPerPageResults = [10, 25, 50, 100];
    totalRoomsCount: any;

    constructor(
      private hotelService: HotelService,
      private avRoute: ActivatedRoute,
      private roomsService: RoomsService,
      private fb: FormBuilder,
      private alertService: AlertService,
      public paginationService: PaginationService,
    ) {
    }

    ngOnInit() {
        const hotelIdParam = 'hotelId';
        this.returnUrl = this.avRoute.snapshot.queryParams['returnUrl'] || '/';
        if(this.avRoute.snapshot.params[hotelIdParam]) {
          this.hotelId = this.avRoute.snapshot.params[hotelIdParam];
        }
        this.loadHotel();
        this.pageNumber[0] = true;
        this.loadHotelRooms();
    }

    get f() { return this.registerForm.controls; }

    loadHotel() {
      this.hotel$ = this.hotelService.getHotelById(this.hotelId);
    }

    loadHotelRooms() {
      this.rooms$ = this.roomsService.getRoomsForHotel(this.hotelId, this.pageNo,
        this.roomsPerPage, this.orderBy, this.numberOfBeds);
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
        this.paginationService.exactPageList = this.exactPageList
      }
      this.paginationService.pageOnLoad();
      this.pageField = this.paginationService.pageField;
    }

    showRoomsByPageNumber(page, i) {
      this.pageNumber = [];
      this.pageNumber[i] = true;
      this.pageNo = page;
      this.loadHotelRooms();
    }

    getRoomsCount() {
      this.roomsService.getRoomsCount(this.hotelId, this.pageNo, this.roomsPerPage,
        this.orderBy, this.numberOfBeds, null).subscribe((res: any) => {
          this.totalRoomsCount = res;
          this.totalNoOfPages();
        })
    }

    setOrderBy(orderBy){
      if(this.orderBy === orderBy) {
        this.orderBy = orderBy + ' desc';
      }
      else {
      this.orderBy = orderBy;
      }
      this.loadHotelRooms();
    }

    setNumberOfResults(){
      this.roomsPerPage = this.resultsForm.get('rooms').value;
      this.loadHotelRooms();
    }

    setNumberOfBeds(){
      this.numberOfBeds = this.resultsForm.get('nOfBeds').value;
      this.loadHotelRooms();
    }

    deleteRoom(hotelId: number, roomId: number) {
      this.roomsService.deleteRoom(hotelId, roomId)
        .subscribe(
          data => {
          this.alertService.success('Room successfully deleted!', true);
          window.location.reload();
          },
          (error: any) => {
            this.error = error;
            this.loading = false;
          }
        )
    }
}

