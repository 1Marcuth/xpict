import path from "path"

import { extendImageTemplate, processImageTemplate, ImageTemplate } from "../src"
import { insertRectangle, insertText } from "../src/actions"
import { hex } from "../src/utils/color.util"
import { createImage } from "../src/utils"

function getCoordinatesForNode(nodeNumber: number, imageWith: number, imageHeight: number, marginX: number, marginY: number) {
    const initialX = 30
    const initialY = 30

    const coordinates: { [key: number]: { x: number, y: number } } = {
        0: { x: initialX, y: initialY },
        1: { x: initialX, y: initialY + imageHeight + marginY },
        2: { x: initialX + imageWith + marginX, y: initialY },
        3: { x: initialX + imageWith + marginX, y: initialY + imageHeight + marginY },
        4: { x: initialX + imageWith + 25, y: initialY + (imageHeight * 2) + (marginY * 2) }
    };

    return coordinates[nodeNumber - 1]
}

const lapBaseImageTemplate = {
    image: createImage({
        width: 1280,
        height: 720,
        fill: "#FFF"
    }),
} satisfies ImageTemplate

const nodeBaseImageTemplate = {
    image: createImage({
        width: 600,
        height: 200,
        fill: hex(0x000000)
    })
} satisfies ImageTemplate

;(async () => {
    for (let lapNumber = 1; lapNumber <= 29; lapNumber++) {
        const lapImageTemplate = extendImageTemplate(lapBaseImageTemplate, {
            layers: [],
            actions: [
               insertText({
                    x: 491,
                    y: 590,
                    font: {
                        name: "curse-casual",
                        filePath: path.resolve(__dirname, "..", "Curse Casual.ttf"),
                        size: 80,
                        color: "#FFF",
                    },
                    text: `Lap ${lapNumber}`,
                    anchor: "middle-center",
                    stroke: {
                        fill: "#000",
                        width: 3
                    }
               }) 
            ]
        })

        for (let nodeNumber = 1; nodeNumber <= 5; nodeNumber++) {
            const imageMetadata = await nodeBaseImageTemplate.image.metadata()
            const imageWith = imageMetadata.width!
            const imageHeight = imageMetadata.height!

            console.log(imageWith, imageHeight)

            const nodeImageTemplate = extendImageTemplate(nodeBaseImageTemplate, {
                actions: [
                    insertRectangle({
                        x: 0,
                        y: 0,
                        width: imageWith,
                        height: imageHeight,
                        fill: "#ccc"
                    }),
                    insertText({
                        x: 15,
                        y: 0,
                        font: {
                            name: "curse-casual",
                            filePath: path.resolve(__dirname, "..", "Curse Casual.ttf"),
                            size: 35,
                            color: "#FFF",
                        },
                        text: `Node ${nodeNumber}`,
                        anchor: "middle-center",
                        stroke: {
                            fill: "#000",
                            width: 2
                        }
                    })
                ]
            })

            const marginX = 25
            const marginY = 30

            const coordinates = getCoordinatesForNode(nodeNumber, imageWith, imageHeight, marginX, marginY)

            lapImageTemplate.layers.push({
                ...coordinates,
                template: nodeImageTemplate
            })
        }

        const image = await processImageTemplate(lapImageTemplate)
        const fileName = `lap-${String(lapNumber).padStart(2, "0")}.png`
        const filePath = path.join(__dirname, "..", "outputs", fileName)

        image.toFile(filePath)
    }
})();