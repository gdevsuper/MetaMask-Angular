import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
const Web3 = require('web3');
declare let require: any;
declare let window: any;
const tokenAbi = require('../contract/busd_abi.json');
const tokenAbis = require('../contract/abis.json');
const ethers = require('ethers')
@Injectable({
  providedIn: 'root',
})
export class ConnectService {
  public account: any = null;
  private readonly web3: any;
  private enable: any;
  private contract: any;
  private contract1: any;

  constructor() {
    if (window.ethereum === undefined) {
      alert('Non-Ethereum browser detected. Install MetaMask');
    } else {
      if (typeof window.web3 !== 'undefined') {
        this.web3 = window.web3.currentProvider;
      } else {
        this.web3 = new Web3.providers.HttpProvider('http://localhost:8545');
      }

      console.log('transfer.service :: constructor :: window.ethereum');
      window.web3 = new Web3(window.ethereum);
      console.log('transfer.service :: constructor :: this.web3');
      console.log(this.web3);
      this.enable = this.enableMetaMaskAccount();
      console.log(this.enable);
    }
       if (typeof window.web3 !== 'undefined') {
         window.ethereum.on('accountsChanged', function (accounts) {
           window.location.reload();
         });
         window.ethereum.on('networkChanged', function (networkId) {
           window.location.reload();
         });
       }
  }

  private async enableMetaMaskAccount(): Promise<any> {
    let enable = false;
    await new Promise(async (resolve, reject) => {
      if (window.ethereum) {
        enable = await window.ethereum.enable();

        if (enable) {
          this.getUserBalance();
          // this.connectContract();
        }
      }
    });
    return Promise.resolve(enable);
  }

  public async convertJSONtoHEX(value) {
    return window.web3.utils.toHex(value);
  }

  public async connectContract(address) {
    this.contract = await new window.web3.eth.Contract(tokenAbi, address);
  }

  public async buyToken(amount) {
    // var contract = await this.connectContract();
    this.contract = await new window.web3.eth.Contract(
      tokenAbi,
      environment.CONTRACT_ADDRESS
    );
    amount = amount * 10 ** 18;
    var receipt = await this.contract.methods
      .transfer(environment.OWNER_ADDRESS, amount.toString())
      .send({ from: this.account })
      .once('receipt', (receipt) => {
        console.log('receipt==========', receipt);
      })
      .catch((error) => {
        console.log('error==========', error);
      });

    return receipt;
  }

  public async getTotalSupply(address) {
    let jsonData = [];
    await this.connectContract(address);
    var symbol = await this.contract.methods.symbol().call();
    var name = await this.contract.methods.name().call();
    var supply = await this.contract.methods.totalSupply().call();
    for (let index = 1; index <= supply; index++) {
      const uri = await this.getTokenDetails(index);
      jsonData.push({
        symbol: symbol,
        name: name,
        uri: uri,
        supply: supply,
        contract: address,
        tokenId: index,
      });
    }

    return jsonData;
  }

  async getTokenDeatil(address, nftId) {
    await this.connectContract(address);
    const symbol = await this.contract.methods.symbol().call();
    const name = await this.contract.methods.name().call();
    const uri = await this.getTokenDetails(nftId);
    return { symbol, name, uri };
  }

  async getTokenCount(address) {
    console.log(address);

    await this.connectContract(address);
    var supply = await this.contract.methods.totalSupply().call();
    return supply;
  }

  public async getTokenDetails(id) {
    var uri = await this.contract.methods.tokenURI(id).call();
    return uri;
  }

  private async getAccount(): Promise<any> {
    console.log('transfer.service :: getAccount :: start');
    if (this.account == null) {
      this.account = (await new Promise((resolve, reject) => {
        console.log('transfer.service :: getAccount :: eth');
        console.log(window.web3.eth);
        window.web3.eth.getAccounts((err, retAccount) => {
          console.log('transfer.service :: getAccount: retAccount');
          console.log(retAccount);
          console.log(err);
          if (retAccount.length > 0) {
            this.account = retAccount[0];
            localStorage.setItem('walletAddress', this.account);
            resolve(this.account);
          } else {
            alert('No accounts found.');
            reject('No accounts found.');
          }
          if (err != null) {
            alert('Not able to retrieve account');
            reject('Error retrieving account');
          }
        });
      })) as Promise<any>;
    }
    return Promise.resolve(this.account);
  }
  public async getUserBalance(): Promise<any> {
    const account = await this.getAccount();
    console.log('transfer.service :: getUserBalance :: account');
    console.log(account);
    return new Promise((resolve, reject) => {
      window.web3.eth.getBalance(account, function (err, balance) {
        console.log('transfer.service :: getUserBalance :: getBalance');
        console.log(balance);
        if (!err) {
          const retVal = {
            account: account,
            balance: balance,
          };
          console.log(
            'transfer.service :: getUserBalance :: getBalance :: retVal'
          );
          console.log(retVal);
          resolve(retVal);
        } else {
          reject({ account: 'error', balance: 0 });
        }
      });
    }) as Promise<any>;
  }

  public async getWalletBlalnce() {
    let enable = await window.ethereum.enable();
    console.log('enable', enable);

    if (enable && enable.length > 0) {
      this.account = enable[0];
      localStorage.setItem('walletAddress', this.account);
      // await this.getUserBalance();
    }
    
  await this.connectContract(environment.CONTRACT_ADDRESS);
      let balanceNFT = await this.contract.methods
        .balanceOf(this.account)
        .call();
      console.log('balanceNFT info ', balanceNFT);
      if (balanceNFT > 0) {
        balanceNFT = balanceNFT / Math.pow(10, 18);
        // balanceNFT = Math.round(balanceNFT);
      }
      return balanceNFT;
    
  }

  async getAddress() {
    if (typeof window.web3 !== 'undefined') {
      let enable = await window.ethereum.enable();
      console.log('enable', enable);

      if (enable && enable.length > 0) {
        this.account = enable[0];
        localStorage.setItem('walletAddress',this.account)
        // await this.getUserBalance();
        return this.account
      } else {
         return '';
      }
    } else {
      return ''
    }
  }

  public async getOwnerOfToken(tokenId) {
    console.log(tokenId);
    const ownerAddress = await this.contract1.methods.ownerOf(tokenId).call();
    console.log('balanceNFT info ', ownerAddress);
    return ownerAddress;
  }

  public async transferOwnership(address) {
    var response = await this.contract.methods
      .transferOwnership(address)
      .send({ from: this.account })
      .once('receipt', (receipt) => {
        console.log('receipt==========', receipt);
      })
      .catch((error) => {
        console.log('error==========', error);
      });

    return response;
  }

  private async connectContractETH(address) {
    this.contract1 = await new window.web3.eth.Contract(tokenAbis, address);
  }

  public async setApprover(tokenId, address) {
    await this.connectContractETH(address);
    const isOwner = await this.getOwnerOfToken(tokenId);
    console.log('isOwner.toLowerCase() ', isOwner.toLowerCase());
    console.log('this.account.toLowerCase() ', this.account.toLowerCase());
    
    if (isOwner.toLowerCase() === this.account.toLowerCase()) {
      const response = await this.contract1.methods
        .approve(environment.OWNER_ADDRESS, tokenId)
        .send({ from: this.account })
        .once('receipt', (receipt) => {
          console.log('receipt==========', receipt);
        })
        .catch((error) => {
          console.log('error==========', error);
        });

      return response;
    } else {
      alert('Please select correct metamask account');
      return undefined;
    }
  }

  public async grantPermissionForBidAmount(amount) {
    console.log('amount', amount);
    let allowance = await this.checkAllowance();
    if (allowance !== 0){
      let resp = Math.pow(10, -18) * parseInt(await this.checkAllowance());
      console.log('resp', resp);
      amount = amount + resp;
      console.log('amount', amount);
    }


     amount = ethers.utils.parseUnits(amount.toString(), 18);
    

      await this.connectContract(environment.CONTRACT_ADDRESS);
      const response = await this.contract.methods
        .approve(environment.OWNER_ADDRESS, amount)
        .send({ from: this.account })
        .once('receipt', (receipt) => {
          console.log('receipt==========', receipt);
        })
        .catch((error) => {
          console.log('error==========', error);
        });

      return response;
    
  }

  async checkAllowance() {
    await this.connectContract(environment.CONTRACT_ADDRESS);
    const response = await this.contract.methods
      .allowance(this.account, environment.OWNER_ADDRESS)
      .call();
    
    console.log(response);
  
    return response;
  }
}
