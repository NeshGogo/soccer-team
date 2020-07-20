import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from '../interfaces/player';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-player-table',
  templateUrl: './player-table.component.html',
  styleUrls: ['./player-table.component.scss']
})
export class PlayerTableComponent implements OnInit {

  public players$: Observable<Player[]>;
  public selectedPlayer: Player;
  public showModal: boolean;

  constructor(private playerService: PlayerService) { }

  ngOnInit(): void {
    this.players$ = this.playerService.getPlayers();
  }
  newPlayer(): void{
    this.showModal = true;
    this.selectedPlayer = null;
    setTimeout(() => {
      window.location.replace('#open-modal');
    }, 0 );
  }
  editPlayer(player: Player): void{
    this.selectedPlayer = {...player};
    this.showModal = true;
    setTimeout(() => {
      window.location.replace('#open-modal');
    }, 0 );
  }
  closeDialog(): void{
    this.showModal = false;
  }
}
