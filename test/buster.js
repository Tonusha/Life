var config = module.exports;

config["My tests"] = {
    rootPath: "../",
    environment: "browser", // or "node"
    sources: [
        "lib/jquery-1.8.0.min.js",
        "lib/calc.js",
        "lib/draw.js"
    ],
    tests: [
        "test/life-test.js"
    ]
}
