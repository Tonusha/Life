var config = module.exports;

config["My tests"] = {
    rootPath: "../",
    environment: "browser", // or "node"
    sources: [
        "lib/life.js"
    ],
    tests: [
        "test/life-test.js"
    ]
}
