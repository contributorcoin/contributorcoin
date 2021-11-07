# Contributorcoin

> ⚠ The Contributorcoin code is in a very primitive state, more of a proof of concept than a working cryptocurrency. Therefore, it is not suitable for production at this time.

Contributorcoin is an open-source cryptocurrency by and for open-source contributors and projects. The basic premise is to help ease the inherent monetary problem of contributing to open-source, both on the project side and the contributor side. Great open-source projects may fall by the wayside due to lack of funding and the time commitment for contributors is not compensated appropriately.

The goal is to make a cryptocurrency that rewards contributions to open-source by sending this cryptocurrency to the approver(s) and the contributor(s) of a pull request. The idea is to make this light weight and seamless to not disturb the regular developer workflow.

## Ideal contribution workflow

1. Our GitHub action is added to a project or organization
2. A project must meet certain criteria:
	- Be completely open-source and allow public pull requests
	- Maintain a specified minimum star count
	- Require a certain number of pull request reviews
3. Each developer that wishes to participate creates their public and private keys for their wallet.
	- The public key is linked to their profile, meaning they only need to do this once and it works on all GitHub projects with the app active
	- The private key is never stored anywhere, so the developer is responsible for knowing theirs
4. A contributor makes a pull request
5. The PR is reviewed
6. The PR is merged into the main branch
7. This triggers the GitHub action and starts a contribution transaction
	1. Merge commit URL is sent to Contributorcoin API
	2. The transaction process is initiated on the blockchain
	3. The commit and PR are verified based on the URL
	4. A reward transaction is created for the approver(s)
	5. A reward transaction is created for the contributor(s)

## Current project usage

### API and Commands

This version is created for a local development environment and is not ready for production. By running `yarn dev` a HTTP port is opened at `:3001` and a P2P port is opened at `:5001`. Please see below to learn more about nodes and ports. You can make API calls through a service like [Postman](https://www.postman.com/), mimicking the blockchain functionality with the below commands:

- `GET /blocks`: retrieves the current blockchain
- `GET /block/:hash`: retrieves specific block by hash
- `POST /create`: creates a new block from existing transactions (this is only used for testing purposes and should be removed or better protected later)
- `GET /transactions`: retrieves all transactions in the transaction pool
- `POST /exchange`: creates a new exchange transaction **NEEDS FIXING**
- `POST /contribute`: creates a new contribution transaction (this is the core element of Contributorcoin, needs a lot of work for validation, etc.)
- `POST /stake`: creates a new stake transaction **NEEDS FIXING**
- `GET /public-key`: retrieves the public key for the current wallet
- `GET /balance`: retrieves the balance of the current wallet
- `GET /balance/:publicKey`: retrieves the account balance of an account based on the public key

### Extra nodes

You can also setup extra nodes by adding environment variables in a new terminal window

#### Environment variables

- `HTTP_PORT`: defaults to `:3001` and can be set to any other for additional nodes
- `P2P_PORT`: defaults to `:5001` and can be set to any other for additional nodes
- `PEERS`: defaults to an empty array [] and you can add a comma-separated string of other nodes (eg. ws://localhost:3001 to connect to the original default node)

## Contributing to Contributorcoin

We strive to be an open-source community that welcomes any and all ideas and contributions. Have a change or a suggestion? Feel free to [open a pull request](https://github.com/contributorcoin/contributorcoin/compare) with your changes or reach out on [GitHub](https://github.com/contributorcoin), [Twitter](https://twitter.com/contributorcoin), [Reddit](https://www.reddit.com/r/Contributorcoin/) or [Discord](https://discord.gg/2hca8ytYZv). We welcome all input, no matter how big or small!

### Current initiatives that need help

#### Cryptocurrency setup

We are researching the best ways to integrate this into the crypto landscape, with some considerations.

#### Security

As with any cryptocurrency, the highest priority is the security of the users and their accounts.

#### GitHub Action

We have a basic [GitHub action](https://github.com/contributorcoin/contribute-action) that is added to a project and initiates a contribution transaction on a PR merge commit to the main branch. This action is still in testing stages and we also hope to allow other providers in the future, such as GitLab and Bitbucket.

#### Testing

Our project has Jest installed and basic tests have been setup.

#### Documentation

We believe in the importance of documentation, both for developers and general users.
