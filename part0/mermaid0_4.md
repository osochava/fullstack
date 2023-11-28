```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: Notes page loaded. User enters the new note data in the form and submit.
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_notes
    Note right of browser: New note is sent as the body of the POST request
    activate server
	Note left of server: The server adds the new note data into the notes array
    server-->>browser: URL redirect
    deactivate server

    Note right of browser: The browser reloads the Notes page

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "HTML is easy", "date": "2023-1-1" }, ... ]
    deactivate server

    Note right of browser: The browser executes the callback function that renders the notes
```