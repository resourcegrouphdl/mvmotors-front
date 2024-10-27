import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { RouterLink } from '@angular/router';
import { MenuAdminModel } from '../../models/menu-admin-model';
import { MenuAdminData } from '../../acces-data-services/menudata';
import { NgFor } from '@angular/common';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterLink,NgFor,RouterOutlet],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit {

  menuAdmin:MenuAdminModel[] = MenuAdminData; 
  estateLog: String = 'Salir';
  menuAdminTitle:String = 'Menu Administrador';

  constructor() { }

  ngOnInit(): void {
    initFlowbite();
    
    
  }



}
