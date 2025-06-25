import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-cidade-pais-span',
  standalone: true,
  imports: [CommonModule, TooltipModule],
  templateUrl: './cidade-pais-span.component.html',
  styleUrl: './cidade-pais-span.component.css',
})
export class CidadePaisSpanComponent {
  @Input() cidade?: string;
  @Input() pais?: string;

  retornarUrlMaps() {
    const arrayCidade: string[] = this.cidade ? this.cidade?.split(',') : [];
    if (this.pais) {
      arrayCidade[arrayCidade.length] = this.pais;
    }

    let retorno = 'https://www.google.com/maps/place/';

    let acumulador = '';
    arrayCidade.forEach((place) => {
      acumulador += '+' + place + ',';
    });

    acumulador = acumulador.replace('+', '');

    return acumulador != null ? retorno + acumulador : null;
  }
}
