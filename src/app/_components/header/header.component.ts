import { Component, OnInit } from '@angular/core';
import { UtilityService, AuthenticationService, ConnectService, NftService } from '../../_services';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  userName: string;
  userRole: string;
  searchTerm: string;

  constructor(
    private utility: UtilityService,
    private authService: AuthenticationService,
    private router: Router,
    private formBuilder: FormBuilder,
    private nftService: NftService,
    private connectService: ConnectService
  ) {
    
  }

  balance: any = 0;
  walletAddres: any = '';
  searchForm: FormGroup;

  async ngOnInit() {
    this.searchForm = this.formBuilder.group({
      search: [Validators.required],
    });
    this.userName = JSON.parse(localStorage.getItem('user'))
      ? JSON.parse(localStorage.getItem('user'))['name']
      : '';
    this.userRole = JSON.parse(localStorage.getItem('user'))
      ? JSON.parse(localStorage.getItem('user'))['role']
      : '';
  }

  async ngAfterViewInit() {
    this.walletAddres = await this.connectService.getAddress();
  }

  logoutAction() {
    this.authService.logout().subscribe(
      (res) => {
        this.utility.stopLoader();
        this.utility.showSuccessAlert('Success', 'Logout Successfully');
        window.location.reload();
      },
      (error) => {
        localStorage.removeItem('user');
        this.utility.stopLoader();
        this.utility.showErrorAlert('Error', error);
        window.location.reload();
      }
    );
  }

  search() {
    console.log('adfa');
    
    if(this.searchTerm !== ''){
      this.router.navigate(['search', this.searchTerm]);
    }
  }

  setSearchValue(text) {
    this.searchTerm = text;
  }
}  
