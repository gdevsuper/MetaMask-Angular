import { Component, OnInit } from '@angular/core';
import { UtilityService, AuthenticationService, ConnectService } from '../../_services';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  userName: string;
  userRole: string;

  constructor(
    private utility: UtilityService,
    private authService: AuthenticationService,
    private router: Router,
    private connectService: ConnectService
  ) {}

  balance: any = 0;
  walletAddres: any = '';

  async ngOnInit() {
    this.userName = JSON.parse(localStorage.getItem('user'))
      ? JSON.parse(localStorage.getItem('user'))['name']
      : '';
    this.userRole = JSON.parse(localStorage.getItem('user'))
      ? JSON.parse(localStorage.getItem('user'))['role']
      : '';
  }

  async ngAfterViewInit() {
    this.balance = await this.connectService.getWalletBlalnce();
    console.log(this.balance);
    this.walletAddres = await this.connectService.getAddress();
    console.log(this.walletAddres);
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
}  
