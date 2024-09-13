function componentToHex(component: number): string {
    const hex = component.toString(16)
    return hex.padStart(2, "0")
}

function rgb(red: number, green: number, blue: number): string {
    return `#${componentToHex(red)}${componentToHex(green)}${componentToHex(blue)}`
}

function rgba(red: number, green: number, blue: number, alpha: number): string {
    const alphaHex = componentToHex(Math.round(alpha * 255))
    return `#${componentToHex(red)}${componentToHex(green)}${componentToHex(blue)}${alphaHex}`
}

function hex(value: number) {
    const hexadecimalValue = value.toString(16)
    const fromatedHexadecimal = `#${hexadecimalValue.padStart(6, "0")}`
    return fromatedHexadecimal
}

export {
    rgb,
    rgba,
    hex
}