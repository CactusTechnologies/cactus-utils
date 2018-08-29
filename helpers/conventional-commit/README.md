<!-- TITLE/ -->

<h1>cz-cactus</h1>

<!-- /TITLE -->

<!-- DESCRIPTION/ -->

A custom Commitizen plugin to help achieve consistent commit messages like grown ups.

<!-- /DESCRIPTION -->

## Install

First, install the Commitizen cli tools:

```bash
npm install commitizen -g
```

Next, initialize your project to use the cz-cactus adapter by typing:

```bash
    commitizen init cz-cactus --save-dev --save-exact
```

> Pro TIP: set as default adapter for your projects

```bash
npm install --global cz-cactus
echo '{ "path": "cz-cactus" }' > ~/.czrc
```

## Usage

```sh
$ git cz
```

## Customize

You can customize the `scopes` on a project basis by adding a configuration section in your `package.json`:

```json
{
    "config": {
        "scopes": ["home", "accounts", "ci"]
    }
}
```

<!-- LICENSE/ -->

<h2>License</h2>

Unless stated otherwise all works are:

<ul><li>Copyright &copy; <a href="http://www.cactus.is">Cactus Technologies LLC</a></li></ul>

and licensed under:

<ul><li><a href="http://spdx.org/licenses/MIT.html">MIT License</a></li></ul>

<!-- /LICENSE -->
