import { ImageTemplate, processImageTemplate } from "../src"
import { cropImage, insertText, toGrayScale } from "../src/actions"
import { colors } from "../src/constants";
import { createImage, openImage } from "../src/utils"

const template1 = {
    image: createImage({
        width: 100,
        height: 100,
        channels: 3,
    }),
    layers: [
        {
            x: 20,
            y: 20,
            template: {
                image: createImage({
                    width: 50,
                    height: 50,
                    channels: 3,
                    fill: colors.black
                }),
            },
        }
    ]
} satisfies ImageTemplate

const template2 = {
    image: openImage("picapau.jpg"),
    actions: [
        // toGrayScale(),
        // {
        //     type: "afterLayersProccess",
        //     func: cropImage({
        //         width: 200,
        //         height: 200,
        //         top: 0,
        //         left: 0
        //     })
        // },
        insertText({
            text: "Hello, world!",
            font: {
                size: 12,
                color: "#FFF",
                name: "Poppins"
            },
            x: 10,
            y: 50,
        })
    ],
    // layers: [
    //     {
    //         x: 15,
    //         y: 13,
    //         template: template1,
    //     }
    // ]
} satisfies ImageTemplate

;(async () => {
    const img = await processImageTemplate(template2)
    await img.toFile("image.png")
})();