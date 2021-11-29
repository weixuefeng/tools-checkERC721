import * as fs from "fs";

export function writeToFile(content, fileName) {
    fs.promises.writeFile(fileName, content)
        .then(
            res => {
                console.log(`${fileName} write success`)
            }
        )
}

export function main(startFilePath) {
    fs.promises.readFile(startFilePath, { encoding: "utf-8"}).then(
        res => {
            console.log(res)
        }
    )
}