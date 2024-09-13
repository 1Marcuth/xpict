import { rgba } from "./utils/color.util"

const colors = {
    black: "#000000",
    white: "#FFFFFF"
}

const defautltTemplateAcitonType = "beforeLayersProccess"
const createImageDefaultChannels = 4
const createImageDefaultFill = rgba(0, 0, 0, 0)
const createImageDefaultFormat = "png"
const insertTextDefaultFontName = "sans-serif"
const insertTextDefaultAnchor = "top-left"
const insertTextDefaultBackgroundColor = "transparent"
const insertTextDefaultRotation = 0

export {
    colors,
    defautltTemplateAcitonType,
    createImageDefaultChannels,
    createImageDefaultFill,
    createImageDefaultFormat,
    insertTextDefaultFontName,
    insertTextDefaultAnchor,
    insertTextDefaultBackgroundColor,
    insertTextDefaultRotation
}