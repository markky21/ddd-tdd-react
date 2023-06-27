# Implementation of DDD application written in OO TS and React

## The idea behind this app

The idea behind this app is to create an example of an FE app written in DDD with Object Oriented TypeScript and React. 
The app is a port of an C# app demonstrated in Valdimir Khorikov online course "Domain Driven Design in Practice". 

## How to run the app

## Architectural structure

The app is structured in a way that each domain is a separate folder.
1. `snack-machine-domain` 
2. `atm-domain`

Each domain has layers:
1. `model` - contains domain entities and value objects. Models are responsible for all business logic.
2. `repository` - contains domain repositories. Repositories are responsible for data access.
3. `service` - contains domain services. Services are responsible for business logic that is not a part of domain entities but required from view perspective.
4. `view` - contains UI components
