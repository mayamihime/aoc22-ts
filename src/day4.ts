import path from "path"
import { promises as fs } from "fs"

class Pair {
    public static from(s: string): Pair {
        const [left, right] = s.split(",")
            .map(side => side.split("-")
                 .map(x => Number(x))
                )
        return new Pair(left, right)
    }

    constructor(public left: number[], public right: number[]) {}

    public get fullyOverlaps(): boolean {
        const [left, right] = [this.left, this.right] 

        if (left[0] >= right[0] && left[1] <= right[1]) return true
        else if (right[0] >= left[0] && right[1] <= left[1]) return true
        else return false
    }

    public get overlaps(): boolean {
        const [left, right] = [this.left, this.right]

        if (left[0] >= right[0] && left[0] <= right[1]) return true
        else if (left[1] >= right[0] && left[1] <= right[1]) return true
        else if (right[0] >= left[0] && right[0] <= left[1]) return true
        else if (right[1] >= left[0] && right[1] <= left[1]) return true
        else return false
    }
}

(async () => {
    const filepath = path.join(__dirname, "..", "static", "day4_input.prod")
    const contents = await fs.readFile(filepath, { encoding: "utf8" })
    const lines = contents.split("\n")

    const pairs = lines.map(line => Pair.from(line))
        .filter(pair => !!pair.left && !!pair.right)

    let [overlaps, fullOverlaps] = [0, 0]
    for (const pair of pairs) {
        if (pair.overlaps) overlaps++;
        if (pair.fullyOverlaps) fullOverlaps++; 
    } 
    console.log(`${fullOverlaps} pairs fully overlap.`)    
    console.log(`${overlaps} pairs overlap at all.`)
})()
