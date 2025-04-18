# DB interaction
**For DB interaction use tpope/vim-dadbod plugin**
there is one single command `:DB` which is capable of running sql queries
the command format is the following:

```
:[prefix]<DB> <url> [query]
- [prefix] - optional command prefix which can be
  - :%DB <url> - passes whole current file as sql query to the DB command
  - :'<,'>DB <url> - passes visual selection as sql query to th DB command
- <url> - url <postgres://user:pass@db.example.com/production_database>
             ^          ^    ^    ^              ^
             db type    usr  pwd  db_host        db_name
             ommiting passsword will force vim to output pwd prompt
url can also be saved as vim variables: let g:someDB = <url>
```
So from my point of view the best way to use this plugin is to simply
save urls in vim variables for oftenly used dbs and then use the command
without any aliases or extra commands on top of it simply passing the right
vim variable.

# System clipboard
I used to paste text into vim simply by:
- switching to insert mode
- pressing `Cmd + v`
Pasting text from system buffer this way became very slow after upgrade
to Macos Sequoia.

But this isn't the best wayt to paste text into vim from system clipboard.
When pasting it with `Cmd + v` vim treats it as a user input and there is
additional processing done by vim.

The best way to paste text into vim is to use `"+p` command in normal mode.
