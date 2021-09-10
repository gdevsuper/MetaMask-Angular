import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NftService, UtilityService } from '../../../_services';
@Component({
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css'],
})
export class MarketplaceComponent implements OnInit {
  constructor(
    private nftService: NftService,
    private utility: UtilityService,
    private formBuilder: FormBuilder
  ) {
    this.utility.updatePageSEO(
      'NFT Marketplace | Buy and Sell your NFT, and NFT Money. NFT Collections, Crypto artworks.',
      'Buy, Sell and trade your NFTs and NFT Money Secured with blockchain.'
    );
  }

  activeTab = 'grid';
  nfts: any = [];
  currentDate = new Date();
  filteredNfts: any = [];
  uriResponse: any = [];
  collectionList: any = [];
  selectedCollection: any = [];
  filterForm: FormGroup;
  p: number = 1;

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      filterItems: [[]],
    });
    this.getAllNfts();
  }

  getAllNfts() {
    var self = this;
    this.utility.startLoader();
    this.nftService.getNfts().subscribe(
      (res) => {
        this.utility.stopLoader();
        this.nfts = res;
        this.filteredNfts = res;
        this.getFilterList();
        this.nfts.forEach((element) => {
          self.getNftDetailFromURI(element.uri, element.id);
        });
      },
      (error) => {
        this.utility.stopLoader();
        this.utility.showErrorAlert('Error', error);
      }
    );
  }

  getFilterList() {
    this.nfts.forEach((element) => {
      if (!this.collectionList[element.contract.contract]) {
        this.collectionList[element.contract.contract] = element.contract.name;
      }
    });
  }

  onChangeCategory(event, item: any) {
    // Use appropriate model type instead of any
    if (this.selectedCollection.indexOf(item) > -1) {
      const index = this.selectedCollection.indexOf(item);
      if (index > -1) {
        this.selectedCollection.splice(index, 1);
      }
    } else {
      this.selectedCollection.push(item);
    }
  }

  applyFilter() {
    this.getFilteredItems();
  }

  getFilteredItems() {
    var self = this;
    if (this.selectedCollection.length > 0) {
      self.filteredNfts = self.nfts.filter((element) => {
        return self.selectedCollection.indexOf(element.contract.contract) > -1;
      });
    } else {
      self.filteredNfts = self.nfts;
    }
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
