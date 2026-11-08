# Pasta Quiz

A personality quiz that tells you which pasta you are, written in TypeScript as a pnpm and Nx monorepo. It is the course project for Advanced JavaScript and TypeScript.

The quiz asks three kinds of questions: multiple choice, a number on a scale, and yes or no. Each answer gives points to one outcome, and the outcome with the most points is your result.

The project has three apps: an HTTP API that serves quizzes and keeps score, plus two ways to play through it, a command-line app and a web page.

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
# The CLI: play the pasta quiz in the terminal
pnpm --filter @platform/cli start play

# The web app: open the address Vite prints, http://localhost:5173 by default
pnpm --filter @platform/web dev
```

Both ask the questions one at a time, send your answers to the API, and show your result:

```
You are: Penne
Practical and direct, you get things done.
```

## Scripts

Run these from the root. The lint scripts run the matching script in every package through Nx.

| Script                | What it does                                                |
| --------------------- | ----------------------------------------------------------- |
| `pnpm start`          | Runs the CLI without a command, so it prints the CLI's help |
| `pnpm lint`           | Runs every check below, with results cached by Nx           |
| `pnpm lint-typecheck` | Type-checks each package with `tsc`                         |
| `pnpm lint-eslint`    | Lints each package with ESLint                              |
| `pnpm lint-prettier`  | Checks formatting with Prettier                             |
| `pnpm clean`          | Removes build caches and resets Nx                          |

To run a script in one package only, use `--filter`, for example `pnpm --filter @platform/quiz lint`.

## Project layout

```
.
├── apps/
│   ├── api/                  @platform/api, the HTTP API that serves quizzes and keeps score
│   ├── cli/                  @platform/cli, plays a quiz in the terminal through the API
│   └── web/                  @platform/web, plays a quiz in the browser through the API
├── features/
│   └── quiz/                 @platform/quiz, the quiz logic
│       └── src/
│           ├── play/         questions, answers, choices, scoring, and the PlayState class
│           ├── quizzes/      quiz data (pasta.json), listQuizzes, and loadQuiz
│           ├── saved/        loading and checking a saved game
│           └── services/     the functions the CLI and the web app use to call the API
├── internal/
│   └── tooling/              @platform/tooling, shared ESLint, Prettier, and TypeScript settings
├── .github/workflows/        CI for the quiz and tooling packages
├── nx.json
├── package.json
└── pnpm-workspace.yaml
```

### `@platform/api`

A [Fastify](https://fastify.dev) server in [apps/api](apps/api) that listens on port 3000 and accepts requests from any origin, so the web app can call it from the browser. A game is a session: you start one, send one answer per question, then ask for the result. Sessions live in memory, so restarting the API forgets them.

| Method | Path               | What it does                                                               |
| ------ | ------------------ | -------------------------------------------------------------------------- |
| GET    | `/quizzes`         | Lists the quiz names                                                       |
| GET    | `/quizzes/:quizId` | Returns a quiz's outcomes and questions, without how each answer is scored |
| POST   | `/play`            | Starts a session for `{ "quiz": "<name>" }` and returns its `session_id`   |
| GET    | `/play`            | Returns how many questions the session has answered, out of the total      |
| POST   | `/play/answer`     | Records the answer to the next question                                    |
| GET    | `/play/result`     | Returns the winning outcome once every question has an answer              |

The `/play` routes read the session from the `x-session-id` header. For example, with `curl`:

```sh
curl -X POST localhost:3000/play -H "content-type: application/json" -d '{"quiz":"pasta"}'
# {"session_id":"82836fa2-..."}

curl -X POST localhost:3000/play/answer -H "x-session-id: 82836fa2-..." \
  -H "content-type: application/json" -d '{"kind":"scale","value":2}'
```

While you work on the API, `pnpm --filter @platform/api dev` runs it with nodemon, which restarts it when a file in the API or the quiz package changes.

### `@platform/cli`

The command-line app in [apps/cli](apps/cli), built with [Commander](https://github.com/tj/commander.js). Its `play` command takes the quiz name as an argument (`pasta` by default) and a `--name <name>` option that greets you before the first question. It asks each question with [Inquirer](https://github.com/SBoudrias/Inquirer.js) prompts: a list for multiple choice, a typed whole number within the question's range for a scale, and a yes or no confirm. Run `pnpm --filter @platform/cli start --help` to see every command.

### `@platform/web`

A small web page in [apps/web](apps/web), served and built with [Vite](https://vite.dev). It shows each question as a heading with one button per option, and replaces the page with your result at the end. It always plays the pasta quiz, which is set in [src/main.ts](apps/web/src/main.ts). `pnpm --filter @platform/web build` builds it into `apps/web/dist`.

### `@platform/quiz`

The quiz logic in [features/quiz](features/quiz), split into four folders that other code reaches only through their `index.ts`:

- **play** holds the types and runtime guards for each part of a quiz (`question.ts`, `answer.ts`, `choice.ts`, and `quiz.ts`), `show` and `award` for each kind of question, and `PlayState`, which tallies points per outcome and picks the winner.
- **quizzes** holds the quiz data as JSON, `listQuizzes()`, which lists the JSON files in that folder, and `loadQuiz(name)`, which reads `<name>.json`.
- **saved** holds `loadSavedGame`, which parses a saved game and rejects it if any answer has the wrong shape.
- **services** holds `getQuiz`, `playStart`, `playAnswer`, and `playResult`, which call the API at `http://localhost:3000`. The CLI and the web app both play through them.

The `exports` map in [package.json](features/quiz/package.json) maps `@platform/quiz/<folder>` to `src/<folder>/index.ts`. So `@platform/quiz/play` works, but `@platform/quiz/play/play-state` does not resolve, which keeps each folder's internals private.

### `@platform/tooling`

The shared settings in [internal/tooling](internal/tooling): an ESLint config, a Prettier config, and a base `tsconfig`. The other packages extend them instead of keeping their own copies. The tools every package needs (`eslint`, `prettier`, `typescript`, and `@types/node`) are pinned once in the catalog in [pnpm-workspace.yaml](pnpm-workspace.yaml).

## Adding a quiz

Add a JSON file to [features/quiz/src/quizzes](features/quiz/src/quizzes) with an `outcomes` list and a `questions` list, using [pasta.json](features/quiz/src/quizzes/pasta.json) as a template. A scale question sets its range with `min` and `max`, and the words for each end with `min_label` and `max_label`.

The API picks the quiz up by its file name: it appears in `GET /quizzes`, and `POST /play` with that name starts a game of it. To play it in the terminal, pass its name to the CLI, for example `pnpm --filter @platform/cli start play <name>`. The web app only plays the pasta quiz.

## Continuous integration

Two GitHub Actions workflows run on push, each only when its files change:

- **Features - Quiz** ([features-quiz.yml](.github/workflows/features-quiz.yml)) runs on changes to `features/quiz` or `internal/tooling`, and runs the typecheck, ESLint, and Prettier checks for the quiz package.
- **Internal - Tooling** ([internal-tooling.yml](.github/workflows/internal-tooling.yml)) runs on changes to `internal/tooling` and checks its formatting.

The `api`, `cli`, and `web` apps have no workflow yet. Run `pnpm lint` to check them locally.

## Windows note

If `pnpm lint-prettier` reports files you have not changed on Windows, Git has probably converted the line endings to CRLF on checkout, while Prettier expects LF. Tell Git to keep LF and check the files out again:

```sh
git config core.autocrlf input
git rm --cached -r . -q
git reset --hard
```

The last command discards uncommitted changes, so commit or stash your work first.

## Credits

This project follows the course example [christopherjbaker/example-monorepo-quiz](https://github.com/christopherjbaker/example-monorepo-quiz) step by step. Each commit names the example commit it follows.
