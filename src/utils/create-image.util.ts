import sharp from "sharp"

import { createImageDefaultChannels, createImageDefaultFill, createImageDefaultFormat } from "../constants"

export type CreateImageOptions = {
    width: number
    height: number
    fill?: sharp.Color
    channels?: 3 | 4 
    format?: "png" | "jpeg" | "webp" | "avif" | "gif"
}

function createImage({
    width,
    height,
    fill = createImageDefaultFill,
    channels = createImageDefaultChannels,
    format = createImageDefaultFormat,
}: CreateImageOptions) {
    return sharp({
        create: {
            width: width,
            height: height,
            channels: channels,
            background: fill,
        },
    })[format]()
}

export default createImage