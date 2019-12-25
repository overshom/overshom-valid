# overshom-valid

<a href="https://www.npmjs.com/package/overshom-valid"><img src="https://img.shields.io/npm/v/overshom-valid.svg" alt="npm package" /></a>

> Powerful TypeScript validation

* 💪 Completely typed runtime validation with TypeScript.
* 🧠 Full intellisense support.
* `[ ℹ️, ℹ️, ℹ️ ]` Accumulated errors = see all validation errors at once.
* 🍞 Breadcrumbs-enhanced errors let you understand exact key failed validation.
* ⭐ Intuitive schema definitions and clear return type.
* 🚀 Easily customizable.
* 💫 Zero dependecy.

# Installation

``` sh
yarn add overshom-valid
# or
npm i overshom-valid
```

# Usage

``` ts
import { v } from 'overshom-valid'

enum USER_ROLE {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

const UserDto = v.class({
    login: v
        .String()
        .min(4)
        .max(16)
        .pattern(/^\w+$/),

    role: v.Object({
        type: v.Enum(USER_ROLE),
    }),

    avatar: v
        .String()
        .optional(),
})

const user = new UserDto(`{
    "login": "overshom",
    "role": {
        "type": "ADMIN"
    }
}`)
```

# More use cases

Inspect `*.spec.ts` files inside `./src/` directory to see more use cases of validations.

