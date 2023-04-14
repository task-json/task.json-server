# task.json-server

[![Docker Image Size](https://badgen.net/docker/size/dcsunset/task.json-server)](https://hub.docker.com/r/dcsunset/task.json-server)
[![npm version](https://badgen.net/npm/v/task.json-server)](https://www.npmjs.com/package/task.json-server)
[![license](https://badgen.net/github/license/dcsunset/task.json-server)](https://github.com/DCsunset/task.json-server)


Sync server for [task.json](https://github.com/DCsunset/task.json).
It supports automatic conflicts handling and merging.

## Installation

### npm

```
npm i -g task.json-server
```

### Docker registry

```sh
docker pull dcsunset/task.json-server
podman pull docker.io/dcsunset/task.json-server
```

## Usage

If installed from npm:

```sh
NODE_ENV=production TJ_PASSWORD="mypass" TJ_JWT_SECRET="random" tj-server
```

If installed from docker registry:

```
docker run -d --name task.json-server -p 3000:3000 -v $PWD/data:/data dcsunset/task.json-server
```

Configurations can be set via environment variables.
Available configurations are listed below:

| Variables   | Default   | Description                           |
| ----------- | --------- | ------------------------------------- |
| TJ_ADDR        | `0.0.0.0` | Address to listen at (default to "localhost" in dev environment)      |
| TJ_PORT        | `3000`    | Port to listen at                     |
| TJ_DATA_PATH   | `./data`   | Absolute directory to store task.json |
| TJ_PASSWORD    | `admin`   | Login password (**should always change it**)   |
| TJ_JWT_SECRET  | `secret`   | Secret used to sign JWT (**should always change it**)  |
| TJ_JWT_EXPIRES_IN | `60d`   | The time JWT expires in (e.g. "60", "2m", "10h", "7d", default using ms if no unit) |

## License

All code licensed under AGPL-3.0. Full copyright notice:

    task.json-server
    Copyright (C) 2021-2023  DCsunset

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
