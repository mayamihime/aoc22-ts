import { readStatic } from "./utils"

const MAX_ROUNDS: number = 10_000 

interface Operation {
    type: "+" | "*"
    n: number | null
}

class Test {
    constructor(
        public n: number,
        public toTruthy: number,
        public toFalsy: number
    ) {}
}

class Monkey {
    public static from(s: string[]): Monkey {
        return s.reduce((x, line) => {
            line = line.trim()

            if (line.startsWith("Monkey"))
                x.id = Number(line.split(" ")[1].replace(":", ""))

            if (line.startsWith("Starting")) {
                const items = line
                    .split(":")[1]
                    .split(",")
                    .map(bit => bit.trim())
                x.items = items.map(Number)
            }

            if (line.startsWith("Operation")) {
                const core = line.split("=")

                x.operation = {
                    type: core[1].trim().split(" ")[1] == "+" ? "+" : "*",
                    n:
                        core[1].trim().split(" ")[2] == "old"
                            ? null
                            : Number(core[1].trim().split(" ")[2]),
                }
            }

            if (line.startsWith("Test")) {
                x.test = {
                    n: Number(line.split("by")[1].trim()),
                    toFalsy: null,
                    toTruthy: null,
                }
            }

            if (line.startsWith("If")) {
                const condition = line.split(" ")[1].replace(":", "")
                const to = Number(line.split("monkey")[1])

                if (condition == "true") x.test.toTruthy = to
                else if (condition == "false") x.test.toFalsy = to
            }

            return x
        }, new Monkey(null, null, null, null))
    }

    public inspections: number

    constructor(
        public id: number,
        public items: number[],
        public operation: Operation,
        public test: Test
    ) {
        this.inspections = 0
    }
}

;(async () => {
    const contents = await readStatic("day11.prod")
    const parsed = contents.split("\n\n").map(chunk => chunk.split("\n"))

    const monkeys = parsed.map(chunk => Monkey.from(chunk))

    // it might have taken me a bit too long and a few rereads to realise what was wrong here
    const p = monkeys.reduce((x, monkey) => monkey.test.n * x, 1)

    for (let round = 1; round <= MAX_ROUNDS; round++) {
        monkeys.forEach(monkey => {
            Array.from(monkey.items)
                .reverse()
                .forEach(item => {
                    item %= p

                    if (monkey.operation.type == "+") {
                        if (monkey.operation.n == null) item += item
                        else item = item + monkey.operation.n
                    } else if (monkey.operation.type == "*") {
                        if (monkey.operation.n == null) item *= item
                        else item = item * monkey.operation.n
                    }

                    if (MAX_ROUNDS == 20) item = Math.floor(item / 3)

                    if (item % monkey.test.n == 0) {
                        monkeys[monkey.test.toTruthy].items.push(item)
                    } else monkeys[monkey.test.toFalsy].items.push(item)

                    monkey.items.splice(monkey.items.indexOf(item), 1)
                    monkey.inspections++
                })
        })
    }

    // i'm such a child for laughing at this lol
    const monkeyBusiness = monkeys.sort((a, b) => a.inspections - b.inspections)
        .slice(monkeys.length - 2)
        .reduce((x, monkey) => monkey.inspections * x, 1)
    
    console.log(`[#] the level of monkey business is ${monkeyBusiness}`)
})()
