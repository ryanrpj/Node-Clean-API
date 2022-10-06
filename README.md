# TypeScript Clean Architecture
[🇧🇷 Leia em português](README-pt.md)
### ⚠️ *This is a WIP!*
Project built to give readers a practical example of TDD and Clean Architecture.
The result of those principles applied together is a loose coupled API, easy to
maintain and extend its behavior.

Currently, this API can only receive simple user data to create an account,
hash the user password, and save the data to a database.

Despite the simple behavior, there is a solid structure applied, which leaves the
doors open to build any system upon this one, regardless of framework implementations.
To exemplify, although I chose MongoDb to persist data, you can easily switch to any
database of your choice.

This freedom of change and choice is crucial for critical enterprise applications.

## Architecture Diagram
![Diagram of the system's architecture](assets/architecture_diagram.jpg)
