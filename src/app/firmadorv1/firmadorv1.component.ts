import { Component, OnInit } from '@angular/core';
import { FreeTextEditorAnnotation, NgxExtendedPdfViewerModule, NgxExtendedPdfViewerService, PageRenderEvent, PDFPageView, StampEditorAnnotation } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-firmadorv1',
  standalone: true,
  imports: [NgxExtendedPdfViewerModule],
  templateUrl: './firmadorv1.component.html',
  styleUrl: './firmadorv1.component.scss'
})
export class Firmadorv1Component implements OnInit {

  image: HTMLImageElement = new Image(); // Propiedad para la imagen
  imageWidth: number = 0; // Almacena el ancho de la imagen original
  imageHeight: number = 0; // Almacena la altura de la imagen original
  blobImagen: Blob | null | void = null;

  coordinates: { x: number; y: number; pageNum: number; }[] = [];

  constructor(private pdfService: NgxExtendedPdfViewerService) {}

  onPageRender(event: PageRenderEvent){
    const sourceelement: PDFPageView = event.source
    const elemento = event.source.canvas
    elemento?.addEventListener('click', (event) => this.onCanvasClick(event, sourceelement.id, sourceelement));
    console.log(sourceelement.id)
    console.log(elemento)
  }

  onCanvasClick(event: MouseEvent, pageNum: number, source: PDFPageView) {
    const canvas: HTMLCanvasElement = event.target as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();

    // Obtener las coordenadas ajustadas por el factor de escala
    const scale = source.scale; // Escala del PDFPageView actual
    const x = (event.clientX - rect.left) * scale; // Ajustar X por la escala
    const y = (event.clientY - rect.top) * scale;  // Ajustar Y por la escala

    // Imprimir valores
    console.log('Scale:', scale);
    console.log('X (ajustado):', x);
    console.log('Y (ajustado):', y);

    const pageWidth = source.viewport.width; // Supongamos que esto te da la anchura de la página del PDF
    const correctedX = pageWidth - Math.abs(x); // Ajuste si es necesario
    const pageHeight = source.viewport.height; // Supongamos que esto te da la altura de la página del PDF
    const correctedY = pageHeight - Math.abs(y); // Ajuste para coordenadas Y negativas

    // Imprimir valores corregidos
    console.log('Page Width:', pageWidth);
    console.log('Corrected X:', correctedX);
    console.log('Page Height:', pageHeight);
    console.log('Corrected Y:', correctedY);

    // Calcular el nuevo tamaño (10% del tamaño original)
    const newWidth = this.imageWidth * 0.1 / scale;  // Ajustar por escala
    const newHeight = this.imageHeight * 0.1 / scale;  // Ajustar por escala

    // Imprimir nuevos tamaños
    console.log('New Width:', newWidth);
    console.log('New Height:', newHeight);
    // Dibujar la imagen en las coordenadas del clic con el nuevo tamaño
    this.addImage(correctedX, correctedY, pageNum - 1, newWidth, newHeight);

    // Guardar las coordenadas junto con el número de página
    this.coordinates.push({ x: correctedX - newWidth / 2, y: correctedY - newHeight / 2, pageNum: pageNum });
  }


  public async addImage(x: number, y: number, pageNum: number, widthImage: number, heightImage: number): Promise<void> {
    console.log(`Coordenadas de clic - x: ${x}, y: ${y}`);
  
    // Crea una anotación de texto temporal como prueba
    this.blobImagen = await this.getImageBlob('assets/imagenFirma.jpeg').then((imageBlobUrl) => {
      const annotation: StampEditorAnnotation = {
        annotationType: 13,
        pageIndex: pageNum,
        bitmapUrl: imageBlobUrl!,
        rect: [y, x, y + heightImage, x + widthImage],
        rotation: 0
      };
  
      this.pdfService.addEditorAnnotation(annotation);
    });
  }

  getImageBlob(imageUrl: string): Promise<Blob | null> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous'; // Necesario si la imagen es de otro dominio
      img.src = imageUrl;
  
      img.onload = () => {
        // Crear un canvas y dibujar la imagen en él
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
  
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          
          // Convertir el canvas a Blob
          canvas.toBlob((blob: Blob | null) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert image to Blob.'));
            }
          });
        } else {
          reject(new Error('Failed to get canvas context.'));
        }
      };
  
      img.onerror = () => {
        reject(new Error('Failed to load image.'));
      };
    });
  }
  

  onClick(event: MouseEvent): void{
    console.log(this.pdfService.currentPageIndex());
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.image.src = 'assets/imagenFirma.jpeg';
    this.image.onload = () => {
      this.imageWidth = this.image.width; // Guarda el ancho original
      this.imageHeight = this.image.height; // Guarda la altura original
    };
  }
}
