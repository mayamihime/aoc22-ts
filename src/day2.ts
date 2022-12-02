import path from 'path'
import { promises as fs } from 'fs'

enum RPS {
    Rock = "Rock",
    Paper = "Paper",
    Scissors = "Scissors"
}

function parseToRPS(x: string): RPS {
    if (["x", "a"].includes(x.toLowerCase())) return RPS.Rock;
    else if(["y", "b"].includes(x.toLowerCase())) return RPS.Paper;
    else if(["z", "c"].includes(x.toLowerCase())) return RPS.Scissors;
    else throw new Error("Failed to parse char to RPS.")
}

function getScoreFrom(rounds: RPS[][]): number {
    let score = 0

    for (const [opponent, player] of rounds) {
        if (player == RPS.Rock) score += 1;
        else if (player == RPS.Paper) score += 2;
        else if (player == RPS.Scissors) score += 3;

        if (player == RPS.Rock && opponent == RPS.Scissors ||
            player == RPS.Paper && opponent == RPS.Rock ||
            player == RPS.Scissors && opponent == RPS.Paper) score += 6;
            
        else if (player == RPS.Rock && opponent == RPS.Rock ||
                 player == RPS.Paper && opponent == RPS.Paper ||
                 player == RPS.Scissors && opponent == RPS.Scissors) score += 3;
    }

    return score
}

function correctRoundChoice(round: RPS[]): RPS[] {
    const [opponent, player] = round
    
    if (player == RPS.Rock) { // lose
        if (opponent == RPS.Rock) round[1] = RPS.Scissors;
        else if (opponent == RPS.Paper) round[1] = RPS.Rock;
        else if (opponent == RPS.Scissors) round[1] = RPS.Paper;
    }

    else if (player == RPS.Paper) { // draw
        if (opponent == RPS.Rock) round[1] = RPS.Rock;
        else if (opponent == RPS.Paper) round[1] = RPS.Paper;
        else if (opponent == RPS.Scissors) round[1] = RPS.Scissors;
    }

    else if (player == RPS.Scissors) { // win!
        if (opponent == RPS.Rock) round[1] = RPS.Paper;
        else if (opponent == RPS.Paper) round[1] = RPS.Scissors;
        else if (opponent == RPS.Scissors) round[1] = RPS.Rock;
    }

    return round
}

// rounds are [opponent, player]
(async () => {
    const filepath = path.join(__dirname, "..", "static", "day2_input.txt")
    const contents = await fs.readFile(filepath, { encoding: "utf8" })

    const rounds = contents.split("\n")
        .map(line => line.split(" "))
        .filter(row => row.length > 1)
        .map(row => row.map(item => parseToRPS(item)))
   
    console.log(`the score of part 1 is ${getScoreFrom(rounds)}`)

    const correctedRounds = rounds.map(correctRoundChoice)

    console.log(`the score of part 2 is ${getScoreFrom(correctedRounds)}`)
})()
