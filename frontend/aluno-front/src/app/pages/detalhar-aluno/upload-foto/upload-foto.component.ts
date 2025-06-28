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

@Component({
  selector: 'app-upload-foto',
  standalone: true,
  imports: [CommonModule, ImageCropperComponent, DialogModule, ButtonModule],
  templateUrl: './upload-foto.component.html',
  styleUrl: './upload-foto.component.css',
})
export class UploadFotoComponent {
  // @Input() fotoUrl: string = '';
  @Output() fotoAtualizada = new EventEmitter<Blob>(); // base64 final

  @Input() reset: any;

  constructor(private cdRef: ChangeDetectorRef) {}
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
      this.resetarCropper();
      this.fotoAtualizada.emit(imagemFinal);
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
        alert('Nenhuma imagem encontrada na área de transferência.');
      })
      .catch((err) => {
        console.error('Erro ao acessar a área de transferência:', err);
        alert(
          'Não foi possível acessar a área de transferência. Isso requer HTTPS ou localhost.'
        );
      });
  }
}
