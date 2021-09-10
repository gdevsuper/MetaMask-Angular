import { Component, OnInit } from '@angular/core';
import { UserService, UtilityService, NftService, ConnectService } from '../../../_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../../../_helpers/mustMatch.validator';
import { environment } from 'src/environments/environment';
@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private userService: UserService,
    private utility: UtilityService,
    private formBuilder: FormBuilder,
    private nftService: NftService,
    private connectService: ConnectService
  ) {
   
  }

  // get user id from localstorage
  userId = JSON.parse(localStorage.getItem('user'))
    ? JSON.parse(localStorage.getItem('user'))['id']
    : '';
  userProfile: any = {};
  profileForm: FormGroup;
  passwordForm: FormGroup;
  profilePicForm: FormGroup;
  uriResponse: any = [];
  walletAddres: string = '';
  imgBaseUrl = environment.IMG_BASE_URL;

  async ngOnInit() {
    // intialize Password form
    this.passwordForm = this.formBuilder.group(
      {
        // old_password: [null, Validators.required],
        password: [null, [Validators.required, Validators.minLength(6)]],
        confirm_password: [
          null,
          [Validators.required, Validators.minLength(6)],
        ],
      },
      {
        validator: [MustMatch('password', 'confirm_password')],
      }
    );

    this.profilePicForm = this.formBuilder.group({
      profilePic: [Validators.required],
    });

    // intialize Profile form
    this.profileForm = this.formBuilder.group({
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      about_us: [null, [Validators.required]],
    });

    await this.connectService.getUserBalance();
    this.getUserProfile();
  }

  get getPasswordForm() {
    return this.passwordForm.controls;
  }

  get getProfileForm() {
    return this.profileForm.controls;
  }

  getUserProfile() {
    var self = this;
    self.walletAddres = localStorage.getItem('walletAddress');
    console.log('self.walletAddres', self.walletAddres);

    this.utility.startLoader();
    this.userService
      .getUserProfileInfo(self.walletAddres.toLocaleLowerCase())
      .subscribe(
        (res) => {
          this.userProfile = res;             
           this.utility.updatePageSEO(
             this.userProfile.user.name + ' | NFT Marketplace',
             this.userProfile.user.name + ' | NFT Marketplace'
           );
          this.profileForm.patchValue({
            name: this.userProfile.user.name,
            email: this.userProfile.user.email,
            about_us: this.userProfile.user.about_us,
          });
          this.userProfile.nfts.forEach((element) => {
            self.getNftDetailFromURI(element.uri, element.id);
          });
          this.userProfile.offers.forEach((element) => {
            self.getNftDetailFromURI(element.nft.uri, element.nft.id);
          });
          this.userProfile.bids.forEach((element) => {
            self.getNftDetailFromURI(element.nft.uri, element.nft.id);
          });

          this.utility.stopLoader();
        },
        (error) => {
          this.utility.stopLoader();
          this.utility.showErrorAlert('Error', error);
        }
      );
  }

  changePasswordAction() {
    this.updateProfile({ password: this.passwordForm.value.password });
    this.passwordForm.reset();
  }

  updateProfileAction() {
    this.updateProfile(this.profileForm.value);
  }

  updateProfile(value) {
    this.utility.startLoader();
    this.userService.updateUser(this.userId, value).subscribe(
      (res) => {
        this.getUserProfile();
        this.utility.showSuccessAlert(
          'Success',
          'User Information Updated Succesfully'
        );
        this.utility.stopLoader();
      },
      (error) => {
        this.utility.stopLoader();
        this.utility.showErrorAlert('Error', error);
      }
    );
  }
  convertAmount(item: any) {
    return item.transactionDetail.events
      ? item.transactionDetail?.events?.Transfer?.returnValues?.value *
          Math.pow(10, -18)
      : 'NA';
  }

  getNftDetailFromURI(url, id) {
    console.log(url);

    if (!this.uriResponse[id]) {
      this.nftService.getNftByURL(url).subscribe(
        (res) => {
          this.uriResponse[id] = res;
        },
        (error) => {}
      );
    }
  }

  fileChangeEvent(e: File[], type: string) {
    console.log(type);

    console.log(e);

    this.utility.startLoader();
    this.userService.uploadPicture(e[0], type).subscribe(
      (res) => {
        
        this.utility.showSuccessAlert(
          'Success',
          'User Information Updated Succesfully'
        );
        this.utility.stopLoader();
        this.userProfile.user = res;
      },
      (error) => {
        this.utility.stopLoader();
        this.utility.showErrorAlert('Error', error);
      }
    );
  }
}
