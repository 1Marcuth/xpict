import sharp from "sharp"

import { Image } from ".."

async function cloneImage(image: Image) {
    const imageBuffer = await image.toBuffer()
    const clonedImage = sharp(imageBuffer)
    return clonedImage
}

export default cloneImage