import axios from "axios"
import fs from "fs"
import path from "path"

export default class functions {
    public static download = async (link: string, dest: string) => {
        const headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36", "referer": "https://www.pixiv.net/"}
        const bin = await axios.get(link, {responseType: "arraybuffer", headers}).then((r) => r.data)
        fs.writeFileSync(dest, Buffer.from(bin, "binary"))
    }

    public static arrayRemove = <T>(arr: T[], val: T) => {
        return arr.filter(item => item !== val)
    }

    public static timeout = async (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    public static formatMS = (ms: number) => {
        const sec = ms / 1000
        const hours = parseInt(String(Math.floor(sec / 3600)), 10)
        const minutes = parseInt(String(Math.floor(sec / 60) % 60), 10)
        const seconds = parseInt(String(sec % 60), 10)
        const str = [hours, minutes, seconds]
            .map((v) => v < 10 ? "0" + v : v)
            .filter((v, i) => v !== "00" || i > 0)
            .join(":")
        return str.startsWith("0") ? str.slice(1) : str
    }

    public static removeDirectory = (dir: string) => {
        if (dir === "/" || dir === "./") return
        if (fs.existsSync(dir)) {
            fs.readdirSync(dir).forEach(function(entry) {
                const entryPath = path.join(dir, entry)
                if (fs.lstatSync(entryPath).isDirectory()) {
                    functions.removeDirectory(entryPath)
                } else {
                    fs.unlinkSync(entryPath)
                }
            })
            try {
                fs.rmdirSync(dir)
            } catch (e) {
                console.log(e)
            }
        }
    }
}