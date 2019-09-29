import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class BankService {
  bankAPI: string = "https://vast-shore-74260.herokuapp.com/banks?city=";

  constructor(private http: HttpClient) {}

  getBanksDetail(city: string): Observable<Object> {
    return this.http.get(this.bankAPI + city).pipe(
      retry(1), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
  }

  // API error handling can be implemented here...

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError("Something bad happened; please try again later.");
  }
}

export interface Bank {
  ifsc: string;
  bank_id: number;
  branch: string;
  address: string;
  city: string;
  district: string;
  state: string;
  bank_name: string;
}
