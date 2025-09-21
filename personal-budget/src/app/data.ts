import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Data {

  budgetData: any[] = [];

  constructor(private http: HttpClient) { }

  getBudget(callback: (data: any[]) => void): void {
    if (this.budgetData.length) { // 4
      callback(this.budgetData); // 5
    } else {
      this.http.get<any>('http://localhost:3000/budget')
        .subscribe(res => {
          this.budgetData = res.myBudget.map((item: any) => ({
            label: item.title,
            value: item.budget
          }));
          callback(this.budgetData); // 8
        });
    }
  }


}
