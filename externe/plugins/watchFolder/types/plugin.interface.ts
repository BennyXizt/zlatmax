import { SVGFolderTranslation, FontsFolderTranslation } from '../i18n';
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
export interface FontsConvertToFile {
    filePath: string,
    fonts: FontsTypes,
    relativePath: string,
    translation:  FontsFolderTranslation,
    destinationFile: string
}
export interface FontsTypes {
    thin: {
        weight: number;
        style: string;
    }
    thinitalic: {
        weight: number;
        style: string;
    }
    extralight: {
        weight: number;
        style: string;
    }
    extralightitalic: {
        weight: number;
        style: string;
    }
    light: {
        weight: number;
        style: string;
    }
    lightitalic: {
        weight: number;
        style: string;
    }
    normal: {
        weight: number;
        style: string;
    }
    normalitalic: {
        weight: number;
        style: string;
    }
    regular: {
        weight: number;
        style: string;
    }
    regularitalic: {
        weight: number;
        style: string;
    }
    medium: {
        weight: number;
        style: string;
    }
    mediumitalic: {
        weight: number;
        style: string;
    }
    semibold: {
        weight: number;
        style: string;
    }
    semibolditalic: {
        weight: number;
        style: string;
    }
    bold: {
        weight: number;
        style: string;
    }
    bolditalic: {
        weight: number;
        style: string;
    }
    extrabold: {
        weight: number;
        style: string;
    }
    extrabolditalic: {
        weight: number;
        style: string;
    }
    black: {
        weight: number;
        style: string;
    }
    blackitalic: {
        weight: number;
        style: string;
    }
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
