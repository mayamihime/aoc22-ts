import { readStatic } from "./utils"

class Packet {
    public static from(s: string): Packet {
        const chars = s.split("")
            .filter(char => char != "\n")
        
        let markStartAt = -1
        chars.forEach((_, index) => {
            const start = index - 4
            const end = index

            if (start < 0) return;

            const codes = chars.slice(start, end)
                .map(_char => _char.charCodeAt(0))
            const isDuplicate = codes.some(code => codes.indexOf(code) != codes.lastIndexOf(code)) 

            if(!isDuplicate && markStartAt == -1) {
                markStartAt = index
            }
        })

        let messageMarkAt = -1

        console.log(chars)
        chars.forEach((_, index) => {
            const start = index - 14
            const end = index

            if (start < 0) return;
            
            const codes = chars.slice(start, end)
                .map(_char => _char.charCodeAt(0))
            const isDuplicate = codes.some(code => codes.indexOf(code) != codes.lastIndexOf(code))

            if(!isDuplicate && messageMarkAt == -1) {
                messageMarkAt = index
            }
        })

        return new Packet(markStartAt, messageMarkAt)
    }

    constructor(public markStarsAt: number, public messageMarkAt: number) {}
}

;(async () => {
    const contents = await readStatic("day6_input.prod")
    
    const packet = Packet.from(contents)
    console.log(`the marker starts at ${packet.markStarsAt}`)
    console.log(`the message marker starts at ${packet.messageMarkAt}`)
})()
