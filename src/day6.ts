import { readStatic } from "./utils"

const findHeteroslice = (chars: string[], size: number): number =>
    chars.reduce(
        (x, _, index) =>
            index - size > 0 &&
            !chars
                .slice(index - size, index)
                .map(char => char.charCodeAt(0))
                .some(
                    (code, _, codes) =>
                        codes.indexOf(code) != codes.lastIndexOf(code)
                ) &&
            x == -1
                ? index
                : x,
        -1
    )

class Packet {
    public static from(s: string): Packet {
        const chars = s.split("").filter(char => char != "\n")

        return new Packet(findHeteroslice(chars, 4), findHeteroslice(chars, 14))
    }

    constructor(public sopMarkerIdx: number, public messageMarkerIdx: number) {}
}

;(async () => {
    const contents = await readStatic("day6_input.prod")

    const packet = Packet.from(contents)
    console.log(`the start-of-packet marker is at ${packet.sopMarkerIdx}`)
    console.log(`the message marker is at ${packet.messageMarkerIdx}`)
})()
