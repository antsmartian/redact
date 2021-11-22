const readline = require('readline');
const EventEmitter = require('events');
const { validateInput } = require("./validator")

class RedactEmitter extends EventEmitter {}

const SPACE = " ";
const DEFAULT_OPTIONS = {
    redactPattern : "XXXX"
}
const redactText = ({keywords, phrases}, string, option) => {
    let processedText = string;
    const { redactPattern } = option
    const replace = (words, isPhrase) => {
        words.forEach((keyword) => {
            processedText = processedText.replace(new RegExp(keyword, 'g'),
                        isPhrase ? redactPattern.repeat(keyword.split(" ").length) : redactPattern)
        })
    }

    // regex to ignore new lines for the phrases
    const phrasesIgnoreNewLines = phrases.map((phrase) => {
        return phrase.split(" ").join("[\\s\\S]*")
    })

    replace(phrases, true);
    replace(keywords);

    // try to find if there is an exact match
    // even in new lines
    phrasesIgnoreNewLines.forEach((keyword) => {
        const regexp = new RegExp(keyword, 'g')
        if(processedText.match(regexp))
        {
            const actualKeyword = keyword.replace("[\\s\\S]*"," ")
            actualKeyword.split(SPACE).forEach((k) => {
                processedText = processedText.replace(k,redactPattern)
            })
        }
    })

    return processedText;
}

const parseKeywordsPharases = (keywordsPharases) => {

    const phrases = [];
    let keywords = keywordsPharases.replace(/["|']([^"|']+)["|']/gm, (match, group) => {
        phrases.push(group);
        return "";
    });

    keywords = keywords.match(/[^\s|,]+/gm) || [];

    return {
        keywords,
        phrases
    }
}


const redact = (keywordsPharases, stream, callback, options) => {

    const option = Object.assign(DEFAULT_OPTIONS, options || {})
    const emitter = new RedactEmitter();
    if (!validateInput(keywordsPharases)) {
        const ERR = {"error": "missing single/double quote"};
        emitter.emit("error", () => new Error(ERR))
        return emitter;
    }

    const { keywords, phrases } = parseKeywordsPharases(keywordsPharases);
    let bufferSize = 1
    if (phrases.length >= 1) {
        bufferSize = phrases.sort((a, b) => b.length - a.length)[0].split(" ").length * 2 + 3
    }
    let buffer = ``;
    let lineCount = 0;

    // create an read interface
    const rl = readline.createInterface({
        input: stream,
        output: process.stdout,
        terminal: false
    });

    const handleLine = (line) => {
        buffer += `${line}\n`
        if (lineCount === bufferSize){
            // remove the \n
            buffer = buffer.slice(0, -1)
            // process the replace
            callback(redactText({ keywords, phrases }, buffer, option))

            //flush the buffer
            buffer = ``
            lineCount = 1
        } else if (line.trim() !== '') { //increase the processed count only it has characters
                lineCount++
        }
    }

    const handleClose = () => {
        //flush the remaining buffer after process
        if (buffer !== '') {
            callback(redactText({ keywords, phrases }, buffer.slice(0, -1), option))
        }
    }

    // start the process
    rl.on('line', handleLine);
    rl.on('close',() => {
        handleClose()
        emitter.emit("done") //let the consumer knows its done
    });

    return emitter;
}



module.exports = { redact }