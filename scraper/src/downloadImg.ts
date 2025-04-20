import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";
import { URL } from "url";
import { IncomingMessage } from "http";
import { readFileSync } from "node:fs";
import { imageSize } from "image-size";

/**
 * Opciones para la descarga de imágenes
 */
interface DownloadImageOptions {
  /** Directorio donde se guardarán las imágenes (por defecto: './tmp') */
  outputDir?: string;
  /** Prefijo para los nombres de archivo */
  filePrefix?: string;
  /** Si se debe validar el tipo de contenido de la imagen */
  validateContentType?: boolean;
}

/**
 * Resultado de la descarga de imagen
 */
interface DownloadImageResult {
  /** Ruta local donde se guardó la imagen */
  localPath: string;
  /** Extensión del archivo */
  extension: string;
  /** Tipo de contenido original */
  contentType: string;
  /** Nombre del archivo generado */
  fileName: string;
  /** Tamaño de la imagen (ancho y alto) */
  size: { width: number; height: number };
}

/**
 * Descarga una imagen desde una URL y devuelve la ruta local
 * @param imgSrc - URL de la imagen
 * @param options - Opciones de descarga
 * @returns Promesa que resuelve con la información del archivo o null si falla
 */
export async function downloadImage(
  imgSrc: string,
  options: DownloadImageOptions = {}
): Promise<DownloadImageResult | null> {
  return new Promise((resolve, reject) => {
    console.log("Downloading ", imgSrc);
    try {
      // Configurar opciones con valores predeterminados
      const outputDir: string =
        options.outputDir || path.resolve(process.cwd(), "tmp");
      const filePrefix: string = options.filePrefix || "img";
      const validateContentType: boolean =
        options.validateContentType !== undefined
          ? options.validateContentType
          : true;

      // Validar la URL
      let url: URL;
      try {
        url = new URL(imgSrc);
      } catch (e) {
        reject(new Error(`URL inválida: ${imgSrc}`));
        return;
      }

      // Determinar el protocolo a usar
      const protocol = url.protocol === "https:" ? https : http;

      // Realizar la solicitud
      protocol
        .get(imgSrc, (response: IncomingMessage) => {
          // Verificar el código de estado
          if (!response.statusCode || response.statusCode !== 200) {
            reject(
              new Error(`Error al descargar la imagen: ${response.statusCode}`)
            );
            return;
          }

          // Determinar la extensión del archivo
          const contentType: string = response.headers["content-type"] || "";
          let extension: string = "jpg"; // Extensión predeterminada

          // Verificar si es una imagen (opcional)
          if (validateContentType && !contentType.startsWith("image/")) {
            reject(new Error(`El contenido no es una imagen: ${contentType}`));
            return;
          }

          // Determinar la extensión basada en el content-type
          if (contentType.includes("png")) extension = "png";
          else if (contentType.includes("gif")) extension = "gif";
          else if (contentType.includes("webp")) extension = "webp";
          else if (contentType.includes("svg")) extension = "svg";
          else if (contentType.includes("jpeg")) extension = "jpg";

          // También intentar obtener la extensión de la URL
          const urlPath = url.pathname;
          const urlExtension = path.extname(urlPath).slice(1).toLowerCase();
          if (
            urlExtension &&
            ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(urlExtension)
          ) {
            extension = urlExtension === "jpeg" ? "jpg" : urlExtension;
          }

          // Crear directorio temporal si no existe
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }

          // Crear nombre de archivo único
          const timestamp = Date.now();
          const randomSuffix = Math.floor(Math.random() * 1000);
          const fileName = `${filePrefix}_${timestamp}_${randomSuffix}.${extension}`;
          const localPath = path.join(outputDir, fileName);

          // Crear stream de escritura
          const fileStream = fs.createWriteStream(localPath);

          // Manejar errores
          fileStream.on("error", (err: Error) => {
            console.error("Error al escribir el archivo:", err);
            reject(err);
          });

          // Cuando termine de escribir
          fileStream.on("finish", () => {
            try {
              // Obtener las dimensiones de la imagen
              const buffer = readFileSync(localPath);
              const dimensions = imageSize(buffer);
              resolve({
                localPath,
                extension,
                contentType,
                fileName,
                size: {
                  width: dimensions.width || 0,
                  height: dimensions.height || 0,
                },
              });
            } catch (error) {
              console.error(
                "Error al obtener dimensiones de la imagen:",
                error
              );
              // Si hay error al obtener las dimensiones, devolver valores por defecto
              resolve({
                localPath,
                extension,
                contentType,
                fileName,
                size: {
                  width: 0,
                  height: 0,
                },
              });
            }
          });

          // Pipe la respuesta al archivo
          response.pipe(fileStream);
        })
        .on("error", (err: Error) => {
          console.error("Error en la solicitud HTTP:", err);
          reject(err);
        });
    } catch (error) {
      console.error("Error general:", error);
      reject(error);
    }
  });
}

/**
 * Elimina un archivo descargado
 * @param filePath - Ruta al archivo que se eliminará
 * @returns Promesa que resuelve cuando se elimina el archivo
 */
export async function removeDownloadedFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error al eliminar el archivo ${filePath}:`, err);
        reject(err);
        return;
      }
      resolve();
    });
  });
}

/**
 * Limpia todos los archivos de imágenes descargados
 * @param directory - Directorio a limpiar
 * @param prefix - Prefijo de los archivos a eliminar
 * @returns Promesa que resuelve con el número de archivos eliminados
 */
export async function cleanupDownloadedImages(
  directory: string = path.resolve(process.cwd(), "tmp"),
  prefix: string = "img"
): Promise<number> {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        if (err.code === "ENOENT") {
          // El directorio no existe, no hay nada que limpiar
          resolve(0);
          return;
        }
        reject(err);
        return;
      }

      // Filtrar archivos que coincidan con el prefijo
      const targetFiles = files.filter((file) => file.startsWith(prefix));
      let deletedCount = 0;

      if (targetFiles.length === 0) {
        resolve(0);
        return;
      }

      // Eliminar cada archivo
      targetFiles.forEach((file) => {
        const filePath = path.join(directory, file);
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error(`Error al eliminar ${filePath}:`, unlinkErr);
          } else {
            deletedCount++;
          }

          // Cuando se hayan procesado todos los archivos
          if (deletedCount === targetFiles.length) {
            resolve(deletedCount);
          }
        });
      });
    });
  });
}
