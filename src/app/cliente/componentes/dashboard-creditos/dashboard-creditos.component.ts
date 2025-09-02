import { Component } from '@angular/core';
import { DashboardOverviewComponentComponent } from '../dashboard-overview-component/dashboard-overview-component.component';
import { ClientsTableComponent } from '../clients-table/clients-table.component';
import { MaquetaComponent } from "../maqueta/maqueta.component";

@Component({
  selector: 'app-dashboard-creditos',
  standalone: true,
  imports: [DashboardOverviewComponentComponent, ClientsTableComponent, MaquetaComponent],
  templateUrl: './dashboard-creditos.component.html',
  styleUrl: './dashboard-creditos.component.css'
})
export class DashboardCreditosComponent {

}
