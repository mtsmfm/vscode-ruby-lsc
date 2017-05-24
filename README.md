# ruby-lsc

ruby-lsc is a vscode extension to develop ruby application.
ruby-lsc is using [language_server-ruby](https://github.com/mtsmfm/language_server-ruby).

## Installation

The recommended way to boot a language server is using docker.

https://docs.docker.com/engine/installation

## Development

This section explains how to start development vscode-ruby-lsc with language_server-ruby.

### Requirements

#### docker, docker-compose

https://docs.docker.com/engine/installation

#### docker-sync

https://github.com/EugenMayer/docker-sync/wiki/1.-Installation

### Setup

1. Setup vscode-ruby-lsc

    $ git clone https://github.com/mtsmfm/vscode-ruby-lsc.git
    $ cd vscode-ruby-lsc
    $ docker-compose run app yarn install

2. Setup language_server-ruby

Follow https://github.com/mtsmfm/language_server-ruby#development

### Open development version

1. Open vscode-ruby-lsc via vscode

    $ cd /path/to/vscode-ruby-lsc
    $ code .

2. Start debug (press F5)

3. Open language_server-ruby on the new vscode window (press Cmd-o)
