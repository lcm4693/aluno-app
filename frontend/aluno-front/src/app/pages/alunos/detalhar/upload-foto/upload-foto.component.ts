import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { AlunoService } from '../../../../services/aluno.service';
import { Aluno } from '../../../../models/aluno';
import { LoggerService } from '../../../../services/logger.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-upload-foto',
  standalone: true,
  imports: [CommonModule, ImageCropperComponent, DialogModule, ButtonModule],
  templateUrl: './upload-foto.component.html',
  styleUrl: './upload-foto.component.css',
})
export class UploadFotoComponent {
  @Input() aluno!: Aluno;
  @Output() fotoAtualizada = new EventEmitter<string>(); // base64 final

  @Input() reset: any;

  constructor(
    private cdRef: ChangeDetectorRef,
    private alunoService: AlunoService,
    private loggerService: LoggerService,
    private toastService: ToastService
  ) {}
  modalAberta = false;
  imagemEvento: any;
  imagemCortada: Blob | null = null;

  resetarCropper() {
    this.imagemEvento = null;
    this.imagemCortada = null;
    this.imagemCortada = null;
  }

  carregarImagem(event: any) {
    this.imagemEvento = null;
    this.cdRef.detectChanges(); // força o Angular a reagir
    this.imagemEvento = event;
  }

  onImageCropped(event: ImageCroppedEvent) {
    this.imagemCortada = event.blob ?? null;
  }

  salvarFoto() {
    if (this.imagemCortada) {
      const imagemFinal = this.imagemCortada!;

      const formData = new FormData();
      formData.append('foto', imagemFinal, 'foto.png');

      this.alunoService.uploadFoto(this.aluno.id, formData).subscribe({
        next: (res) => {
          this.loggerService.debug('Resposta:', res);
          this.resetarCropper();
          this.fotoAtualizada.emit(res.url);
        },
      });
    }
  }

  colarImagem() {
    navigator.clipboard
      .read()
      .then((items) => {
        for (const item of items) {
          if (
            item.types.includes('image/png') ||
            item.types.includes('image/jpeg')
          ) {
            item.getType(item.types[0]).then((blob) => {
              const file = new File([blob], 'imagem-colada.png', {
                type: blob.type,
              });

              // ✅ Simular um input:file com FileList real
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(file);

              const fakeInputEvent = new Event('change');
              Object.defineProperty(fakeInputEvent, 'target', {
                writable: false,
                value: { files: dataTransfer.files },
              });

              this.carregarImagem(fakeInputEvent);
            });
            return;
          }
        }
        this.toastService.error(
          'Erro ao colar imagem',
          'Nenhuma imagem encontrada na área de transferência'
        );
      })
      .catch((err) => {
        this.loggerService.error(
          'Erro ao acessar a área de transferência:',
          err
        );
        this.toastService.error(
          'Erro ao colar imagem',
          'Não foi possível acessar a área de transferência. Isso requer HTTPS ou localhost.'
        );
      });
  }
}
