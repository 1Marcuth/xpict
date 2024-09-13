import { rgba } from "./utils/color.util"

const colors = {
    black: "#000000",
    white: "#FFFFFF"
}

const defautltTemplateAcitonType = "beforeLayersProccess"

const createImageDefaultOptions = {
    chnannels: 4,
    fill: rgba(0, 0, 0, 0),
    format: "png"
}

const insertTextDefaultOptions = {
    font: {
        name: "sans-serif", 
    },
    anchor: "top-left",
    backgroundColor: "transparent",
    rotation: 0
}

export {
    colors,
    defautltTemplateAcitonType,
    createImageDefaultOptions,
    insertTextDefaultOptions
}