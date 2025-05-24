import { Component ,inject,OnInit,Renderer2} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  _routes = inject(Router);

  constructor(private renderer: Renderer2) {
    
  }

  ngOnInit(): void {
    this.loadTikTokScript();
  }
  loadTikTokScript() {
    const script = this.renderer.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    this.renderer.appendChild(document.body, script);
  }
  

  
  

  
  
  navegarTerminosYCondiciones() {
    this._routes.navigate(['terminos-y-condiciones']);
  }
  navegarLibroReclamaciones() {
    this._routes.navigate(['libro-de-reclamaciones']);
  }
  navegarPoliticasPrivacidad() {
    this._routes.navigate(['politicas-de-privacidad']);
  }

}
