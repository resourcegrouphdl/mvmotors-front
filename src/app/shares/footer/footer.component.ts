import { Component ,OnInit,Renderer2} from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {

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
  

}
