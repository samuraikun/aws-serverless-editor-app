# What's this repo?
- the app for my practice about [AWS Amplify](https://aws.amazon.com/jp/amplify/) & [AppSync](https://aws.amazon.com/jp/appsync/).

# Run on Local

- Node.js v10.16.0
- use `create-react-app`

```bash
npm i -g @aws-amplify/cli

yarn install

// If you signed up AWS console
amplify init

// use Cognito
amplify add auth

// select GraphQL API
amplify add api

yarn start
``
