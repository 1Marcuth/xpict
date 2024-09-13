import sharp, { Sharp } from "sharp"

import { defautltTemplateAcitonType } from "./constants"

export type Image = Sharp

export type ImageTemplateLayer = {
    x: number
    y: number
    template: ImageTemplate
}

export type ImageTemplateActionFunction = (image: Image) => Image | Promise<Image>

export type ImageTemplateAction = ImageTemplateActionFunction | {
    type: "beforeLayersProccess" | "afterLayersProccess"
    func: ImageTemplateActionFunction
}

export type ImageTemplate = {
    image: Image
    actions?: ImageTemplateAction[]
    layers?: ImageTemplateLayer[]
}

export type ExtractActionsResult = {
    before: ImageTemplateActionFunction[]
    after: ImageTemplateActionFunction[]
}

function extractActions(actions: ImageTemplateAction[] | undefined): ExtractActionsResult {
    const actionsLayersProccess: ImageTemplateActionFunction[] = []
    const actionsAfterLayersProccess: ImageTemplateActionFunction[] = []

    if (!actions) {
        actions = []
    }

    for (const action of actions) {
        const actionType = typeof action === "function" ? defautltTemplateAcitonType : action.type
        const actionFunc = typeof action === "function" ? action : action.func

        if (actionType === "beforeLayersProccess") {
            actionsLayersProccess.push(actionFunc)
        } else {
            actionsAfterLayersProccess.push(actionFunc)
        }
    }

    return {
        before: actionsLayersProccess,
        after: actionsAfterLayersProccess
    }
}

async function processImageTemplate(template: ImageTemplate): Promise<Image> {
    const actions = extractActions(template.actions)
    let image = template.image

    for (const action of actions.before) {
        image = await action(image)
    }

    if (template.layers) {
        const layerImages: sharp.OverlayOptions[] = []

        for (const layer of template.layers) {
            const currentImage = await processImageTemplate(layer.template)
            const currentImageBuffer = await currentImage.png().toBuffer()

            layerImages.push({
                input: currentImageBuffer,
                top: layer.y,
                left: layer.x
            })
        }

        image = image.composite(layerImages)
    }

    for (const action of actions.after) {
        image = await action(image)
    }

    return image
}

function extendImageTemplate(
    template: ImageTemplate,
    extendTemplate: Omit<ImageTemplate, "image">
) {
    const actions = []
    const layers = []

    if (template.layers) {
        layers.push(...template.layers)
    }

    if (extendTemplate.layers) {
        layers.push(...extendTemplate.layers)
    }

    if (template.actions) {
        actions.push(...template.actions)
    }

    if (extendTemplate.actions) {
        actions.push(...extendTemplate.actions)
    }

    return {
       image: template.image,
       actions: actions,
       layers: layers
    }
}

export {
    processImageTemplate,
    extendImageTemplate
}