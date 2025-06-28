import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Aula } from '../../models/aula';
import { AulaService } from '../../services/aula.service';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-calendario-aulas',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, ButtonModule, CardModule],
  templateUrl: './calendario-aulas.component.html',
  styleUrl: './calendario-aulas.component.css',
})
export class CalendarioAulasComponent implements OnInit {
  constructor(private aulaService: AulaService, private router: Router) {}

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    locales: [ptBrLocale],

    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
    },
    events: [],
    eventClick: this.onEventClick.bind(this), // importante fazer bind!

    allDaySlot: false,
    editable: false,
    selectable: false,
    validRange: {
      end: new Date(), // bloqueia dias/meses futuros
    },
  };

  ngOnInit(): void {
    this.aulaService.listarAulas().subscribe(
      (
        aulas: {
          id: number;
          dataAula: string;
          aluno_id: number;
          nomeAluno: string;
        }[]
      ) => {
        this.calendarOptions.events = aulas.map((aula) => ({
          title: aula.nomeAluno,
          start: new Date(aula.dataAula),
          allDay: true,
          extendedProps: {
            id: aula.id,
            alunoId: aula.aluno_id,
          },
        }));
      }
    );
  }

  onEventClick(info: any): void {
    const aula = info.event.extendedProps;
    if (aula) {
      console.log(aula);
      // this.router.navigate(['/aulas', aulaId]); // Ex: /aulas/48
    }
  }

  voltarParaListagem(): void {
    this.router.navigate(['']);
  }
}
