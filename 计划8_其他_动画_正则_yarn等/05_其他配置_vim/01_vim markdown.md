## 插件说明
```
" If you have nodejs and yarn
Plug 'iamcco/markdown-preview.nvim', { 'do': 'cd app && yarn install'  } 

PlugInstall

https://github.com/iamcco/markdown-preview.nvim
```

```
Mappings:

" normal/insert
<Plug>MarkdownPreview
<Plug>MarkdownPreviewStop
<Plug>MarkdownPreviewToggle

" example
nmap <C-s> <Plug>MarkdownPreview
nmap <M-s> <Plug>MarkdownPreviewStop
" nmap <C-p> <Plug>MarkdownPreviewToggle
```
