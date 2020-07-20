import { Component, OnInit } from '@angular/core';
import { Countries, SquadNumber } from '../interfaces/player';
import { PlayerService } from '../services/player.service';
import { TeamService } from '../services/team.service';
import { take } from 'rxjs/operators';
import { Team } from '../interfaces/team';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-player-dialog',
  templateUrl: './player-dialog.component.html',
  styleUrls: ['./player-dialog.component.scss'],
})
export class PlayerDialogComponent implements OnInit {
  private team: Team;
  public countries = Object.keys(Countries).map((key) => ({
    label: key,
    key: Countries[key],
  }));
  public squadNumber = Object.keys(SquadNumber).map((key) => ({
    label: key,
    key: Countries[key],
  }));

  constructor(
    private playerService: PlayerService,
    private teamService: TeamService
  ) {}

  ngOnInit(): void {
    this.teamService
      .getTeams()
      .pipe(take(1))
      .subscribe((teams) => {
        if (teams.length > 0) {
          this.team = teams[0];
        }
      });
  }

  private newPlayer(playerFormValue): void {
    const key = this.playerService.addPlayer(playerFormValue).key;
    const playerFormValueKey = {
      ...playerFormValue,
      key,
    };
    const formattedTeam = {
      ...this.team,
      players: [
        ...(this.team.players ? this.team.players : []),
        playerFormValueKey,
      ],
    };
    this.teamService.editTeam(formattedTeam);
  }

  onSubmit(playerForm: NgForm): void {
    const playerFormValue = { ...playerForm.value };
    if (playerForm.valid) {
      playerFormValue.leftFooted =
        playerFormValue.leftFooted === '' ? false : true;
    }
    this.newPlayer(playerFormValue);
    window.location.replace('#');
  }
}
