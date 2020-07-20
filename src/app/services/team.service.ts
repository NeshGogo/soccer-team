import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Team } from '../interfaces/team';


export const TeamsTableHeaders = ['Name', 'Country', 'Players'];

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private teamsDb: AngularFireList<Team>;

  constructor(db: AngularFireDatabase) {
    const teamsTable = '/teams';
    this.teamsDb = db.list(teamsTable, (ref) => ref.orderByChild('name'));
  }

  getTeams(): Observable<Team[]> {
    return this.teamsDb.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((c) => ({
          $key: c.payload.key,
          ...c.payload.val(),
        }));
      })
    );
  }

  addTeam(team: Team): any {
    return this.teamsDb.push(team);
  }

  deleteTeam(id: string): void {
    this.teamsDb.remove(id);
  }

  editTeam(newTeamData): void {
    const $key = newTeamData.$key;
    // Esta funcion es nativa de js y elimina una propiedad
    delete newTeamData.$key;
    this.teamsDb.update($key, newTeamData);
  }
}
