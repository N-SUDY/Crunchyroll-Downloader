import axios from "axios"
import fs from "fs"
import path from "path"

let timer = null as any
let mouseDown = false
if (typeof window !== "undefined") {
    document.onmousedown = () => {
        mouseDown = true
    }
    document.onmouseup = () => {
        mouseDown = false
    }
}

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

    public static stripLocale = (link: string) => {
        return link
        .replace("https://www.crunchyroll.com/en-gb", "https://www.crunchyroll.com/")
        .replace("https://www.crunchyroll.com/es", "https://www.crunchyroll.com/")
        .replace("https://www.crunchyroll.com/es-es", "https://www.crunchyroll.com/")
        .replace("https://www.crunchyroll.com/pt-br", "https://www.crunchyroll.com/")
        .replace("https://www.crunchyroll.com/pt-pt", "https://www.crunchyroll.com/")
        .replace("https://www.crunchyroll.com/fr", "https://www.crunchyroll.com/")
        .replace("https://www.crunchyroll.com/de", "https://www.crunchyroll.com/")
        .replace("https://www.crunchyroll.com/ar", "https://www.crunchyroll.com/")
        .replace("https://www.crunchyroll.com/it", "https://www.crunchyroll.com/")
        .replace("https://www.crunchyroll.com/ru", "https://www.crunchyroll.com/")
    }

    public static parseLocale = (locale: string) => {
        if (locale === "jaJP") return "Japanese"
        if (locale === "enUS") return "English"
        if (locale === "enGB") return "English"
        if (locale === "esES") return "Spanish"
        if (locale === "esLA") return "Spanish"
        if (locale === "frFR") return "French"
        if (locale === "deDE") return "German"
        if (locale === "itIT") return "Italian"
        if (locale === "ruRU") return "Russian"
        if (locale === "ptBR") return "Portuguese"
        if (locale === "ptPT") return "Portuguese"
        if (locale === "arME") return "Arabic"
        if (locale.toLowerCase() === "japanese") return "jaJP"
        if (locale.toLowerCase() === "english") return "enUS"
        if (locale.toLowerCase() === "spanish") return "esES"
        if (locale.toLowerCase() === "french") return "frFR"
        if (locale.toLowerCase() === "german") return "deDE"
        if (locale.toLowerCase() === "italian") return "itIT"
        if (locale.toLowerCase() === "russian") return "ruRU"
        if (locale.toLowerCase() === "portuguese") return "ptPT"
        if (locale.toLowerCase() === "arabic") return "arME"
        return "None"
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

    public static autoScroll = (event: MouseEvent) => {
        if (!mouseDown) return
        const edgeSize = 100
        const edgeTop = edgeSize
        const edgeBottom = (document.documentElement.clientHeight - edgeSize)
        const isInTopEdge = (event.clientY < edgeTop)
        const isInBottomEdge = (event.clientY > edgeBottom)
        if (!isInTopEdge && !isInBottomEdge) {
            clearTimeout(timer)
            return
        }
        const maxScrollY = (document.body.scrollHeight - document.documentElement.clientHeight)
        const adjustScroll = () => {
            const currentScrollY = window.pageYOffset
            const canScrollUp = (currentScrollY > 0)
            const canScrollDown = (currentScrollY < maxScrollY)
            let nextScrollY = currentScrollY
            const maxStep = 50
            if (isInTopEdge && canScrollUp) {
                const intensity = ((edgeTop - event.clientY) / edgeSize)
                nextScrollY = (nextScrollY - (maxStep * intensity))
            } else if (isInBottomEdge && canScrollDown) {
                const intensity = ((event.clientY - edgeBottom) / edgeSize)
                nextScrollY = (nextScrollY + (maxStep * intensity))
            }
            nextScrollY = Math.max(0, Math.min(maxScrollY, nextScrollY))
            if (nextScrollY !== currentScrollY) {
                window.scrollTo(window.pageXOffset, nextScrollY)
                return true
            } else {
                return false
            }
        }
        const checkScroll = () => {
            clearTimeout(timer)
            if (!mouseDown) return
            if (adjustScroll()) {
                timer = setTimeout(checkScroll, 30)
            }
        }
        checkScroll()
    }
}