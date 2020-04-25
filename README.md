# Jarvis - инструмент для управления несколькими репозиториями #

При работе над проектом, который состоит из нескольких репозиториев, бывает необходимо
управлять этими репозиториями одновременно - клонировать сразу всё, одновременн осоздавать ветки в нескольких репозиториях и сливать их.

Этот инструмент позволяет описать все репозитории в файле конфигурации
и выполнять операции над ними, выбирая репозитории по имени или по назначенным меткам (label).

Инструмент оперирует такими понятиями как экземпляр (instance) приложения и репозиторий.
Например, вы можете в одной папке развернуть приложение из ветки master, а в другой папке - из ветки dev.

## Установка ##

```shell script
git clone git@github.com:MadridianFox/jarvis.git
cd ./jarvis
yarn install
sudo ln -s /path/to/jarvis/index.js /usr/local/bin/jarvis
```

## Настройка ##
Файл конфигурации jarvis - это yaml файл, в котором перечислены:
- корневая папка проекта
- url удалённого репозитория
- папка репозитория относительно корня проекта
- имя репозитория
- список меток репозитория

Пример файла конфигурации:
```yaml
path: /home/work/project42
repositories: 
  - name: front
    url: git@github.com:user/project42-front.git
    path: /apps/${INSTANCE}/${NAME}
    labels:
      type: app

  - name: back
    url: git@github.com:user/project42-back.git
    path: /apps/${INSTANCE}/${NAME}
    labels:
      type: app

  - name: api-client
    url: git@github.com:user/project42-api-client.git
    path: /libs/${NAME}
    labels:
      type: lib
```

При указании пути по которому будет лежать репозиторий, можно указывать переменные
`INSTANCE` - экземпляр приложения и `NAME` - имя репозитория.

##  Команды ##

Jarvis всегда требует указывать файл конфигурации.
Это можно сделать через опцию `-c, --config <filename>` или же задав переменную окружения `JARVIS_FILE`.

Кроме того, многие команды требуют указать фильтр для репозиториев.
Фильтр задаётся через опцию `-l, --label <condition>`. В качестве условия фильтрации можно использовать:
- `all` - все репозитории
- `<name>` - имя репозитория
- `<label>=<value>` - метка (label) репозитория

Опцию можно использовать несколько раз.
При указании нескольких условий, фильтр использует следующую логику:
- если указано слово `all`, то выбираются все репозитории без каких-либо проверок
- если указано одно или несколько имён, то будут выбраны репозитории чьи имена есть в этом списке, метки не провреяются
- если указаны несколько значений одной метки, то будут выбраны репозитории, у которых эта метка равна одному из указанных значений
- если указаны несколько разных меток, то будут выбраны репозитории, у которых есть каждая из указанных меток и они равны заданным значениям

Фильтр для всех репозиториев. Можно использовать как длинную опцию так и короткую, а так же можно опустить пробел в короткой. 
```shell script
jarvis --label=all
jarvis -l all
jarvis -lall
```

Фильтр по имени репозитория:
```shell script
jarvis --label=front
jarvis -l front
jarvis -lfront
```
Можно указать несколько имён. Можно использовать интерполяцию списка bash для сокращениия:
```shell script
jarvis -lfront -lback
jarvis -l{front,lback}
```
Фильтр по метке `type`. Можно указать несколько значений:
```shell script
jarvis -c project.yml status -ltype=app rewiew
jarvis -c project.yml status -ltype=app -ltype=lib rewiew
jarvis -c project.yml status -ltype={app,lib} rewiew
```

### Команда deploy ###
```shell script
jarvis -c project.yml deploy -lall rewiew
```
Клонировать все репозитории в экземпляр с названием `rewiew`.

### Команда status ###
```shell script
jarvis -c project.yml status -lall rewiew
```
Показать ветку и состояние репозитория.

### Команда update ###
```shell script
jarvis -c project.yml update -lall rewiew
```
Выполняет `git reset --hard && git pull origin <current_branch>` в каждом репозитории.

### Команда to-branch ###
```shell script
jarvis -c project.yml to-branch -lall rewiew task-123
```
Переключает ветку на `task-123`. Если ветки нет, то она будет создана.