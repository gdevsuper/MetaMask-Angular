import { Component, OnInit } from '@angular/core';
import {
  UtilityService,
  NftService,
  ConnectService,
} from '../../../_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
const IpfsHttpClient = require('ipfs-http-client');
const ipfs = new IpfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
});

@Component({
  templateUrl: './create-nft.component.html',
  styleUrls: ['./create-nft.component.css'],
})
export class CreateNftComponent implements OnInit {
  constructor(
    private utility: UtilityService,
    private formBuilder: FormBuilder,
    private nftService: NftService,
    private connectService: ConnectService
  ) {}

  createForm: FormGroup;

  ngOnInit(): void {
    // intialize form
    this.createForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      image: [null, [Validators.required]],
      price: [null, [Validators.required]],
    });
  }

  get getCreateForm() {
    return this.createForm.controls;
  }

  convertDataURIToBinary(dataURI) {
    var base64Index = dataURI.indexOf(';base64,') + ';base64,'.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  upload() {
    const file = (<HTMLInputElement>(
      document.getElementById('sign__file-upload')
    )).files[0];
    var self = this;
    const reader = new FileReader();
    let byteArray;

    reader.addEventListener(
      'loadend',
      async function () {
        // convert image file to base64 string

          byteArray = self.convertDataURIToBinary(reader.result);
          self.utility.startLoader('Uploading document....');
          var result = await ipfs.add(byteArray);
          self.utility.startLoader(
            'Document uploaded sucessfully. Please wait...'
          );
          self.utility.startLoader('Data encryption in progress. Please wait...');
          var fianalJSON = self.createForm.value;
          fianalJSON['image'] = `gateway.ipfs.io/ipfs/${result['path']}`;
          fianalJSON['status'] = `AVAILABLE`;
          fianalJSON['currentOwnerWalletAddress'] = self.connectService.account;  
          self.utility.startLoader('Almost finished. Please wait...');
          self.createNFT(fianalJSON);
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  createNFT(data) {
    var self = this;
    this.utility.startLoader();
    this.nftService.createNft(data).subscribe(
      (res) => {
        this.utility.stopLoader();
      },
      (error) => {
        this.utility.stopLoader();
        this.utility.showErrorAlert('Error', error);
      }
    );
  }
}