import { readStatic } from "./utils"

// finds the index where the last [size] chars in [chars] are all different
const findHeteroslice = (chars: string[], size: number) => {
    let point = -1
    chars.forEach((_, index) => {
        const start = index - size 
        const end = index
        // don't need slices that are too small
        if (start < 0) return;

        const codes = chars.slice(start, end)
            .map(char => char.charCodeAt(0))
        const isDuplicate = codes.some(code => codes.indexOf(code) != codes.lastIndexOf(code)) 

        if(!isDuplicate && point == -1) {
            point = index
        }
    })
    return point
}

class Packet {
    public static from(s: string): Packet {
        const chars = s.split("")
            .filter(char => char != "\n")
        
        let markStartAt = findHeteroslice(chars, 4)
        let messageMarkAt = findHeteroslice(chars, 14)

        return new Packet(markStartAt, messageMarkAt)
    }

    constructor(public sopMarkerIdx: number, public messageMarkerIdx: number) {}
}

;(async () => {
    const contents = await readStatic("day6_input.prod")
    
    const packet = Packet.from(contents)
    console.log(`the start-of-packet marker is at ${packet.sopMarkerIdx}`)
    console.log(`the message marker is at ${packet.messageMarkerIdx}`)
})()
