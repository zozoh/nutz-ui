#### 这个目录存放ide的配置项，主要是为了大家写出的css，js缩进格式统一
      

##### Sublime Text 2

用户设置跟快捷键设置可以根据个人习惯来设

仿照Eclipse的常用快捷键，给出了st2.keybindings.usr这个配置文件
      
      

st2本身不支持format，需要安装插件来支持，那么先安装Package Control

下面给出一个安装方法：

1. 打开 Sublime Text 2，按下 Control + \` 调出 Console，通常这个快捷键会与PC上的其它软件起冲突，需要修改其它软件的这个快捷键。
2. 将以下代码粘贴进命令行中并回车：`import urllib2,os;pf='Package Control.sublime-package';ipp=sublime.installed_packages_path();os.makedirs(ipp) if not os.path.exists(ipp) else None;open(os.path.join(ipp,pf),'wb').write(urllib2.urlopen('http://sublime.wbond.net/'+pf.replace(' ','%20')).read())`
3. 重启 Sublime Text 2，如果在 Preferences -> Package Settings中见到Package Control这一项，就说明安装成功了。

### JS
使用 JsFormat 这个插件, 设置稍后上


## Aptana