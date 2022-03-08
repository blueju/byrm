byrm -- blueju's yarn registry manager
===

[![NPM version][npm-image]][npm-url]

创建这个项目的初衷，

一来为了给部门同事提供方便，不再需要记住内部 npm 仓库地址、不再需要手敲命令设置 npm 仓库地址，提高工作效率。

二来这项工作也能给自己一个学习 i5ting（狼叔）源码的机会。

`byrm` can help you easy and fast switch between different npm registries,
now include: `npm-group`, `npm-taobao`, `thirdnpm `.

> `byrm` 能帮你简单快速地在不同 npm 仓库之间切换，目前包含的仓库有: `npm-group`, `npm-taobao`, `thirdnpm `。

## Install

> 安装

```
$ npm install -g byrm
```

## Example

> 示例

```
$ byrm ls

* npm-group ----- http://127.0.0.1:8080/repository/npm-group/
  npm-taobao ---- http://127.0.0.1:8080/repository/npm-taobao/
  thirdnpm ------ http://127.0.0.1:8080/repository/thirdnpm/

```

```
$ byrm use cnpm  // 切换到 npm-group 仓库

    仓库已切换到: http://127.0.0.1:8080/repository/npm-group/

```

## Usage

> 用法

```
Usage: byrm [options] [command]

  Commands:

    ls                           仓库列表
    use <registry>               使用哪个仓库
    home <registry> [browser]    使用默认浏览器打开仓库主页
    test [registry]              测试单个或所有仓库的响应时长
    help                         帮助信息

  Options:

    -h, --help     输出帮助信息
    -V, --version  输出版本号
```

## Registries

> 仓库列表

* [npm-group](http://127.0.0.1:8080/repository/npm-group/)    组合库（首选），包含了 `npm-taobao`, `thirdnpm `
* [npm-taobao](http://127.0.0.1:8080/repository/npm-taobao/)  代理库，代理到 taobao npm 镜像
* [thirdnpm](http://127.0.0.1:8080/repository/thirdnpm/)      私有库，存放私有依赖

## Notice

> 提示

When you use an other registry, you can not use the `publish` command.

> 当你使用其他仓库地址时，你无法使用 `publish` 这个命令进行发包。

[npm-image]: https://img.shields.io/npm/v/byrm.svg?style=flat-square
[npm-url]: https://npmjs.org/package/byrm