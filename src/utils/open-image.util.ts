import sharp from "sharp"

import { Image } from ".."

function openImage(filePath: string): Image {
    return sharp(filePath)
}

export default openImage