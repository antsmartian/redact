const { redact } = require("./lib/redact")
const { convertStringToStream } =require("./lib/helper")


const eventEmitter = redact("Hello world \"Boston Sox\", 'Pepperoni Pizza', 'Cheese Pizza', beer", convertStringToStream(`
    Hello world how are you
    pizz is second line Hello Pepperoni Pizza
    Pizza this Cheese Pizza is the thrid line
    etc world
    Boston Sox
    what if?
    beer is good
    hello boss Pizza beer
    Boston 
    
    
    Sox
    Yes
    
    a
    b
    
    c what is good here beer 
    
    hello 
    
    
    world
    
    
    wprld
    he;
    
    a
    a
    a
    a
    a
    a
    a
    a
    Boston 
    Sox
    a
    a
    a
`), (data) => {
    console.log(data)
}, {
    redactPattern: "XXXX"
})