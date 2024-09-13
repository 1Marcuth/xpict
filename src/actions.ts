import { createCanvas, registerFont } from "canvas"
import sharp from "sharp"

import { colors, insertTextDefaultAnchor, insertTextDefaultBackgroundColor, insertTextDefaultRotation } from "./constants"
import { Image } from "."

function toGrayScale(grayscale: boolean = true) {
    return (image: Image) => image.grayscale(grayscale)
}

export type CropImageOptions = sharp.Region

function cropImage(options: CropImageOptions) {
    return (image: Image) => image.extract(options)
}

export type ResizeImageOptions = {
    width: number
    height: number
    fit: keyof sharp.FitEnum
}

function resizeImage({
    width,
    height,
    fit = "inside"
}: ResizeImageOptions) {
    return (image: Image) => image.resize(
        width,
        height,
        { fit: fit }
    )
}

function rotateImage(angle: number) {
    return (image: Image) => image.rotate(angle)
}

function blurImage(sigma: number = 1) {
    return (image: Image) => image.blur(sigma)
}

function modulateSaturation(saturation: number) {
    return (image: Image) => image.modulate({ saturation })
}

function modulateBrightness(brightness: number) {
    return (image: Image) => image.modulate({ brightness })
}

function invertColors() {
    return (image: Image) => image.negate()
}

export type AddBorderOptions = {
    size: number
    color?: string
}

function addBorder({
    size,
    color = colors.black
}: AddBorderOptions) {
    return (image: Image) =>
        image.extend({
            top: size,
            bottom: size,
            left: size,
            right: size,
            background: color
        })
}

function adjustContrast(contrast: number) {
    return (image: Image) => {
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast))
        return image.linear(factor, -(128 * factor) + 128)
    }
}

function modulateOpacity(opacity: number) {
    return (image: Image) => image.flatten({ background: { alpha: opacity } })
}

function flipImage() {
    return (image: Image) => image.flip()
}

function flopImage() {
    return (image: Image) => image.flop()
}

export type FontOptions = {
    size: number
    color?: string
    name?: string
    filePath?: string
}

export type TextAnchor = "top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right"

export type Stroke = {
    fill: string
    width: number
}

export type InsertTextOptions = {
    text: string
    font: FontOptions
    x: number
    y: number
    backgroundColor?: string
    anchor?: TextAnchor
    stroke?: Stroke
    rotation?: number
}

export type AnchorOffsets = Record<TextAnchor, { x: number, y: number }>

function insertText({
    text,
    font,
    x,
    y,
    backgroundColor = insertTextDefaultBackgroundColor,
    anchor = insertTextDefaultAnchor,
    stroke,
    rotation = insertTextDefaultRotation
}: InsertTextOptions) {
    return async (image: Image) => {
        const imageMetadata = await image.metadata()
        const width = imageMetadata.width!
        const height = imageMetadata.height!

        const canvas = createCanvas(width, height)
        const context = canvas.getContext("2d")

        if (backgroundColor !== "transparent") {
            context.fillStyle = backgroundColor
            context.fillRect(0, 0, width, height)
        }

        if (font.filePath) {
            registerFont(
                font.filePath,
                { family: font.name! }
            )
        }

        context.font = `${font.size}px ${font.name}`
        context.fillStyle = font.color ?? colors.black

        const textMetrics = context.measureText(text)
        const textWidth = textMetrics.width
        const textHeight = font.size

        const anchorOffsets: AnchorOffsets = {
            "top-left": {
                x: 0,
                y: 0
            },
            "top-center": {
                x: -textWidth / 2,
                y: 0
            },
            "top-right": {
                x: -textWidth,
                y: 0
            },
            "middle-left": {
                x: 0,
                y: -textHeight / 2
            },
            "middle-center": {
                x: -textWidth / 2,
                y: -textHeight / 2
            },
            "middle-right": {
                x: -textWidth,
                y: -textHeight / 2
            },
            "bottom-left": {
                x: 0,
                y: -textHeight
            },
            "bottom-center": {
                x: -textWidth / 2,
                y: -textHeight
            },
            "bottom-right": {
                x: -textWidth,
                y: -textHeight
            }
        }

        const {
            x: offsetX,
            y: offsetY
        } = anchorOffsets[anchor] || { x: 0, y: 0 }

        const adjustedX = x + offsetX
        const adjustedY = y + offsetY
        const adjustedRotation = rotation ?? 0

        context.save()
        context.translate(adjustedX, adjustedY)
        context.rotate((adjustedRotation * Math.PI) / 180)

        if (stroke) {
            context.strokeStyle = stroke.fill
            context.lineWidth = stroke.width
            context.lineJoin = "round"
            context.strokeText(text, 0, 0)
        }

        context.fillStyle = font.color ?? colors.black
        context.fillText(text, 0, 0)

        context.restore()

        const textBuffer = canvas.toBuffer()

        return image.composite([
            {
                input: textBuffer,
                top: 0,
                left: 0
            }
        ])
    }
}

export type InsertCircleOptions = {
    x: number
    y: number
    radius: number
    fill: string
}

function insertCircle({
    x,
    y,
    radius,
    fill
}: InsertCircleOptions) {
    return async (image: Image) => {
        const imageMetadata = await image.metadata()
        const width = imageMetadata.width!
        const height = imageMetadata.height!

        const canvas = createCanvas(width, height)
        const context = canvas.getContext("2d")

        context.beginPath()
        context.arc(x, y, radius, 0, Math.PI * 2, true)
        context.closePath()
        context.fillStyle = fill
        context.fill()

        const circleBuffer = canvas.toBuffer()

        return image.composite([
            {
                input: circleBuffer,
                top: 0,
                left: 0
            }
        ])
    }
}

export type InsertRectangleOptions = {
    x: number
    y: number
    width: number
    height: number
    fill: string
    borderRadius?: number
}

function insertRectangle({
    x,
    y,
    width,
    height,
    fill,
    borderRadius
}: InsertRectangleOptions) {
    return async (image: Image) => {
        const imageMetadata = await image.metadata()
        const canvasWidth = imageMetadata.width!
        const canvasHeight = imageMetadata.height!

        const canvas = createCanvas(canvasWidth, canvasHeight)
        const context = canvas.getContext("2d")

        context.fillStyle = fill

        if (borderRadius && borderRadius > 0) {
            context.beginPath()
            context.moveTo(x + borderRadius, y)
            context.lineTo(x + width - borderRadius, y)
            context.arcTo(x + width, y, x + width, y + height, borderRadius)
            context.lineTo(x + width, y + height - borderRadius)
            context.arcTo(x + width, y + height, x, y + height, borderRadius)
            context.lineTo(x + borderRadius, y + height)
            context.arcTo(x, y + height, x, y, borderRadius)
            context.lineTo(x, y + borderRadius)
            context.arcTo(x, y, x + width, y, borderRadius)
            context.closePath()
            context.fill()
        } else {
            context.fillRect(x, y, width, height)
        }

        const rectangleBuffer = canvas.toBuffer()

        return image.composite([
            {
                input: rectangleBuffer,
                top: 0,
                left: 0
            }
        ])
    }
}

export type InsertLineOptions = {
    x1: number
    y1: number
    x2: number
    y2: number
    color: string
    width: number
}

function insertLine({
    x1,
    y1,
    x2,
    y2,
    color,
    width
}: InsertLineOptions) {
    return async (image: Image) => {
        const imageMetadata = await image.metadata()
        const canvasWidth = imageMetadata.width!
        const canvasHeight = imageMetadata.height!

        const canvas = createCanvas(canvasWidth, canvasHeight)
        const context = canvas.getContext("2d")

        context.strokeStyle = color
        context.lineWidth = width
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()

        const lineBuffer = canvas.toBuffer()

        return image.composite([
            {
                input: lineBuffer,
                top: 0,
                left: 0
            }
        ])
    }
}


 
export {
    toGrayScale,
    cropImage,
    resizeImage,
    rotateImage,
    blurImage,
    modulateSaturation,
    modulateBrightness,
    invertColors,
    addBorder,
    adjustContrast,
    modulateOpacity,
    flipImage,
    flopImage,
    insertText,
    insertCircle,
    insertRectangle,
    insertLine
}