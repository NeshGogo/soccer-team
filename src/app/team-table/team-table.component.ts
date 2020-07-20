import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Team } from '../interfaces/team';
import { TeamService, TeamsTableHeaders } from '../services/team.service';
import { take } from 'rxjs/operators';
import { Countries } from '../interfaces/player';

@Component({
  selector: 'app-team-table',
  templateUrl: './team-table.component.html',
  styleUrls: ['./team-table.component.scss']
})
export class TeamTableComponent implements OnInit {
  public teams$: Observable<Team[]>;
  public tableTeamsHeader = TeamsTableHeaders;

  constructor(private teamService: TeamService) { }

  ngOnInit(): void {
    this.teams$ = this.teamService.getTeams();
    this.teamService.getTeams()
    .pipe(take(1))
    .subscribe( teams => {
      if (teams.length === 0) {
        const team: Team = {
          name: 'The Best Team',
          country: Countries.DominicanRepublic,
          players: null,
        };
        this.teamService.addTeam(team);
      }
    });
  }

}
