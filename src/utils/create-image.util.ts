import sharp from "sharp"

import { createImageDefaultOptions } from "../constants"

export type ImageChannels = 3 | 4

export type ImageFormat = "png" | "jpeg" | "webp" | "avif" | "gif"

export type CreateImageOptions = {
    width: number
    height: number
    fill?: sharp.Color
    channels?: ImageChannels
    format?: ImageFormat
}

function createImage({
    width,
    height,
    fill = createImageDefaultOptions.fill,
    channels = createImageDefaultOptions.chnannels as ImageChannels,
    format = createImageDefaultOptions.format as ImageFormat,
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