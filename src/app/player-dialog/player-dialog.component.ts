import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Countries, SquadNumber, Player } from '../interfaces/player';
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

  @Input() player: Player;
  @Output() closeDialog: EventEmitter<boolean> = new EventEmitter();
  private team: Team;
  public countries = Object.keys(Countries).map((key) => ({
    label: key,
    key: Countries[key],
  }));

  public squadNumber = Object.keys(SquadNumber)
    .slice(Object.keys(SquadNumber).length / 2)
    .map((key) => ({
      label: key,
      key: SquadNumber[key],
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
    const players = this.team.players.length > 0 ? this.team.players : [];
    console.log(players);
    const formattedTeam = {
      ...this.team,
      players: [...players, playerFormValueKey],
    };
    console.log(formattedTeam);
    this.teamService.editTeam(formattedTeam);
  }

  private editPlayer(playerFormValue): void {
    const playerFormValueWithKey = {
      ...playerFormValue,
      $key: this.player.$key,
    };
    const playerFormValueWithFormattedKey = {
      ...playerFormValue,
      key: this.player.$key,
    };
    const moddifiedPlayers = this.team.players
      ? this.team.players.map((player: any) => {
          return player.key === this.player.$key
            ? playerFormValueWithFormattedKey
            : player;
        })
      : this.team.players;
    const formattedTeam = {
      ...this.team,
      players: [
        ...(moddifiedPlayers
          ? moddifiedPlayers
          : [playerFormValueWithFormattedKey]),
      ],
    };
    this.playerService.editPlayer(playerFormValueWithKey);
    this.teamService.editTeam(formattedTeam);
  }

  onSubmit(playerForm: NgForm): void {
    console.log(playerForm.value);
    const playerFormValue = { ...playerForm.value };
    console.log(playerFormValue);
    if (playerForm.valid) {
      if (this.player) {
        this.editPlayer(playerFormValue);
      } else {
        this.newPlayer(playerFormValue);
      }
    }
    
    this.onClose();
    window.location.replace('#');
  }

  onClose(): void {
    this.closeDialog.emit(true);
  }
}
