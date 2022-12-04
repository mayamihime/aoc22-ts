import { readStatic } from "./utils"

function getPriorityOf(item: string): number {
    return "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(item) + 1
}

class Rucksack {
    public compartments: string[]

    constructor(content: string) {
        this.compartments = [content.substring(0, content.length / 2), content.substring(content.length / 2)]
    }

    public getDuplicates(): string[] {
        const duplicates = []

        const left = this.compartments[0].split("")
        const right = this.compartments[1].split("")

        for (const item of left) {
            for (const target of right) {
                if (item == target && !duplicates.includes(item)) duplicates.push(item)
            }
        }

        return duplicates
    }

    public get items(): string {
        return this.compartments.join("")
    }
}

class Group {
    constructor(public rucksacks: Rucksack[]) {}
    public getBadge(): string {
        let badge: string;

        for (const item of this.rucksacks[0].items) {
            if (this.rucksacks.every(rucksack => rucksack.items.split("").includes(item))) badge = item
        }
        
        return badge
    }
}

(async () => {
    const contents = await readStatic("day3_input.prod")

    const rucksacks: Rucksack[] = []

    contents.split("\n")
        .filter(line => line.length > 1)
        .forEach(line => rucksacks.push(new Rucksack(line)))

    // part 1
    let items: string[] = [].concat(rucksacks.map(rucksack => rucksack.getDuplicates()))
    let total = 0

    for (const item of items) {
        const priority = getPriorityOf(item)
        if (priority == -1) throw new Error("you're missing something, dummy")
        else total += priority
    }

    console.log(`the total priority is ${total}`)

    // part 2
    const lines = contents.split("\n")
        .filter(line => line.length > 1)
    const groups: Group[] = []

    for (let i = 0; i < lines.length; i += 3) {
        const rs1 = new Rucksack(lines[i])
        const rs2 = new Rucksack(lines[i+1])
        const rs3 = new Rucksack(lines[i+2])

        groups.push(new Group([rs1, rs2, rs3]))
    }

    let groupTotal = 0

    groups.forEach(group => groupTotal += getPriorityOf(group.getBadge()))

    console.log(`the total badge priority is ${groupTotal}`)
})()
