# Pasta Quiz

A personality quiz that tells you which pasta you are, written in TypeScript as a pnpm and Nx monorepo. It is the course project for Advanced JavaScript and TypeScript.

The quiz asks three kinds of questions: multiple choice, a 1 to 5 scale, and yes or no. Each answer gives points to one outcome, and the outcome with the most points is your result.

## Requirements

- Node.js 24 (the version in [.nvmrc](.nvmrc)). Node runs the TypeScript files directly, so there is no build step.
- pnpm 12. The root [package.json](package.json) pins it with `devEngines`, and pnpm downloads the right version if yours differs.

## Getting started

```sh
pnpm install
pnpm start
```

`pnpm start` plays the pasta quiz with a saved set of answers and prints the result:

```
## Questions

How do you like your Sunday?
  1. Cooking for friends
  2. Reading with a blanket
  3. A long walk
Hint: There is no wrong answer.
Your answer worth 2 points for penne

How much do you enjoy trying new things? (1 = not at all, 5 = a lot)
Your answer worth 2 points for farfalle

Do you plan trips in advance? (yes or no)
Your answer worth 1 points for penne

## Result

You are: Penne
Practical and direct, you get things done.
```

## Scripts

Run these from the root. `start` runs the CLI, and the others run the matching script in every package through Nx.

| Script                | What it does                                      |
| --------------------- | ------------------------------------------------- |
| `pnpm start`          | Runs the CLI                                      |
| `pnpm lint`           | Runs every check below, with results cached by Nx |
| `pnpm lint-typecheck` | Type-checks each package with `tsc`               |
| `pnpm lint-eslint`    | Lints each package with ESLint                    |
| `pnpm lint-prettier`  | Checks formatting with Prettier                   |
| `pnpm clean`          | Removes build caches and resets Nx                |

To run a script in one package only, use `--filter`, for example `pnpm --filter @platform/quiz lint`.

## Project layout

```
.
├── apps/
│   └── cli/                  the script that plays a quiz
├── features/
│   └── quiz/                 @platform/quiz, the quiz logic
│       └── src/
│           ├── play/         types, type guards, scoring, and the Session class
│           ├── quizzes/      quiz data (pasta.json) and loadQuiz
│           └── saved/        loading and checking a saved game
├── internal/
│   └── tooling/              @platform/tooling, shared ESLint, Prettier, and TypeScript settings
├── .github/workflows/        CI for the quiz and tooling packages
├── nx.json
├── package.json
└── pnpm-workspace.yaml
```

### `cli`

The command-line app in [apps/cli](apps/cli). [src/index.ts](apps/cli/src/index.ts) loads the pasta quiz, records each saved answer in a `Session`, and prints the questions and the result. The answers come from [src/saved.ts](apps/cli/src/saved.ts), which stores them as JSON text, the way a saved game would come back from a file.

### `@platform/quiz`

The quiz logic in [features/quiz](features/quiz), split into three folders that other code reaches only through their `index.ts`:

- **play** holds the `Quiz`, `Question`, and `Answer` types, the guards that check unknown data at runtime, `show` and `award` for each kind of question, and `Session`, which tallies points per outcome and picks the winner.
- **quizzes** holds the quiz data as JSON and `loadQuiz(name)`, which reads `<name>.json` from that folder.
- **saved** holds `loadSavedGame`, which parses a saved game and rejects it if any answer has the wrong shape.

The `exports` map in [package.json](features/quiz/package.json) maps `@platform/quiz/<folder>` to `src/<folder>/index.ts`. So `@platform/quiz/play` works, but `@platform/quiz/play/session` does not resolve, which keeps each folder's internals private.

### `@platform/tooling`

The shared settings in [internal/tooling](internal/tooling): an ESLint config, a Prettier config, and a base `tsconfig`. The other packages extend them instead of keeping their own copies. The tools every package needs (`eslint`, `prettier`, `typescript`, and `@types/node`) are pinned once in the catalog in [pnpm-workspace.yaml](pnpm-workspace.yaml).

## Adding a quiz

1. Add a JSON file to [features/quiz/src/quizzes](features/quiz/src/quizzes) with an `outcomes` list and a `questions` list. Use [pasta.json](features/quiz/src/quizzes/pasta.json) as a template.
2. Load it in [apps/cli/src/index.ts](apps/cli/src/index.ts) with `loadQuiz("<file name without .json>")`.
3. Update the answers in [apps/cli/src/saved.ts](apps/cli/src/saved.ts) so there is one answer per question, of the same kind, in the same order.

## Continuous integration

Two GitHub Actions workflows run on push, each only when its files change:

- **Features - Quiz** ([features-quiz.yml](.github/workflows/features-quiz.yml)) runs on changes to `features/quiz` or `internal/tooling`, and runs the typecheck, ESLint, and Prettier checks for the quiz package.
- **Internal - Tooling** ([internal-tooling.yml](.github/workflows/internal-tooling.yml)) runs on changes to `internal/tooling` and checks its formatting.

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
