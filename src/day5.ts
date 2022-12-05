import { readStatic } from "./utils"

const moveItems = (amount: number, from: Crate, to: Crate, keepOrder?: boolean) => {
    const items = from.pick(amount)
    if (!keepOrder) items.reverse()
    items.forEach(item => to.items.push(item))
}

class Crate {
    public static from(s: string[]): Crate[] {
        const matrix = s.map(line => line.split(""))
        const revMatrix: string[][] = []

        for (let char = matrix[0].length - 1; char >= 0; char--) {
            if (!revMatrix[char]) revMatrix[char] = []

            for (let line = matrix.length - 1; line >= 0; line--) {
                revMatrix[char][line] = matrix[line][char]
            }
        }

        const crates = revMatrix.filter(line => line[line.length - 1] != " ")
            .map(line => line.reverse())
            .map(line => line.filter(char => char != " "))
            .map(line => line.filter((_, i) => i != 0))

        return crates.map(crate => new Crate(crate)) 
    }

    constructor(public items: string[]) {}

    public pick(amount: number): string[] {
        return this.items.splice(this.items.length - amount, amount)
    }
}

class Procedure {
    public static from(s: string[]) {
        const values = s.map(line => line.split(" "))
            .map(line => 
                 line.filter(word => !["move", "from", "to"].includes(word))
                    .map(Number)
                )


        return values.map(([amount, from, to]) => new Procedure(amount, from, to))
    }
    constructor(public amount: number, public from: number, public to: number) {}
}

(async () => {
    const contents = await readStatic("day5_input.prod")
    
    const lines = contents.split("\n\n")

    const parsedCrates = lines[0].split("\n")
    const parsedProcedures = lines[1].split("\n")
        .filter(line => line.length > 1) // istfg

    const crates = Crate.from(parsedCrates)
    const crates2 = Crate.from(parsedCrates)

    const procedures = Procedure.from(parsedProcedures)

    for (const procedure of procedures) {
        const from = crates[procedure.from - 1]
        const to = crates[procedure.to - 1]
        moveItems(procedure.amount, from, to) 

        const from2 = crates2[procedure.from - 1]
        const to2 = crates2[procedure.to - 1]
        moveItems(procedure.amount, from2, to2, true) 
    }
    const topCrates = crates.map(crate => crate.items[crate.items.length - 1])
        .join("")
    const topCrates2 = crates2.map(crate => crate.items[crate.items.length - 1])
        .join("")
    console.log(`the top crates are ${topCrates}`)
    console.log(`the top crates for part 2 are ${topCrates2}`)
})()
