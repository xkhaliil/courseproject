# Pasta Quiz

A personality quiz that tells you which pasta you are, written in TypeScript as a pnpm and Nx monorepo. It is the course project for Advanced JavaScript and TypeScript.

The quiz asks three kinds of questions: multiple choice, a number on a scale, and yes or no. Each answer gives points to one outcome, and the outcome with the most points is your result.

The project has three apps that work together. An HTTP API serves the quizzes and keeps score. A command-line app and a web page both play through that API.

## Requirements

- Node.js 24 (the version in [.nvmrc](.nvmrc)). Node runs the TypeScript files directly, so the API and the CLI need no build step.
- pnpm 12. The root [package.json](package.json) pins it with `devEngines`, and pnpm downloads the right version if yours differs.

## Getting started

Install the dependencies and start the API. Both the CLI and the web app need it running.

```sh
pnpm install

# Terminal 1: the API, on http://localhost:3000
pnpm --filter @platform/api start
```

Then play in a second terminal, either in the terminal or in the browser:

```sh
# The CLI: play the pasta quiz, answering each question
pnpm --filter @platform/cli start play

# The CLI: replay the pasta quiz with the answers saved in apps/cli/saved/game.json
pnpm --filter @platform/cli start replay

# The web app: open the address Vite prints, http://localhost:5173 by default
pnpm --filter @platform/web dev
```

Each one sends the answers to the API and shows the result it sends back:

```
You are: Penne
Practical and direct, you get things done.
```

To check the whole project, run `pnpm lint` from the root.

## Scripts

Run these from the root. The lint scripts run the matching script in every package through Nx.

| Script                | What it does                                                |
| --------------------- | ----------------------------------------------------------- |
| `pnpm lint`           | Runs every check below, with results cached by Nx           |
| `pnpm lint-typecheck` | Type-checks each package with `tsc`                         |
| `pnpm lint-eslint`    | Lints each package with ESLint                              |
| `pnpm lint-prettier`  | Checks formatting with Prettier                             |
| `pnpm clean`          | Removes build caches and resets Nx                          |
| `pnpm start`          | Runs the CLI without a command, so it prints the CLI's help |

To run a script in one package only, use `--filter`, for example `pnpm --filter @platform/quiz lint`.

## Project layout

```
.
├── apps/
│   ├── api/                  @platform/api, the HTTP API that serves quizzes and keeps score
│   ├── cli/                  @platform/cli, plays a quiz in the terminal through the API
│   │   └── saved/            the saved game and settings that the replay command reads
│   └── web/                  @platform/web, plays a quiz in the browser through the API
├── features/
│   └── quiz/                 @platform/quiz, the quiz logic that the apps share
│       └── src/
│           ├── play/         types and checks for quizzes, answers, and API replies, scoring, and PlayState
│           ├── quizzes/      quiz data (pasta.json), listQuizzes, and loadQuiz
│           ├── saved/        reading and checking the saved game and settings files
│           └── services/     the functions the CLI and the web app use to call the API
├── internal/
│   └── tooling/              @platform/tooling, shared ESLint, Prettier, and TypeScript settings
├── .github/workflows/        CI, one workflow per package
├── nx.json
├── package.json
└── pnpm-workspace.yaml
```

Every folder of code is a modlet: other code reaches it only through its `index.ts`, never a file inside it.

### `@platform/api`

A [Fastify](https://fastify.dev) server in [apps/api](apps/api) that listens on port 3000 and accepts requests from any origin, so the web app can call it from the browser. A game is a session: you start one, send one answer per question, then ask for the result. Sessions live in memory, so restarting the API forgets them.

| Method | Path               | Body                     | Reply                                                      |
| ------ | ------------------ | ------------------------ | ---------------------------------------------------------- |
| GET    | `/quizzes`         |                          | The quiz names                                             |
| GET    | `/quizzes/:quizId` |                          | The quiz's outcomes and questions, without their scoring   |
| POST   | `/play`            | `{ "quiz": "<name>" }`   | `201` and the `session_id` of a new session                |
| GET    | `/play`            |                          | How many questions the session has answered, and the total |
| POST   | `/play/answer`     | The answer to a question | Records it as the answer to the next question              |
| GET    | `/play/result`     |                          | The winning outcome, once every question has an answer     |

The `/play` routes read the session from the `x-session-id` header. Each route declares the type of its body and of its reply for each status code, using the types in [responses.ts](features/quiz/src/play/responses.ts). Every error reply has the shape `{ "error": "<message>" }`, with `400` for a body that does not fit, `401` for an unknown session, `404` for an unknown quiz or route, and `409` for a request out of order. For example, with `curl`:

```sh
curl -X POST localhost:3000/play -H "content-type: application/json" -d '{"quiz":"pasta"}'
# {"session_id":"82836fa2-..."}

curl -X POST localhost:3000/play/answer -H "x-session-id: 82836fa2-..." \
  -H "content-type: application/json" -d '{"kind":"scale","value":2}'
```

While you work on the API, `pnpm --filter @platform/api dev` runs it with nodemon, which restarts it when a file in the API or the quiz package changes.

### `@platform/cli`

The command-line app in [apps/cli](apps/cli), built with [Commander](https://github.com/tj/commander.js). It has two commands, each in its own modlet under [src/commands](apps/cli/src/commands). Both take the quiz name as an argument, `pasta` by default.

- `play` asks each question with [Inquirer](https://github.com/SBoudrias/Inquirer.js) prompts: a list for multiple choice, a typed whole number within the question's range for a scale, and a yes or no confirm. Its `--name <name>` option greets you before the first question.
- `replay` plays the quiz again without asking, with the answers in [saved/game.json](apps/cli/saved/game.json), and greets the name in [saved/settings.json](apps/cli/saved/settings.json). It prints each question, the saved answer, and the result.

Run `pnpm --filter @platform/cli start --help` to see the commands and their options.

### `@platform/web`

A small web page in [apps/web](apps/web), served and built with [Vite](https://vite.dev). It shows how far along you are (Question 1 of 3), then each question as a heading with one button per option, and replaces the page with your result at the end. It always plays the pasta quiz, which is set in [src/main.ts](apps/web/src/main.ts). `pnpm --filter @platform/web build` builds it into `apps/web/dist`.

### `@platform/quiz`

The quiz logic in [features/quiz](features/quiz), split into four modlets:

- **play** holds the types of a quiz, its questions, answers, and choices, with a runtime check for each. It also holds the types of the API's replies in `responses.ts`, `show` and `award` for each kind of question, and `PlayState`, which tallies points per outcome and picks the winner.
- **quizzes** holds the quiz data as JSON, `listQuizzes()`, which lists the JSON files in that folder, and `loadQuiz(name)`, which reads `<name>.json` and checks it.
- **saved** holds `readSavedGame(file)` and `readSettings(file)`, which read those files and check them.
- **services** holds `getQuiz`, `playStart`, `playProgress`, `playAnswer`, and `playResult`, which call the API at `http://localhost:3000` and check each reply. The CLI and the web app get all their data through them.

The `exports` map in [package.json](features/quiz/package.json) maps `@platform/quiz/<folder>` to `src/<folder>/index.ts`. So `@platform/quiz/play` works, but `@platform/quiz/play/play-state` does not resolve, which keeps each modlet's internals private.

### `@platform/tooling`

The shared settings in [internal/tooling](internal/tooling): an ESLint config, a Prettier config, and a base `tsconfig`. The other packages extend them instead of keeping their own copies. The tools every package needs (`eslint`, `prettier`, `typescript`, and `@types/node`) are pinned once in the catalog in [pnpm-workspace.yaml](pnpm-workspace.yaml).

## Checks and errors

Everything that comes from outside the program is checked before it is used:

- **Quiz files:** `loadQuiz` checks that every outcome and question has the right shape, and that every outcome a question gives points to exists.
- **Request bodies:** the API checks the quiz name and every answer before it uses them.
- **API replies:** the services check every reply before an app sees it.
- **Saved files:** the replay command checks the saved game and the settings it reads.

When something goes wrong, the user sees one clear message instead of a crash. The CLI prints the message and exits with the code 1, the web page shows it in place of the quiz, and the API replies with it as `{ "error": "<message>" }`. For example, with the API stopped, both the CLI and the web page say `Cannot reach the quiz server at http://localhost:3000. Is it running?`.

## Adding a quiz

Add a JSON file to [features/quiz/src/quizzes](features/quiz/src/quizzes) with an `outcomes` list and a `questions` list, using [pasta.json](features/quiz/src/quizzes/pasta.json) as a template. A scale question sets its range with `min` and `max`, and the words for each end with `min_label` and `max_label`.

The API picks the quiz up by its file name: it appears in `GET /quizzes`, and `POST /play` with that name starts a game of it. To play it in the terminal, pass its name to the CLI, for example `pnpm --filter @platform/cli start play <name>`. The web app only plays the pasta quiz.

## Continuous integration

Each package has a GitHub Actions workflow in [.github/workflows](.github/workflows) that runs its typecheck, ESLint, and Prettier checks on push. A workflow runs only when its package, or a package it depends on, changes. For example, a change to `features/quiz` runs the workflows of the quiz package and of all three apps.

## Status

### What works

- Playing the pasta quiz in the terminal with `play`, or in the browser, through the API.
- Replaying a saved game with `replay`, through the same API.
- All six API routes, with typed bodies and replies and a clear error for each failure.
- Checks on every quiz file, request body, API reply, and saved file.
- `pnpm lint` passes, and the workflows pass on GitHub.

### What does not work yet

- Sessions live in the API's memory, so restarting the API loses every game in progress.
- The web page always plays the pasta quiz, and there is no way to choose another one in the browser.
- `play` does not save your answers, so `replay` always replays the hand-written [game.json](apps/cli/saved/game.json).
- The address of the API is fixed to `http://localhost:3000` in the services and the API.
- There are no automated tests. The checks are the typecheck, ESLint, and Prettier.
- `pnpm start` from the root only prints the CLI's help, because it runs the CLI without a command.

### What I would add next

- A list of the quizzes on the web page, from `GET /quizzes`, so you can pick one.
- Saving the answers of a `play` game to `saved/game.json`, so `replay` replays your own last game.
- Unit tests for the checks and for `PlayState`, run in CI.
- Reading the address and port of the API from an environment variable.
- Keeping sessions in a file or a database, so they survive a restart.
- A second quiz.

## Windows note

If `pnpm lint-prettier` reports files you have not changed on Windows, Git has probably converted the line endings to CRLF on checkout, while Prettier expects LF. Tell Git to keep LF and check the files out again:

```sh
git config core.autocrlf input
git rm --cached -r . -q
git reset --hard
```

The last command discards uncommitted changes, so commit or stash your work first.

## Credits

The shared quiz, API, CLI, and web code follows the course example [christopherjbaker/example-monorepo-quiz](https://github.com/christopherjbaker/example-monorepo-quiz) step by step, and each of those commits names the example commit it follows. The replay command, the saved files, the checks, the error handling, the progress line, and the app workflows were added on top.
