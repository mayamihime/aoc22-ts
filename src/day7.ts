import { readStatic } from "./utils"

const MAX_WEIGHT = 100_000
const MAX_SPACE = 70_000_000
const REQUIRED_SPACE = 30_000_000

class Node {
    public parent: Node
    public children: Node[]

    constructor(public id: string, public weight: number) {
        this.children = []
    }

    public addChild(node: Node): Node {
        node.parent = this
        this.children.push(node)
        return this
    }

    public setParent(node: Node): Node {
        this.parent = node
        return this
    }

    public addWeight(amount: number): void {
        this.weight += amount
    }

    public get totalWeight() {
        let childrenWeight = 0
        const getChildrenWeight = (node: Node) => {
            node.children.forEach(child => {
                childrenWeight += child.weight
                getChildrenWeight(child)
            })
        }
        getChildrenWeight(this)
        return this.weight + childrenWeight
    }
}

class Graph {
    public nodes: Node[]

    constructor() {
        this.nodes = []
    }

    public get totalWeight(): number {
        return this.nodes.reduce((x, node) => x + node.totalWeight, 0)
    }
}

;(async () => {
    const contents = await readStatic("day7_input.prod")

    const lines = contents.split("\n").filter(line => line.length > 1)

    const graph = new Graph()

    // initialise tree and its nodes
    let currentNode: Node = null
    for (const line of lines) {
        const [head, mid, tail] = line.split(" ")

        console.log([head, mid, tail])
        // if head is a number, add mid to current node's weight
        if (!isNaN(Number(head))) {
            const weight = Number(head)
            currentNode.addWeight(weight)
        }

        // if cd is not .., make a node with it
        if (mid == "cd" && tail != "..") {
            const node = new Node(tail, 0)

            if (currentNode) currentNode.addChild(node)
            else graph.nodes.push(node)
            currentNode = node
        }

        // jump back to parent
        if (mid == "cd" && tail == "..") currentNode = currentNode.parent
    }

    // part 1
    currentNode = null
    let sum = 0
    const findValues = (node: Node) => {
        node.children.forEach(child => findValues(child))

        if (node.totalWeight <= MAX_WEIGHT) {
            sum += node.totalWeight
            console.log(
                `adding weight of node ${node.id} (${node.totalWeight})`
            )
        }
    }
    graph.nodes.forEach(node => findValues(node))

    // part 2
    const freeSpace = MAX_SPACE - graph.totalWeight
    currentNode = null
    const findOptimalDeletion = (node: Node) => {
        if (currentNode == null) currentNode = node

        if (
            node.totalWeight >= REQUIRED_SPACE - freeSpace &&
            node.totalWeight < currentNode.totalWeight
        )
            currentNode = node

        node.children.forEach(child => findOptimalDeletion(child))
    }
    graph.nodes.forEach(node => findOptimalDeletion(node))
    // i could've merged both functions but no thanks this has drained enough of my sanity already lol

    console.log(`the sum of all nodes >100.000 is ${sum}`)
    console.log(`total used space is ${graph.totalWeight}) of ${MAX_SPACE}`)
    console.log(`total free space is ${freeSpace}`)
    console.log(`the optimal deletion is node ${currentNode.id}, with ${currentNode.totalWeight} size`)
})()
