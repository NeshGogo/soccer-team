import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { Player } from '../interfaces/player';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private playersDb: AngularFireList<Player>;

  constructor(db: AngularFireDatabase) {
    const playersTable = '/players';
    this.playersDb = db.list(playersTable, (ref) => ref.orderByChild('name'));
  }

  getPlayers(): Observable<Player[]> {
    return this.playersDb.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((c) => ({
          $key: c.payload.key,
          ...c.payload.val(),
        }));
      })
    );
  }

  addPlayer(player: Player): any{
    return this.playersDb.push(player);
  }

  deletePlayer(id: string): void{
    this.playersDb.remove(id);
  }

  editPlayer(newPlayerData): void{
    const $key = newPlayerData.$key;
    // Esta funcion es nativa de js y elimina una propiedad
    delete newPlayerData.$key;
    this.playersDb.update($key, newPlayerData);
  }
}
