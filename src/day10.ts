import { readStatic } from "./utils"

interface Instruction {
    value: number | null
    timer: number
}

const TARGET_CYCLES = [20, 60, 100, 140, 180, 220]
const LIT = "▩"
const DARK = "▢"

;(async () => {
    const contents = await readStatic("day10.prod")
    const parsed = contents
        .split("\n")
        .filter(line => line.length > 1)
        .map(line => {
            const [name, arg] = line.split(" ")
            return { name, value: name == "noop" ? null : Number(arg) }
        })

    let currentInstruction: Instruction = null
    let register = 1
    let i = -1
    let cycle = -1

    const targetStrenghts: number[] = []
    const screen: string[] = []

    do {
        cycle++

        if (TARGET_CYCLES.includes(cycle))
            targetStrenghts.push(cycle * register)

        if (currentInstruction) {
            currentInstruction.timer--

            // why are indexes so tricky to deal with
            const column = (cycle - 1) % 40

            register == column - 1 ||
            register == column ||
            register == column + 1
                ? screen.push(LIT)
                : screen.push(DARK)

            // if it's the last column, add a line break after the pixel
            column == 39 && screen.push("\n")

            if (currentInstruction.timer == 0) {
                // if the instruction has finished executing
                if (currentInstruction.value)
                    register += currentInstruction.value
                currentInstruction = null // dispose of it for the next one
            }
        }

        if (!currentInstruction) {
            i++
            if (!parsed[i]) currentInstruction = null
            // if there's no more instructions, break
            else
                currentInstruction = {
                    value:
                        parsed[i].name == "noop"
                            ? null
                            : Number(parsed[i].value), // noop has no value, addx has the value to be added
                    timer: parsed[i].name == "noop" ? 1 : 2, // noop takes 1 cycle, addx takes 2
                }
        }
    } while (currentInstruction != null)

    console.log(
        `[#] the sum of the target strenghts is ${targetStrenghts.reduce(
            (x, strength) => x + strength
        )}`
    )

    screen.forEach(pixel => process.stdout.write(pixel))
})()
