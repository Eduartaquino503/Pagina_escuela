import { Injectable } from '@angular/core';

export interface ImagenGrado {
  seccion: string;
  blob: Blob;
  url: string;
  activada: boolean;
  fecha: Date;
}

export interface ImagenSlider {
  id: number;
  blob: Blob;
  url: string;
  titulo: string;
  activada: boolean;
  fecha: Date;
}

export interface ImagenGaleria {
  id: number;
  blob: Blob;
  url: string;
  titulo: string;
  activada: boolean;
  fecha: Date;
}

@Injectable({ providedIn: 'root' })
export class ImageDBService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'CEWAS_ImageDB';
  private readonly DB_VERSION = 1;

  constructor() {
    this.initDB();
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      
      request.onerror = () => {
        console.error('[ImageDB] Error al abrir IndexedDB:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ [ImageDB] Inicializada correctamente en el navegador');
        resolve();
      };
      
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('imagenes_grado')) {
          const store = db.createObjectStore('imagenes_grado', { keyPath: 'seccion' });
          store.createIndex('fecha', 'fecha');
        }
        
        if (!db.objectStoreNames.contains('slider')) {
          const store = db.createObjectStore('slider', { keyPath: 'id' });
          store.createIndex('fecha', 'fecha');
          store.createIndex('activada', 'activada');
        }
        
        if (!db.objectStoreNames.contains('galeria')) {
          const store = db.createObjectStore('galeria', { keyPath: 'id' });
          store.createIndex('fecha', 'fecha');
          store.createIndex('activada', 'activada');
        }
        
        console.log('✅ [ImageDB] Estructura de tablas locales sincronizada');
      };
    });
  }

  private async ensureDB(): Promise<void> {
    if (this.db) return;
    await this.initDB();
  }

  // ========== IMÁGENES POR GRADO ==========
  async guardarImagenGrado(seccion: string, file: File, activada: boolean): Promise<void> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['imagenes_grado'], 'readwrite');
      const store = transaction.objectStore('imagenes_grado');
      
      const url = URL.createObjectURL(file);
      
      const imagen: ImagenGrado = {
        seccion: seccion,
        blob: file,
        url: url,
        activada: activada,
        fecha: new Date()
      };
      
      const request = store.put(imagen);
      
      request.onsuccess = () => {
        console.log(`✅ [ImageDB] Caché local guardada para: ${seccion}`);
        resolve();
      };
      
      request.onerror = () => {
        console.error('[ImageDB] Error al persistir objeto local:', request.error);
        reject(request.error);
      };
    });
  }

  async obtenerImagenGrado(seccion: string): Promise<{ url: string; activada: boolean } | null> {
    await this.ensureDB();
    
    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['imagenes_grado'], 'readonly');
      const store = transaction.objectStore('imagenes_grado');
      const request = store.get(seccion);
      
      request.onsuccess = () => {
        if (request.result) {
          // CORREGIDO: Liberación explícita de memoria previa antes de reasignar
          if (request.result.url) {
            URL.revokeObjectURL(request.result.url);
          }
          const newUrl = URL.createObjectURL(request.result.blob);
          resolve({ url: newUrl, activada: request.result.activada });
        } else {
          resolve(null);
        }
      };
      
      request.onerror = () => resolve(null);
    });
  }

  async eliminarImagenGrado(seccion: string): Promise<void> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['imagenes_grado'], 'readwrite');
      const store = transaction.objectStore('imagenes_grado');
      const request = store.delete(seccion);
      
      request.onsuccess = () => {
        console.log(`🗑️ [ImageDB] Registro eliminado de caché: ${seccion}`);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  async listarImagenesGrado(): Promise<ImagenGrado[]> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['imagenes_grado'], 'readonly');
      const store = transaction.objectStore('imagenes_grado');
      const request = store.getAll();
      
      request.onsuccess = () => {
        resolve(request.result || []);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // ========== SLIDER ==========
  async guardarSlider(imagenes: ImagenSlider[]): Promise<void> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['slider'], 'readwrite');
      const store = transaction.objectStore('slider');
      const clearRequest = store.clear();
      
      clearRequest.onsuccess = () => {
        if (imagenes.length === 0) {
          resolve();
          return;
        }
        
        let guardados = 0;
        for (const img of imagenes) {
          const putRequest = store.put(img);
          putRequest.onsuccess = () => {
            guardados++;
            if (guardados === imagenes.length) resolve();
          };
          putRequest.onerror = () => reject(putRequest.error);
        }
      };
      clearRequest.onerror = () => reject(clearRequest.error);
    });
  }

  async obtenerSlider(): Promise<ImagenSlider[]> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['slider'], 'readonly');
      const store = transaction.objectStore('slider');
      const request = store.getAll();
      
      request.onsuccess = () => {
        const imagenes = request.result || [];
        for (const img of imagenes) {
          if (img.blob && !img.url) {
            img.url = URL.createObjectURL(img.blob);
          }
        }
        resolve(imagenes);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async eliminarSlider(id: number): Promise<void> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['slider'], 'readwrite');
      const store = transaction.objectStore('slider');
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // ========== GALERÍA ==========
  async guardarGaleria(imagenes: ImagenGaleria[]): Promise<void> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['galeria'], 'readwrite');
      const store = transaction.objectStore('galeria');
      const clearRequest = store.clear();
      
      clearRequest.onsuccess = () => {
        if (imagenes.length === 0) {
          resolve();
          return;
        }
        
        let guardados = 0;
        for (const img of imagenes) {
          const putRequest = store.put(img);
          putRequest.onsuccess = () => {
            guardados++;
            if (guardados === imagenes.length) resolve();
          };
          putRequest.onerror = () => reject(putRequest.error);
        }
      };
      clearRequest.onerror = () => reject(clearRequest.error);
    });
  }

  async obtenerGaleria(): Promise<ImagenGaleria[]> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['galeria'], 'readonly');
      const store = transaction.objectStore('galeria');
      const request = store.getAll();
      
      request.onsuccess = () => {
        const imagenes = request.result || [];
        for (const img of imagenes) {
          if (img.blob && !img.url) {
            img.url = URL.createObjectURL(img.blob);
          }
        }
        resolve(imagenes);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async eliminarGaleria(id: number): Promise<void> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['galeria'], 'readwrite');
      const store = transaction.objectStore('galeria');
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}