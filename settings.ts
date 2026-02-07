import { convertToMOV } from "./externe/plugins/convertVideo/utils/utils"


export const settings = {
    watcherNeeded: true,
    SVGConvertType: 0,
    videoConverter: {
        outputFormat: '.mov',
        convertVideoFunction: convertToMOV
    }
}