import { Component, OnInit, EventEmitter, Output, Input  } from '@angular/core';
import { Clothes } from '../model/clothes';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  clothes: any = [];
  cloth = new Clothes();

  enteredSearchValue: string = '';

  @Output()
  searchTextChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor(
  ) { 
  }

  ngOnInit(): void {
  }

  onSearchTextChanged(){
    this.searchTextChanged.emit(this.enteredSearchValue);
  }

}
