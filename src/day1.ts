import { readStatic } from "./utils"

class Elf {
    public calories: number[]

    constructor() {
        this.calories = []
    }

    public get total() {
        return this.calories.reduce((acc, cur) => acc + cur, 0)
    }
}

(async () => {
    let content = await readStatic("day1_input.prod")

    const elves: Elf[] = [new Elf()]

    for (const line of content.split("\n")) {
        if (line.length < 1) elves.push(new Elf());	
        else elves[elves.length - 1].calories.push(Number(line))
    }

    let target = 0;
    for (const elf of elves) {
        if(elf.total >= target) target = elf.total
	}

    console.log(`the elf carrying the most calories has ${target}cal.`)

    elves.sort((a, b) => a.total - b.total)

    let top3total = 0
    for (let i = 0; i < 3; i ++) {
        const elf = elves[elves.length - 1 - i]
        top3total += elf.total
    }
    console.log(`the top three elves are carrying a total of ${top3total}cal.`)
})()
