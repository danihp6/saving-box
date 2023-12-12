import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment';
import { Box } from '../models/SavingBox';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoxesService {

  constructor(private http: HttpClient) { }

  getBoxes() {
    return this.http.get<{ boxes: Box[] }>(`${environment.api}/boxes/test`);
  }

  getBox(id: string) {
    return this.http.get<{ box: Box }>(`${environment.api}/boxes/test/${id}`).pipe(
      map(response => {
        response.box.purchasedItems?.forEach(i => {
          i.date = new Date(i.date);
        });
        return response;
      })
    );
  }

  addBox(box: Partial<Box>) {
    return this.http.post<{ box: Box }>(`${environment.api}/boxes`, {
      box
    });
  }

  deleteBox(id: string, owner: string) {
    return this.http.delete(`${environment.api}/boxes`, {
      body: {
        id,
        owner
      }
    });
  }

  editBox(box: Box) {
    return this.http.put<{ box: Box }>(`${environment.api}/boxes`, {
      box
    });
  }
}
