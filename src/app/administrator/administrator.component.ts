import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Clothes } from '../model/clothes';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css']
})
export class AdministratorComponent implements OnInit {
  isVisibleAdd = false;
  isVisibleUpdate = false;
  clothID = "";
  clothes: any = [];
  cloth = new Clothes();
  p:number = 1;
  searchText: string = "";

  imageSrc: string = '';

  create_alert: boolean = false;
  create_alert2: boolean = false;
  create_color = "black";

  update_alert: boolean = false;
  updatecloth = new Clothes();
  clothFormUpdate = new FormGroup({
    update_name: new FormControl(),
    update_price: new FormControl(),
    update_color: new FormControl(),
  });

  clothFormCreate = new FormGroup({
    create_name: new FormControl(),
    create_price: new FormControl(),
    create_color: new FormControl()
  });


  constructor(
    private appService: AppService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getClothes(this.searchText);
    this.validatorUpdateForm();
    this.validatorCreateForm();
  }

  onOpenCreate(){
    this.isVisibleAdd = true;
    this.create_alert2 = false;
    this.create_alert = false;
    this.create_color = "black";
  }

  onCloseCreate(){
    this.isVisibleAdd = false;
  }

  onSearchTextEntered(searchValue: string){
    this.searchText = searchValue;
    this.ngOnInit();
  }

  getClothes(searchText: string){
    this.appService.getClothes(searchText).subscribe((data)=>{
      this.clothes = data;

    })
  }

  onDeleteCloth(id: any){
    this.appService.deleteCloth(id).subscribe(()=>{
      this.ngOnInit();
    });
  }

  validatorCreateForm() {
    this.clothFormCreate = this.formBuilder.group({
      create_name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]],
      create_price: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      create_color: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]]
    });
  }

  validatorUpdateForm() {
    this.clothFormUpdate = this.formBuilder.group({
      update_name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]],
      update_price: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      update_color: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]]
    });
  }

  handleInputChange(event: any) {
    var file = event.dataTransfer ? event.dataTransfer[0] : event.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this.handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  handleReaderLoaded(event: any) {
    let reader = event.target;
    this.imageSrc = reader.result;
    console.log(this.imageSrc)
  }

  onAddPost(){
    
    this.appService.getAllCloth().subscribe((data)=> {
      this.clothes = data;
      
      this.create_alert2 = false;
      this.create_alert = false;
      this.create_color = "black";

      for(this.cloth of this.clothes){
        if(this.cloth.name === this.clothFormCreate.value.create_name){
          this.create_alert2 = true;
          this.create_color = "red";
          return;
        }
      }

      var name = (document.getElementById('create-input-name') as HTMLInputElement).value;
      var price = (document.getElementById('create-input-price') as HTMLInputElement).value;
      var gender = (document.getElementById('create-input-gender') as HTMLInputElement).value;
      var color = (document.getElementById('create-input-color') as HTMLInputElement).value;
      var type = (document.getElementById('create-input-type') as HTMLInputElement).value;
      var size = (document.getElementById('create-input-size') as HTMLInputElement).value;

      if(!this.clothFormCreate.valid){
        this.create_alert = true;
        return;
      }

      this.cloth.name = name;
      this.cloth.price = +price;
      this.cloth.gender = gender;
      this.cloth.color = color.toLocaleLowerCase();
      this.cloth.type = type;
      this.cloth.size = size;
      this.cloth.img = this.imageSrc;

      this.appService.createCloth(this.cloth).subscribe((data) => {
        this.ngOnInit();
      });
      this.onCloseCreate();
      
    })
  }

  onOpenUpdate(id: any){
    console.log("clicked");
    this.isVisibleUpdate = true;
    this.clothID = id;
    this.update_alert = false;
  }

  onCloseUpdate(){
    this.isVisibleUpdate = false;
    this.clothID = "";
  }

  onUpdateCloth(){
    this.update_alert = false;

    var name = (document.getElementById('update-input-name') as HTMLInputElement).value;
    var price = (document.getElementById('update-input-price') as HTMLInputElement).value;
    var gender = (document.getElementById('update-input-gender') as HTMLInputElement).value;
    var color = (document.getElementById('update-input-color') as HTMLInputElement).value;
    var type = (document.getElementById('update-input-type') as HTMLInputElement).value;
    var size = (document.getElementById('update-input-size') as HTMLInputElement).value;

    this.cloth._id = this.clothID;
    this.cloth.name = name;
    this.cloth.price = +price;
    this.cloth.gender = gender;
    this.cloth.color = color.toLocaleLowerCase();
    this.cloth.type = type;
    this.cloth.size = size;

    if(!this.clothFormUpdate.valid){
      this.update_alert = true;
      return;
    }


    this.appService.updateCloth(this.cloth).subscribe((data) => {
      console.log(data);
      this.ngOnInit();
    });
    this.onCloseUpdate();
  }
  

}
