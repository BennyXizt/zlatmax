import { SVGFolderTranslation } from '../i18n';
import type { Language, Video } from './plugin.type'

export interface FFmpegProgressInterface {
  frames?: number;
  currentFps?: number;
  currentKbps?: number;
  targetSize?: number;
  timemark?: string;
  percent?: number;
}
export interface VideoFolderInterface {
    relativePath: string,
    outputVideoDirectory?: string,
    posterDirectory?: string,
    language?: Language
    outputVideoFormat?: Video[]
}
export interface SVGFolderInterface {
    relativePath: string,
    nameOfTheOutputFile: string,
    language?: Language,
    dummy?: {
        destination: string,
        fileName: string
    },
    convertType: number
}
export interface SVGConvertToFile {
    watchDir: string,
    filePath: string,
    nameOfTheOutputFile: string,
    translation: SVGFolderTranslation,
    relativePath: string,
    dummy?: {
        destination: string,
        fileName: string
    },
}
export interface FontsFolderInterface {
    relativePath: string,
    outputDestination: string,
    language?: Language
}
export interface EJSFolderDestination {
    pages?: {
        fileNameException: string[],
        fileDestination: string
    },
    rest?: {
        fileName: string[],
        fileDestination: string
    }
}
export interface EJSFolderInterface {
    relativePath: string,
    outputDestination: EJSFolderDestination,
    language?: Language
}
