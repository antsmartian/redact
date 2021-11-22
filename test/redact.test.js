const { redact } = require("../lib/redact")
const { convertStringToStream } =require("../lib/helper")

test('replaces the given keyword', (done) => {
    let buffer = ""
    const emitter = redact("Hello world \"Boston Sox\", 'Pepperoni Pizza', 'Cheese Pizza', beer", convertStringToStream(`Hello world how are you`), (data) => {
        buffer += data;
    })

    emitter.on('done', () => {
        expect(buffer).toBe("XXXX XXXX how are you")
        done();
    })
})

test('replaces the given pharses', (done) => {
    let buffer = ""
    const emitter = redact("Hello world \"Boston Sox\", 'Pepperoni Pizza', 'Cheese Pizza', beer", convertStringToStream(`Hello world how are Pepperoni Pizza`), (data) => {
        buffer += data;
    })

    emitter.on('done', () => {
        expect(buffer).toBe("XXXX XXXX how are XXXXXXXX")
        done();
    })
})


test('doesn"t replace if there is no match', (done) => {
    let buffer = ""
    const emitter = redact("Hello world \"Boston Sox\", 'Pepperoni Pizza', 'Cheese Pizza', beer", convertStringToStream(`you can't replace me`), (data) => {
        buffer += data;
    })

    emitter.on('done', () => {
        expect(buffer).toBe("you can't replace me")
        done();
    })
})