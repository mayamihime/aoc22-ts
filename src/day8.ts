import { readStatic } from "./utils"

interface ScenicScore {
    value: number
    pos: [number, number]
    tree: number
}

class Forest {
    public static from(s: string): Forest {
        const trees = s
            .split("\n")
            .filter(line => line.length > 0)
            .map(line => line.split(""))
            .map(line => line.map(Number))

        return new Forest(trees)
    }

    constructor(public trees: number[][]) {}

    public getColumn(colNumber: number): number[] {
        return this.trees.map(row => row[colNumber])
    }

    public getVisibleTrees(): number[] {
        const trees: number[] = []

        for (const [rowIdx, row] of this.trees.entries()) {
            if (rowIdx == 0 || rowIdx == this.trees.length - 1) continue // ignore x-axis edges

            for (const [idx, tree] of row.entries()) {
                // for each tree of this row, check if there's a taller tree in any direction
                // if not, it's visible, else it isn't
                if (idx == 0 || idx == row.length - 1) continue // ignore y-axis edges

                const col = this.getColumn(idx)

                const treesAbove = col.slice(0, rowIdx)
                const treesBelow = col.slice(rowIdx + 1)
                const treesLeft = row.slice(0, idx)
                const treesRight = row.slice(idx + 1)

                const isTopVisible = !treesAbove.some(
                    topTree => topTree >= tree
                )
                const isBottomVisible = !treesBelow.some(
                    bottomTree => bottomTree >= tree
                )
                const isLeftVisible = !treesLeft.some(
                    leftTree => leftTree >= tree
                )
                const isRightVisible = !treesRight.some(
                    rightTree => rightTree >= tree
                )

                if (
                    isTopVisible ||
                    isBottomVisible ||
                    isLeftVisible ||
                    isRightVisible
                ) {
                    trees.push(tree)
                    console.debug(
                        `[#] pushing tree ${tree} (x${idx}, y${rowIdx})`
                    )
                    // console.debug(`[#] visible from t/b/l/r: ${isTopVisible}/${isBottomVisible}/${isLeftVisible}/${isRightVisible}`)
                    // console.debug(`[#] above ${treesAbove} below ${treesBelow}`)
                }
            }
        }

        return trees
    }

    public getHighestScenicScore(): ScenicScore {
        const score: ScenicScore = {
            value: -1,
            pos: null,
            tree: null,
        }
        for (const [rowIdx, row] of this.trees.entries()) {
            for (const [idx, tree] of row.entries()) {
                const col = this.getColumn(idx)

                const treesAbove = col.slice(0, rowIdx).reverse()
                const treesBelow = col.slice(rowIdx + 1)
                const treesLeft = row.slice(0, idx).reverse()
                const treesRight = row.slice(idx + 1)

                const visibleSides = {
                    top: 1,
                    bottom: 1,
                    left: 1,
                    right: 1,
                }

                const blockedTop = treesAbove.some((topTree, i) => {
                    if (topTree >= tree) {
                        // the amount of trees visibles to that side is equal to how many trees we went through
                        visibleSides.top = i + 1
                        return true
                    }
                })
                if (!blockedTop) visibleSides.top = treesAbove.length // if it isn't blocked, it can see all of them

                const blockedBelow = treesBelow.some((bottomTree, i) => {
                    if (bottomTree >= tree) {
                        visibleSides.bottom = i + 1
                        return true
                    }
                })
                if (!blockedBelow) visibleSides.bottom = treesBelow.length

                const blockedLeft = treesLeft.some((leftTree, i) => {
                    if (leftTree >= tree) {
                        visibleSides.left = i + 1
                        return true
                    }
                })
                if (!blockedLeft) visibleSides.left = treesLeft.length

                const blockedRight = treesRight.some((rightTree, i) => {
                    if (rightTree >= tree) {
                        visibleSides.right = i + 1
                        return true
                    }
                })
                if (!blockedRight) visibleSides.right = treesRight.length

                const treeScore = Object.values(visibleSides).reduce(
                    (x, side) => x * side,
                    1
                )

                if (treeScore > score.value) {
                    score.value = treeScore
                    score.tree = tree
                    score.pos = [idx, rowIdx]
                }
            }
        }
        return score
    }
}

;(async () => {
    const contents = await readStatic("day8_input.prod")
    const forest = Forest.from(contents)

    // performance is overrated anyway
    const visibleTrees = forest.getVisibleTrees()
    const borderCount =
        forest.trees.length * 2 + forest.getColumn(0).length * 2 - 4 // for each corner
    console.log(
        `there are ${
            visibleTrees.length + borderCount
        } trees visible from outside (${borderCount} + ${visibleTrees.length})`
    )

    const scenicScore = forest.getHighestScenicScore()
    console.log(
        `the highest scenic score is ${scenicScore.value} (by tree ${scenicScore.tree} at x${scenicScore.pos[0]}, y${scenicScore.pos[1]})`
    )
})()
