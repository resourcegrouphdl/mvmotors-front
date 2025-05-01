import { Component, OnInit, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';
import { initFlowbite } from 'flowbite';
import { BaraInfoSupComponent } from "./shares/bara-info-sup/bara-info-sup.component";
import { NavbarComponent } from "./shares/navbar/navbar.component";
import { TablaclientesComponent } from './shares/tablaclientes/tablaclientes.component';
import { FooterComponent } from './shares/footer/footer.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSonnerToaster, BaraInfoSupComponent, NavbarComponent, FooterComponent,TablaclientesComponent, ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'motoya';

  constructor( private renderer: Renderer2) { }
  ngOnInit(): void {
    initFlowbite();
}



}
