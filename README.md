### API

`redact` takes the following argument:

```
  keywords/phrases - the keyword, phrases to be replaced
  Stream - a stream of data
  options - options to override the default behavior
```

Note: For now it the redact process is case sensitive.

#### Test Cases
Test are written in `jest`, run:

```
npm run test
```

#### Running

Have a look at `playground.js`, where you can hit the API `redact`

To run test/lint cases:

```
npm i 
```

and then run respective scripts


#### Thoughts and design consideration
The problem is solved by the following approach:

1. There are many ways to solve this problem, but looking at this problem, we need to make sure how it
   can be composed with many different systems in the future. It should be scalable and super fast.
2. Keeping that in mind, I made the `redact` API to consume the input as a `Stream`. Why?
   Because `Stream` is the core of everything in Node.js like `http`, `file`, `sockets` etc.
   So in future, I can make it as a lamda function, to process the incoming documents via http, queues etc (which are `Streams`)
3. The API is Async, so that it can process without blocking the main thread.
4. Also it tries to process the text in chunks. Hence, it can process large files without
   any memory issue. Imagine loading a 10gb text/file? The code will work without any issues.
5. It's config driven, currently it takes a simple `option`, but in future the `option`
   can have many things like ignore spaces, case insensitive etc.
6. Since the solution is built on Streams, it can handle backpressure (esp on slow consumers)
   out of the box.
7. We can package and ship it as a npm module too.

Simple eslint and jest test cases are covered too.

####Note
I have simple validations on the inputs, but that is not enough. There are many use cases, which
the input validator or the input parser have ignored (for now, due to time constraints). Just FYI.. 

Not all edge cases covered in the code, but we can extend it easily by adding many rules in the 
`validator.js`

