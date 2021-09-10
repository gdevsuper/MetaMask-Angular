import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
declare var $: any;
import { NftService, UtilityService } from '../../_services';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-live-auction',
  templateUrl: './live-auction.component.html',
  styleUrls: ['./live-auction.component.css'],
})
export class LiveAuctionComponent implements OnInit {
  constructor(
    private nftService: NftService,
    private utility: UtilityService,
    private spinner: NgxSpinnerService
  ) {}

  nfts: any = [];
  currentDate = new Date();
  uriResponse: any = [];

  ngOnInit(): void {
    this.spinner.show();
  }

  ngAfterViewInit(): void {
    this.getAllNfts();
  }

  reloadCarousel() {
    $('.main__carousel--live').owlCarousel({
      mouseDrag: true,
      touchDrag: true,
      dots: true,
      loop: false,
      autoplay: true,
      autoplayHoverPause: true,
      autoplayTimeout: 5000,
      smartSpeed: 600,
      margin: 20,
      autoHeight: true,
      responsive: {
        0: {
          items: 1,
        },
        576: {
          items: 2,
        },
        768: {
          items: 3,
          margin: 30,
        },
        992: {
          items: 4,
          margin: 30,
        },
        1200: {
          items: 4,
          margin: 30,
          mouseDrag: false,
          dots: false,
        },
      },
    });
  }

  getAllNfts() {
    var self = this;
    this.utility.startLoader();
    this.nftService.getNfts().subscribe(
      (res) => {
        this.nfts = res;
        this.nfts.forEach((element) => {
          self.getNftDetailFromURI(element.uri, element.id);
        });
        this.utility.stopLoader();
        setTimeout(() => {
          this.reloadCarousel();
          this.spinner.hide();
        }, 5000);
      },
      (error) => {
        this.utility.stopLoader();
        this.utility.showErrorAlert('Error', error);
      }
    );
  }

  getNftDetailFromURI(url, id) {
    this.nftService.getNftByURL(url).subscribe(
      (res) => {
        this.uriResponse[id] = res;
      },
      (error) => {}
    );
  }

  convertDate(date) {
    return new Date(date);
  }
}
