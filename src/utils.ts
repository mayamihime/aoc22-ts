import path from "path"
import { promises as fs } from "fs"

export const readStatic = (filename: string) => {
    return fs.readFile(path.join(__dirname, "..", "static", filename), { encoding: "utf8" })
}
