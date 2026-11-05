/*
=======
generate innertube data
=======
*/
console.log("== generating innertube data")

let ua = config.userAgent ||
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0"

constants.headers["user-agent"] = ua

fetch("https://www.youtube.com/", {
    headers: {
        "user-agent": ua,
        "accept": "text/html"
    },
    timeout: 15000
}).then(async r => {
    if (!r.ok) throw new Error("YouTube HTTP " + r.status)

    const cookie = r.headers.get("set-cookie") || ""
    constants.headers.cookie = cookie

    const res = await r.text()
    const match = res.match(/"INNERTUBE_CONTEXT":(\{.*?\}),"user":\{"lockedSafetyMode":/)

    if (!match) throw new Error("Innertube context not found")

    constants.cached_innertube_context = JSON.parse(match[1])

    fs.writeFileSync(
        "./back/yt2009constants.json",
        JSON.stringify(constants)
    )

    console.log("Innertube data generated")
    setTimeout(downloadFile, 402)

}).catch(error => {
    console.log("YouTube initialization failed:", error.message)
    console.log("Skipping automatic Innertube generation.")
})
