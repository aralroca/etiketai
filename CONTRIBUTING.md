# Contributing

This document is intended for developers interest in making contributions to Etiketai.

## Getting Started

This steps will help you to set up your development environment. That includes all dependencies we use to build Etiketai and developer tooling.

1. Clone the git repository: `git clone git@github.com:aralroca/etiketai.git`
2. Go into the cloned folder: `cd etiketai/`
3. Install all dependencies: `yarn`
4. Open the app in localhost: `yarn dev`

## Important files

- `src/context` - In this file there is all the state manipulations.
- `src/context/useRedraw.js` - In this file there are all related with repainting the canvas after a state manipulation.
- `src/context/useMenu.js` - Here is each item of the menu: the menu label, the icon, hotkeys, action, when is disabled, etc.
- `src/components/Dashboard/index.js` - This is the main component, the dashboard. Inside there are three parts: Left (left menu), Center (the canvas) and Right (right menu).

## Creating your first Pull-Request

We try to make it as easy as possible to contribute to Etiketai and make heavy use of GitHub's "Draft PR" feature which tags Pull-Requests (short = PR) as work in progress. PRs tend to be published as soon as there is an idea that the developer deems worthwhile to include into Etiketai and has written some rough code. The PR doesn't have to be perfect or anything really.

Once a PR or a Draft PR has been created our community typically joins the discussion about the proposed change. Sometimes that includes ideas for test cases or even different ways to go about implementing a feature. 


## Commonly used scripts for contributions

Scripts can be executed via `npm run [script]` or `yarn [script]` respectively.

- `format` - format the code
- `test` - Run all unit/integration tests.
- `test:watch` - Same as above, but it will automatically re-run the test suite if a code change was detected.


## How to create a good bug report

The best way to reproduce the issue on our machine is to provide a list of all the necessary steps to reproduce it. Also would be shared the browser version, operating system version, and Etiketai version. As optional you can also upload a GIF or video recording the issue... it would be very helpful!

To find out the current version of Etiketai, you can follow this link: https://etiketai.vercel.app/@version


## I have more questions on how to contribute to Etiketai. How can I reach you?

For now, as we are a small community, you can contact me directly (Aral) through my email: contact@aralroca.com. As we grow, we will look for other platforms for discussions, like GitHub Discussions, Slack or others.
