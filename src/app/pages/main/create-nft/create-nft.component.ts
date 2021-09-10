import { Component, OnInit } from '@angular/core';
import {
  UtilityService,
  NftService,
} from '../../../_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './create-nft.component.html',
  styleUrls: ['./create-nft.component.css'],
})
export class CreateNftComponent implements OnInit {
  constructor(
    private utility: UtilityService,
    private formBuilder: FormBuilder,
    private nftService: NftService
  ) {}

  createForm: FormGroup;

  ngOnInit(): void {
    // intialize form
    this.createForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      image: [null, [Validators.required]],
      ownerWalletAddress: [null, [Validators.required]],
    });
  }

  get getCreateForm() {
    return this.createForm.controls;
  }
  
}
